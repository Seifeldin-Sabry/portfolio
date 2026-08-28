/**
 * Eval suite (CI regression gate):
 *   - runs each golden question through the real agent (RAG + guardrails),
 *   - scores with Mastra evals (answer relevancy, faithfulness) judged by Groq,
 *   - persists per-question rows to eval_runs (dashboard reads these),
 *   - fails the build when average faithfulness drops below threshold.
 */
import { neon } from "@neondatabase/serverless";
import {
  createAnswerRelevancyScorer,
  createFaithfulnessScorer,
} from "@mastra/evals/scorers/prebuilt";

import { mastra } from "../src/mastra/index";
import { evalCases } from "../evals/dataset";

const JUDGE_MODEL = "groq/llama-3.3-70b-versatile";
const FAITHFULNESS_GATE = 0.7;

async function main() {
  const sql = neon(process.env.POSTGRES_CONNECTION_STRING!);
  const gitSha = process.env.GIT_SHA ?? "local";
  const agent = mastra.getAgent("portfolioAgent");

  const relevancy = createAnswerRelevancyScorer({ model: JUDGE_MODEL });

  const faithScores: number[] = [];

  for (const c of evalCases) {
    // Tag eval traffic so Langfuse separates it from production visitors:
    // environment=ci, one session per eval run (git sha).
    const res = await agent.generate(c.question, {
      tracingOptions: {
        metadata: {
          environment: "ci",
          traceName: "eval-run",
          sessionId: `eval:${gitSha}`,
          userId: "ci",
          source: "ci",
        },
      },
    });
    const answer = res.text;

    // context = what the agent's retrieval tool returned during the run
    const toolResults = res.steps
      ?.flatMap((s: any) => s.toolResults ?? [])
      .flatMap((tr: any) => tr?.result?.results ?? [])
      .map((r: any) => r.text)
      .filter(Boolean) as string[];
    const context = toolResults?.length ? toolResults : [answer];

    // Faithfulness judges claims against retrieved context; the prebuilt scorer
    // only reads context from factory options, so it is built per case.
    const scorers = [
      { name: "answer-relevancy", scorer: relevancy },
      {
        name: "faithfulness",
        scorer: createFaithfulnessScorer({
          model: JUDGE_MODEL,
          options: { context },
        }),
      },
    ];

    for (const { name, scorer } of scorers) {
      const run = await scorer.run({
        input: c.question,
        output: answer,
      } as any);
      const score = typeof run.score === "number" ? run.score : null;
      const reason = (run as any).reason ?? null;
      if (name === "faithfulness" && score !== null) faithScores.push(score);

      await sql`
        INSERT INTO eval_runs (git_sha, scorer, question, score, reason)
        VALUES (${gitSha}, ${name}, ${c.question}, ${score}, ${reason})
      `;
      console.log(`${name} | ${score?.toFixed(2) ?? "n/a"} | ${c.question}`);
    }
  }

  const avgFaith =
    faithScores.reduce((a, b) => a + b, 0) / Math.max(faithScores.length, 1);
  console.log(`\navg faithfulness: ${avgFaith.toFixed(3)} (gate ${FAITHFULNESS_GATE})`);
  if (avgFaith < FAITHFULNESS_GATE) {
    console.error("faithfulness below gate — failing build");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
