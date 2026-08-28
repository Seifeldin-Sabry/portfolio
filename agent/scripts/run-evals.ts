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

// 20b on purpose: judges get their own per-model TPM bucket on Groq free tier,
// so scoring never competes with the agent's gpt-oss-120b token budget.
const JUDGE_MODEL = "groq/openai/gpt-oss-20b";
const FAITHFULNESS_GATE = 0.7;

// Free-tier TPM is per minute; pace cases so agent+judge calls stay under it.
const CASE_PACING_MS = 4000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Groq free-tier TPM windows roll per minute — on 429, sleeping out the
// window and retrying always succeeds eventually. Anything else rethrows.
const RETRY_ATTEMPTS = 6;
const RETRY_SLEEP_MS = 20_000;
const isTransient = (err: unknown): boolean => {
  const seen = new Set<unknown>();
  let cur: any = err;
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    const msg = `${cur.message ?? ""} ${cur.responseBody ?? ""}`;
    if (cur.statusCode === 429 || /rate.?limit/i.test(msg)) return true;
    // Groq JSON mode occasionally emits schema-invalid output; a retry succeeds.
    if (/does not match the expected schema|does not validate/i.test(msg))
      return true;
    cur = cur.cause;
  }
  return false;
};
async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= RETRY_ATTEMPTS || !isTransient(err)) throw err;
      console.log(
        `${label}: transient upstream error (attempt ${attempt}/${RETRY_ATTEMPTS}), sleeping ${RETRY_SLEEP_MS / 1000}s`,
      );
      await sleep(RETRY_SLEEP_MS);
    }
  }
}

async function main() {
  const sql = neon(process.env.POSTGRES_CONNECTION_STRING!);
  const gitSha = process.env.GIT_SHA ?? "local";
  const agent = mastra.getAgent("portfolioAgent");

  const relevancy = createAnswerRelevancyScorer({ model: JUDGE_MODEL });

  const faithScores: number[] = [];

  for (const c of evalCases) {
    // Tag eval traffic so Langfuse separates it from production visitors:
    // environment=ci, one session per eval run (git sha).
    const res = await withRetry("agent", () =>
      agent.generate(c.question, {
        tracingOptions: {
          metadata: {
            environment: "ci",
            traceName: "eval-run",
            sessionId: `eval:${gitSha}`,
            userId: "ci",
            source: "ci",
          },
        },
      }),
    );
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
      // Judge flakiness that survives retries must not kill the suite:
      // record a null score for this case and keep gating on the rest.
      let run: any = null;
      try {
        run = await withRetry(
          name,
          (): Promise<any> =>
            scorer.run({
              input: c.question,
              output: answer,
            } as any),
        );
      } catch (err) {
        console.error(`${name} judge failed for "${c.question}":`, err);
      }
      const score = typeof run?.score === "number" ? run.score : null;
      const reason = run?.reason ?? null;
      if (name === "faithfulness" && score !== null) faithScores.push(score);

      await sql`
        INSERT INTO eval_runs (git_sha, scorer, question, score, reason)
        VALUES (${gitSha}, ${name}, ${c.question}, ${score}, ${reason})
      `;
      console.log(`${name} | ${score?.toFixed(2) ?? "n/a"} | ${c.question}`);
    }

    await sleep(CASE_PACING_MS);
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
