# AI Chat — Implementation Plan

Portfolio AI chat showcasing production AI engineering: **Mastra** (agent, RAG, guardrails, evals) + **Langfuse** (observability) + **Neon pgvector** (vector store) + **Groq** (chat/judge LLMs) + **Cloudflare Workers AI** (embeddings — `@cf/baai/bge-base-en-v1.5`, same account as hosting, no extra vendor). All infra $0.

## 0. Architecture constraint (discovered)

Portfolio is a **static export** (`output: "export"` in `next.config.mjs`) served as Cloudflare Workers static assets (`wrangler.toml → [assets] directory = "./out"`). No server runtime in this app. Therefore:

- **Chat backend = separate Mastra server**, deployed as its own Cloudflare Worker via `@mastra/deployer-cloudflare` (sets `nodejs_compat` automatically; `pg` TCP works on Workers with nodejs_compat).
- Frontend stays static; chat page is a client component calling the agent Worker URL (CORS locked to portfolio origin).
- Eval dashboard is static UI + client fetch from agent Worker endpoint (live data, no rebuild).

```
┌─ portfolio.dev (static, CF assets) ─┐      ┌─ agent.portfolio.dev (CF Worker) ─┐
│  /chat  – useChat client            │─────▶│  Mastra server                     │
│  /ai    – evals dashboard           │      │  ├ agent + vector query tool       │
└─────────────────────────────────────┘      │  ├ input/output processors         │
                                             │  ├ /api/evals (read Neon)          │
                 GitHub Actions CI ──────────▶  └ LangfuseExporter ──▶ Langfuse   │
                 (embed + evals + deploy)    └───────────────┬──────────────────┘
                                                             ▼
                                                  Neon Postgres (pgvector)
```

## 1. Repo restructure (pnpm workspace)

```
pnpm-workspace.yaml          # packages: [".", "agent"]
agent/
  package.json               # @mastra/core, @mastra/rag, @mastra/pg, @mastra/evals,
                             # @mastra/langfuse, @mastra/deployer-cloudflare, @mastra/ai-sdk,
                             # ai, workers-ai-provider
  src/mastra/index.ts        # Mastra instance: agent, vectors, observability, deployer, CORS
  src/mastra/embedder.ts     # workers-ai-provider: binding at runtime, REST (accountId+apiKey) in CI
  src/mastra/agents/portfolio-agent.ts
  src/mastra/tools/search-portfolio.ts    # createVectorQueryTool
  src/mastra/processors/                  # guardrail configs
  scripts/embed.ts           # ingestion (run in CI)
  scripts/run-evals.ts       # eval suite (run in CI)
  evals/eval-set.json        # golden Q set
```

## 2. Content → styled markdown (single source of truth)

Convert TS data files to markdown with frontmatter; site renders from md (keep current styling via existing MDX pipeline), RAG ingests same files.

```
content/
  about.md            # bio, focus, contact policy
  experience.md       # from data/experiences.ts
  projects/*.md       # one per project, from data/projects.ts (frontmatter: title, tech, links, status)
  education.md        # from data/education.ts
  homelab.md          # from data/homelab.ts
  skills.md
  cv.md               # source for cv/seifeldin-swe-cv.md render
  blogs/              # move data/blogs/*.mdx here (or symlink ingestion to data/blogs)
```

- Zod frontmatter schemas in `lib/content-schema.ts`; loaders replace `data/*.ts` exports so components keep their props.
- `scripts/render-cv.mjs` reads `content/cv.md`.

## 3. Neon + pgvector

- Neon free tier project, one DB. Tables:
  - Mastra-managed pgvector index `portfolio_chunks` — created by `PgVector.createIndex({ indexName, dimension: 768, metric: 'cosine', indexConfig: { type: 'hnsw' } })`.
  - `content_hashes(file text pk, sha256 text, chunk_count int, updated_at timestamptz)` — CI diff manifest.
  - `eval_runs(id, git_sha, run_at, scorer, question, score real, reason text)` — dashboard source.
- Runtime + CI both use `POSTGRES_CONNECTION_STRING` (Neon pooled connstring).

## 4. Ingestion pipeline (`agent/scripts/embed.ts`)

1. Read `content/**/*.md(x)`; sha256 each file; compare vs `content_hashes`.
2. Changed/new files only → `MDocument.fromMarkdown` → `chunk({ strategy: 'markdown' })` (header-aware; no LLM cost — skip `semantic-markdown`).
3. `embedMany({ model: workersai.textEmbedding('@cf/baai/bge-base-en-v1.5'), values })` — 768-dim, `pooling: 'cls'`; CI mode via `createWorkersAI({ accountId, apiKey })` reusing existing `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`.
4. Delete stale vectors by `metadata.file`, upsert new with metadata `{ file, heading, text }`, update `content_hashes`.
5. No diff → exit 0, zero API calls.

## 5. Agent + guardrails (the showcase)

`portfolio-agent.ts`:
- Model: `groq/openai/gpt-oss-120b` (or current best free Groq model at build time).
- Tool: `createVectorQueryTool({ vectorStore: pgVector, indexName: 'portfolio_chunks', model: workersai.textEmbedding('@cf/baai/bge-base-en-v1.5') })` — runtime uses native `env.AI` binding (zero-latency, no API key; declare `[ai] binding = "AI"` via deployer config).
- Instructions: answer only from retrieved portfolio context; cite sections; refuse off-topic; never invent facts about Seif.

`inputProcessors` (ordered, cheap → expensive):
1. `RegexFilterProcessor({ presets: ['pii'], strategy: 'block', phase: 'input' })` — free regex layer.
2. `PromptInjectionDetector({ model: 'groq/openai/gpt-oss-20b', detectionTypes: ['injection','jailbreak','system-override'], threshold: 0.8, strategy: 'block', includeScores: true })`.
3. `PIIDetector({ model: 'groq/openai/gpt-oss-20b', strategy: 'redact', redactionMethod: 'mask' })` — visitor PII never reaches main model or traces.

`outputProcessors`:
- Custom `Processor.processToolResult` — scan retrieved chunks, `abort()` on injection patterns (defends against poisoned content).
- `PIIDetector` output-phase redact (leak guard).

Every trigger is visible as a span in Langfuse → guardrails demonstrable with screenshots, not claims.

Server hardening: CORS allowlist (portfolio origin), per-IP rate limit (Workers KV counter, e.g. 20 msg/day/IP), max input length, `maxSteps`/token caps. Protects Groq+Gemini free quotas.

## 6. Observability — Langfuse

- `@mastra/langfuse` `LangfuseExporter` in `observability.configs` (env: `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL`; `realtime: false` in prod).
- Tags: `environment`, `release` = git sha. Session id per visitor chat.
- Traces show: guardrail spans → retrieval (query, topK, scores) → generation (tokens, latency, cost).

## 7. Evals (`agent/scripts/run-evals.ts`, CI)

- `evals/eval-set.json`: ~20–30 golden questions across categories: factual (projects/experience), retrieval-dependent, off-topic refusal, injection attempts, PII probes.
- `runEvals` from `@mastra/core/evals` with prebuilt scorers from `@mastra/evals/scorers/prebuilt`:
  - `createAnswerRelevancyScorer`, `createFaithfulnessScorer`, `createHallucinationScorer` — judge model `groq/openai/gpt-oss-120b`.
  - Custom scorer: refusal-correctness (did guardrail block what it should, pass what it shouldn't).
- Results → insert `eval_runs` rows (git sha) + visible in Langfuse traces.
- Regression gate: fail CI if mean score of any scorer drops below threshold (e.g. 0.75).

## 8. Frontend

- `/chat` page (or floating panel): `@ai-sdk/react` `useChat` → `POST {AGENT_URL}/chat` (Mastra `handleChatStream` + `createUIMessageStreamResponse`; `registerApiRoute` on Mastra server). Streaming, markdown rendering (existing pipeline), "sources" chips from tool results, distinct UI state for guardrail blocks ("⚠️ blocked: prompt injection detected").
- `/ai` evals dashboard (screenshot target for LinkedIn): client-fetch `GET {AGENT_URL}/api/evals` → score trend per scorer over runs (existing `components/ui/chart.tsx`/recharts), latest run table (question, score, reason), guardrail block counters, stack badges. Static-export safe.
- `NEXT_PUBLIC_AGENT_URL` env.

## 9. CI/CD (GitHub Actions)

- `.github/workflows/deploy.yml` — unchanged (static site).
- `.github/workflows/agent.yml` — on push to `main` paths `agent/**`: build Mastra → `wrangler deploy` agent Worker.
- `.github/workflows/embed-and-eval.yml` — on push to `main` paths `content/**` + nightly cron + manual:
  1. `pnpm --filter agent embed` (hash-diff ingestion; no-op when clean)
  2. `pnpm --filter agent evals`
  3. threshold gate → red build on regression

## 10. Env vars

| Var | Where | Source |
|---|---|---|
| `POSTGRES_CONNECTION_STRING` | Worker + CI | Neon |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | CI only (embeddings REST; already in `.env`) | Cloudflare |
| `GROQ_API_KEY` | Worker + CI | Groq (free) |
| `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` / `LANGFUSE_BASE_URL` | Worker + CI | Langfuse cloud (free) |
| `NEXT_PUBLIC_AGENT_URL` | static build | — |

Secrets via existing dotenvx flow + `wrangler secret` for the agent Worker.

## 11. Cost

| Item | Tier | $ |
|---|---|---|
| Workers AI embeddings (`bge-base-en-v1.5`) | free: 10k neurons/day (embeddings ≈ fractions of a neuron per call) | 0 |
| Groq chat + guardrail + judge models | free tier | 0 |
| Neon Postgres + pgvector | free tier | 0 |
| Langfuse cloud | free (hobby) | 0 |
| Cloudflare Workers ×2 | free plan | 0 |

Note: embeddings stay inside the existing Cloudflare account — one vendor fewer, no Google dependency. Important: **all chunks and queries must embed with the same model + same pooling (`cls`)**; changing model later = full re-embed (cheap: delete rows, clear `content_hashes`, rerun CI).

## 12. Build order

1. Workspace + `agent/` scaffold, Neon project, keys
2. Content → markdown migration (site renders identically)
3. Ingestion script + local end-to-end RAG query
4. Agent + guardrails + Langfuse
5. Chat UI
6. Eval set + scorers + `eval_runs`
7. Dashboard `/ai`
8. CI workflows + CORS/rate-limit hardening
9. Polish: LinkedIn screenshots (Langfuse trace + dashboard)
