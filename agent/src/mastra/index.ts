import { Mastra } from "@mastra/core";
import { registerApiRoute } from "@mastra/core/server";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { LangfuseExporter } from "@mastra/langfuse";
import { Observability } from "@mastra/observability";
import { handleChatStream } from "@mastra/ai-sdk";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { neon } from "@neondatabase/serverless";

import { portfolioAgent } from "./agents/portfolio-agent";
import { deliverContactEmail } from "./tools/send-email";

/**
 * Guard models occasionally emit schema-invalid JSON, which surfaces as a
 * thrown error before the reply stream starts. Answer with a friendly
 * assistant message instead of a 500 the UI can't explain.
 */
const staticAssistantResponse = (text: string) =>
  createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: async ({ writer }) => {
        writer.write({ type: "text-start", id: "fallback" });
        writer.write({ type: "text-delta", id: "fallback", delta: text });
        writer.write({ type: "text-end", id: "fallback" });
      },
    }),
  });

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
          try {
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
          } catch (err) {
            console.error("chat stream failed", err);
            return staticAssistantResponse(
              "Hmm, I couldn't process that message — my safety filters glitched. Try rephrasing, or say \"I want to contact Seif\" and I'll show you a form that goes straight to his inbox.",
            );
          }
        },
      }),
      // Contact form endpoint — visitor details go straight to Resend,
      // never through the LLM, so PII guardrails can stay strict.
      registerApiRoute("/contact", {
        method: "POST",
        handler: async (c) => {
          const body = await c.req.json().catch(() => null);
          const name = typeof body?.name === "string" ? body.name.trim() : "";
          const email =
            typeof body?.email === "string" ? body.email.trim() : "";
          const message =
            typeof body?.message === "string" ? body.message.trim() : "";
          const subject =
            typeof body?.subject === "string"
              ? body.subject.trim().slice(0, 200)
              : undefined;
          if (
            !name ||
            name.length > 200 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            message.length < 10 ||
            message.length > 2000
          ) {
            return new Response(
              JSON.stringify({ sent: false, detail: "Invalid input" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
          const result = await deliverContactEmail({
            name,
            email,
            message,
            subject,
          });
          return new Response(JSON.stringify(result), {
            status: result.sent ? 200 : 502,
            headers: { "Content-Type": "application/json" },
          });
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
