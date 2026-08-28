import { Mastra } from "@mastra/core";
import { registerApiRoute } from "@mastra/core/server";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { LangfuseExporter } from "@mastra/langfuse";
import { Observability } from "@mastra/observability";
import { handleChatStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";
import { neon } from "@neondatabase/serverless";

import { portfolioAgent } from "./agents/portfolio-agent";

const ALLOWED_ORIGINS = [
  "https://seif-dx.com",
  "https://www.seif-dx.com",
  "http://localhost:3000",
];

const langfuseEnabled =
  !!process.env.LANGFUSE_PUBLIC_KEY && !!process.env.LANGFUSE_SECRET_KEY;

export const mastra = new Mastra({
  agents: { portfolioAgent },
  deployer: new CloudflareDeployer({
    name: "portfolio-agent",
  }),
  observability: langfuseEnabled
    ? new Observability({
        configs: {
          langfuse: {
            serviceName: "portfolio-agent",
            exporters: [
              new LangfuseExporter({
                publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
                secretKey: process.env.LANGFUSE_SECRET_KEY!,
                baseUrl:
                  process.env.LANGFUSE_BASE_URL ?? "https://cloud.langfuse.com",
                realtime: true,
              }),
            ],
          },
        },
      })
    : undefined,
  server: {
    cors: {
      origin: ALLOWED_ORIGINS,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
    },
    apiRoutes: [
      registerApiRoute("/chat", {
        method: "POST",
        handler: async (c) => {
          const params = await c.req.json();
          const stream = await handleChatStream({
            mastra,
            agentId: "portfolioAgent",
            version: "v7",
            params,
          });
          return createUIMessageStreamResponse({ stream });
        },
      }),
      registerApiRoute("/evals", {
        method: "GET",
        handler: async () => {
          const sql = neon(process.env.POSTGRES_CONNECTION_STRING!);
          const summary = await sql`
            SELECT git_sha,
                   date_trunc('minute', min(run_at)) AS run_at,
                   scorer,
                   round(avg(score)::numeric, 3) AS avg_score,
                   count(*) AS n
            FROM eval_runs
            GROUP BY git_sha, scorer
            ORDER BY min(run_at) DESC
            LIMIT 60
          `;
          const latest = await sql`
            SELECT git_sha, run_at, scorer, question, score, reason
            FROM eval_runs
            WHERE git_sha = (SELECT git_sha FROM eval_runs ORDER BY run_at DESC LIMIT 1)
            ORDER BY scorer, question
          `;
          return new Response(JSON.stringify({ summary, latest }), {
            headers: { "Content-Type": "application/json" },
          });
        },
      }),
    ],
  },
});
