# Portfolio Agent

AI assistant for [seif-dx.com](https://seif-dx.com). Mastra agent + RAG +
guardrails + evals, deployed to Cloudflare Workers.

## Architecture

```
content/*.md ─┐
data/blogs/*  ├─ CI (embed.ts): sha256 diff → chunk → Workers AI bge-base-en-v1.5 (768d)
cv/*.md ──────┘        → pgvector (Neon: portfolio_chunks / content_hashes)

visitor → /chat → portfolioAgent (groq/openai/gpt-oss-120b)
                    ├─ inputProcessors: PromptInjectionDetector (block), PIIDetector (redact)
                    ├─ tool: searchPortfolio (embed query → cosine top-6, min score 0.55)
                    └─ traces → Langfuse

                    ├─ input:  UnicodeNormalizer → PromptGuard (gpt-oss-20b classifier, FAIL-CLOSED) → regex PII redact
                    └─ output: RegexFilterProcessor (redact secrets + LEAK_MARKERS)

CI (run-evals.ts): dataset (golden + evals/promoted.json), 3 categories
                    knowledge → relevancy + faithfulness (LLM judge: qwen3.8-27b) + must-mention + tool use
                    guardrail → refusal / input-block + leak check (deterministic)
                    agentic   → tool-correctness: expected + forbidden tools (deterministic)
                    → eval_runs (category, case_id) → /evals → Lab app dashboard
                    → gates: faithfulness ≥ 0.7, pass rate knowledge ≥ .8 / guardrail ≥ .9 / agentic ≥ .8

CI (grow-evals.ts): candidates ← failure paraphrases + changed-content Qs + red-team probes
                    → dedup → run ×2 through agent
                    → all pass: promoted.json · all fail: gaps.json · mixed: dropped
                    → branch evals/auto-grow + "Open PR" link in the run summary
                    (weekly/manual only — it costs 2 agent runs per candidate)

Models (Groq free tier meters tokens/day PER MODEL, so each job gets its own):
  agent gpt-oss-120b · injection guard gpt-oss-20b (classifier, fail-closed)
  judges qwen3.8-27b · case generator gpt-oss-20b · PII + output guards: regex, no LLM
  `pnpm --filter agent smoke` checks the live guard + judge before evals and deploys
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

Langfuse traces carry `session.id` (one conversation, from the useChat id),
`user.id` (`anon:<sha256(ip)[:16]>` — raw IP never exported), `environment`
(`production` / `development` / `ci` for eval runs) and trace name
`portfolio-chat` / `eval-run`. PII is redacted by the agent's `PIIDetector`
input processor *before* any span is exported.
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
