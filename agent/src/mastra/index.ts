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
  // Tags every observability signal; per-call tracingOptions.metadata.environment overrides (CI).
  environment:
    process.env.NODE_ENV === "development" ? "development" : "production",
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
          // Server-injected instance — module-scope `mastra` closure breaks
          // under the deployer bundle (method-less object at runtime).
          const mastraInstance = c.get("mastra") as unknown as typeof mastra;
          const params = await c.req.json();
          // Langfuse best practices: session.id groups one conversation
          // (useChat chat id), user.id is a stable anonymous visitor hash —
          // raw IP never leaves the worker.
          const ip = c.req.header("cf-connecting-ip") ?? "unknown";
          const digest = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(ip),
          );
          const visitorId = [...new Uint8Array(digest.slice(0, 8))]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          const stream = await handleChatStream({
            mastra: mastraInstance,
            agentId: "portfolioAgent",
            version: "v7",
            params,
            defaultOptions: {
              tracingOptions: {
                metadata: {
                  traceName: "portfolio-chat",
                  sessionId:
                    typeof params.id === "string" ? params.id : undefined,
                  userId: `anon:${visitorId}`,
                  source: "portfolio-web",
                },
              },
            },
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
