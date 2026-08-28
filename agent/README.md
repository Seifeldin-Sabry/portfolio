# Portfolio Agent

AI assistant for [seif-dx.com](https://seif-dx.com). Mastra agent + RAG +
guardrails + evals, deployed to Cloudflare Workers.

## Architecture

```
content/*.md ─┐
data/blogs/*  ├─ CI (embed.ts): sha256 diff → chunk → Workers AI bge-base-en-v1.5 (768d)
cv/*.md ──────┘        → pgvector (Neon: portfolio_chunks / content_hashes)

visitor → /chat → portfolioAgent (groq/llama-3.3-70b-versatile)
                    ├─ inputProcessors: PromptInjectionDetector (block), PIIDetector (redact)
                    ├─ tool: searchPortfolio (embed query → cosine top-6, min score 0.55)
                    └─ traces → Langfuse

CI (run-evals.ts): golden QA → agent → answer-relevancy + faithfulness (LLM judge)
                    → eval_runs table → /evals endpoint → /ai dashboard
                    → build fails if avg faithfulness < 0.7
```

## Endpoints (Worker: `portfolio-agent`)

- `POST /chat` — AI SDK UI message stream (used by `components/ai-chat.tsx`)
- `GET /evals` — eval run history (used by `app/ai/page.tsx` dashboard)

## Env / secrets

| Key | Where | Purpose |
| --- | --- | --- |
| `POSTGRES_CONNECTION_STRING` | .env (encrypted), worker secret | Neon pgvector + eval storage |
| `GROQ_API_KEY` | .env (encrypted), worker secret | agent + guard + judge LLMs |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` | .env, worker secret | Workers AI embeddings (REST) + deploy |
| `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` / `LANGFUSE_BASE_URL` | .env, worker secret | tracing (optional — agent runs without) |
| `NEXT_PUBLIC_AGENT_URL` | .env | frontend → worker URL (set after first deploy) |

Add secrets with `pnpm dlx @dotenvx/dotenvx set KEY value` (encrypts against
the committed public key). CI decrypts with the `DOTENV_PRIVATE_KEY` repo secret.

## Workflows

- `.github/workflows/agent.yml` — typecheck → `mastra build` → push worker
  secrets → `wrangler deploy` (on `agent/**` changes)
- `.github/workflows/embed-and-eval.yml` — incremental re-embedding + eval
  gate (on content changes, weekly cron, manual)

## Local

```bash
pnpm --filter agent dev        # mastra playground (needs decrypted env)
pnpm --filter agent typecheck
pnpm --filter agent embed      # incremental embedding
pnpm --filter agent evals      # eval suite
```
