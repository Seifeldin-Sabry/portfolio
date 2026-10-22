"use client"

import EvalDashboard from "@/components/eval-dashboard"

const STACK = [
    {
        title: "Agentic RAG",
        body: "Mastra agent with a semantic search tool over pgvector (Neon Postgres). Portfolio markdown is chunked and embedded via Workers AI (bge-base-en-v1.5, 768d).",
        chips: ["Mastra", "pgvector", "Workers AI"],
    },
    {
        title: "Guardrails",
        body: "Every message is screened before and after the agent: prompt-injection detection (block), PII redaction, and an output leak check that keeps system internals out of replies.",
        chips: ["PromptInjectionDetector", "PIIDetector", "leak check"],
    },
    {
        title: "Self-improving evals",
        body: "A three-category eval suite (knowledge, guardrail, agentic tool use) runs in CI with hard gates. Failures, content changes and red-team synthesis feed a candidate pool, promoted into the dataset only after stability gates pass.",
        chips: ["@mastra/evals", "tool-correctness", "growth loop"],
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
        body: "The agent runs on Cloudflare Workers via Mastra's CloudflareDeployer. Groq serves low-latency open-weight inference for chat and judging.",
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
