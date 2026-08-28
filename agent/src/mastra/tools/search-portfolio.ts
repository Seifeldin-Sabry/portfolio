import { createTool } from "@mastra/core/tools";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

import { embedText, toVectorLiteral } from "../../lib/embeddings";

const TOP_K = 6;
const MIN_SCORE = 0.55;

export const searchPortfolio = createTool({
  id: "searchPortfolio",
  description:
    "Semantic search over Seif's portfolio: projects, work experience, education, homelab, blog posts, CV and about page. ALWAYS call this before answering any question about Seif.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("The visitor's question, rephrased as a standalone search query"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        text: z.string(),
        file: z.string(),
        score: z.number(),
      }),
    ),
  }),
  execute: async ({ query }) => {
    const sql = neon(process.env.POSTGRES_CONNECTION_STRING!);
    const vector = toVectorLiteral(await embedText(query));
    const rows = (await sql`
      SELECT text, file, 1 - (embedding <=> ${vector}::vector) AS score
      FROM portfolio_chunks
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${TOP_K}
    `) as { text: string; file: string; score: number }[];
    return {
      results: rows
        .filter((r) => Number(r.score) >= MIN_SCORE)
        .map((r) => ({ text: r.text, file: r.file, score: Number(r.score) })),
    };
  },
});
