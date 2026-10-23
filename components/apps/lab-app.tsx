"use client"

import EvalDashboard from "@/components/eval-dashboard"
import {bookingUrl} from "@/lib/constants"

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

export default function LabApp() {
    return (
        <div className="h-full overflow-y-auto">
            <div className="border-b border-window-border px-4 py-2.5">
                <h2 className="text-sm font-semibold">AI Engineering</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    The assistant on this site is a production-grade AI system. Architecture, guardrails and live eval scores below.
                </p>
            </div>

            <div className="mx-4 mt-4 rounded-lg border border-accent/30 bg-accent/10 p-4 [&_p]:mb-0">
                <p className="text-sm font-semibold">This is what I&apos;d build for you.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    The evals earned their keep here: they caught the guardrails failing <em>open</em> when the model&apos;s daily
                    quota ran out, silently letting injections through. The fix made them fail closed, and a live smoke test now
                    gates every deploy. Want an assistant over your docs with that level of care?
                </p>
                <a
                    href={bookingUrl("lab")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground hover:brightness-110"
                >
                    Book a quick chat
                </a>
            </div>

            <div className="px-4 py-4">
                <p className="font-mono text-[10px] text-muted-foreground">
                    markdown → embeddings → pgvector → agent + guardrails → evals → Langfuse
                </p>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {STACK.map((item) => (
                        <div key={item.title} className="rounded-lg border border-border bg-secondary/20 p-4">
                            <h3 className="text-sm font-medium">{item.title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {item.chips.map((c) => (
                                    <span key={c} className="rounded-full bg-secondary/50 px-2 py-0.5 font-mono text-[10px]">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="mb-3 mt-6 text-sm font-semibold">Live eval scores</h3>
                <EvalDashboard/>
                <div className="pb-2"/>
            </div>
        </div>
    )
}
