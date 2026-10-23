---
id: "ai-assistant"
title: "AI assistant with guardrails & evals"
audience: "Teams with docs, support or sales content"
via: "Seif, freelance"
demo: "lab"
---
# AI assistant with guardrails & evals

A retrieval-grounded assistant over your own documents, with guardrails that fail closed and an eval suite in CI that grows itself. The assistant on this site is the live demo.

## Includes

- RAG over your docs (pgvector), answers grounded in sources
- Input and output guardrails: injection blocking, PII redaction, leak checks
- Evals with LLM judges and hard CI gates, plus a self-improving test set
- Tracing and cost/latency monitoring (Langfuse)
