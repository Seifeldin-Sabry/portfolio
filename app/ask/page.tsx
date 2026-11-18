import type {Metadata} from "next"

import AskButton from "@/components/site/ask-button"
import EvalDashboard from "@/components/eval-dashboard"
import {Tag} from "@/components/site/section"
import {bookingUrl} from "@/lib/constants"

export const metadata: Metadata = {
    title: "How my AI assistant is built",
    description: "A RAG assistant grounded in my work, with fail-closed guardrails, self-improving evals in CI and live scores.",
    alternates: {canonical: "/ask"},
}

const STACK = [
    {
        title: "Agentic RAG",
        body: "Mastra agent with a semantic search tool over pgvector (Neon Postgres). Portfolio markdown is chunked and embedded via Workers AI (bge-base-en-v1.5, 768d).",
        chips: ["Mastra", "pgvector", "Workers AI"],
    },
    {
        title: "Guardrails that fail closed",
        body: "Every message is screened before and after the agent: an injection classifier that blocks (and blocks when it can't decide), regex PII redaction, and an output filter that keeps secrets and system internals out of replies.",
        chips: ["fail-closed classifier", "PII redaction", "leak filter"],
    },
    {
        title: "Self-improving evals",
        body: "Knowledge, guardrail and agentic tool-use cases run in CI with hard gates; LLM judges score relevancy and faithfulness. Each week the suite mines its own failures, content changes and red-team ideas, and keeps only cases that pass consistently.",
        chips: ["LLM judges", "tool-correctness", "growth loop"],
    },
    {
        title: "Observability",
        body: "Every conversation is traced end-to-end: model calls, tool calls, guardrail decisions, exported to Langfuse for latency, cost and quality analysis.",
        chips: ["Langfuse", "AI tracing"],
    },
    {
        title: "Incremental embeddings",
        body: "Content lives as markdown. CI hashes each file, re-embeds only diffs, and purges vectors for deleted files. The same diffs generate new eval cases.",
        chips: ["sha256 diff", "CI pipeline"],
    },
    {
        title: "Edge deployment",
        body: "The agent runs on Cloudflare Workers via Mastra's CloudflareDeployer. Groq serves open-weight models, one per job (chat, guard, judges), so a busy day for one can't starve another.",
        chips: ["Cloudflare Workers", "Groq"],
    },
]

export default function AskPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6">
            <p className="text-sm font-medium text-accent">AI engineering</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">How my AI assistant is built</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                The assistant on every page of this site answers from my own content, refuses what it should not answer, and is tested
                in CI on every change. It is the same care I put into AI features for clients and employers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
                <AskButton className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Try it now</AskButton>
                <a href={bookingUrl("ask-page")} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-secondary">
                    Build one for your product
                </a>
            </div>

            <p className="mt-12 font-mono text-xs text-muted-foreground">markdown → embeddings → pgvector → agent + guardrails → evals → Langfuse</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {STACK.map((item) => (
                    <div key={item.title} className="rounded-2xl border bg-card p-5">
                        <h2 className="font-medium">{item.title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.chips.map((c) => (
                                <Tag key={c}>{c}</Tag>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="mb-4 mt-14 text-lg font-semibold">Live eval scores</h2>
            <EvalDashboard/>
        </div>
    )
}
