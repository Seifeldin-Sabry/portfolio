import type {Metadata} from "next"
import EvalDashboard from "@/components/eval-dashboard"

export const metadata: Metadata = {
    title: "AI Engineering — Seif-DX",
    description:
        "How this portfolio's AI assistant is built: Mastra agents, RAG on pgvector, guardrails, automated evals in CI, Langfuse observability.",
}

const STACK = [
    {
        title: "Agentic RAG",
        body: "Mastra agent with a semantic search tool over pgvector (Neon Postgres). Portfolio markdown is chunked and embedded via Workers AI (bge-base-en-v1.5, 768d).",
        chips: ["Mastra", "pgvector", "Workers AI"],
    },
    {
        title: "Guardrails",
        body: "Input processors screen every message: LLM-based prompt-injection detection (block) and PII detection (redact) before the agent ever sees the text.",
        chips: ["PromptInjectionDetector", "PIIDetector"],
    },
    {
        title: "Evals in CI",
        body: "A golden QA set runs through the real agent on every content change. Answer relevancy + faithfulness are judged by an LLM; the build fails if faithfulness drops below 0.7.",
        chips: ["@mastra/evals", "GitHub Actions", "regression gate"],
    },
    {
        title: "Observability",
        body: "Every conversation is traced end-to-end — model calls, tool calls, guardrail decisions — exported to Langfuse for latency, cost and quality analysis.",
        chips: ["Langfuse", "AI tracing"],
    },
    {
        title: "Incremental embeddings",
        body: "Content lives as markdown. CI hashes each file, re-embeds only diffs, and purges vectors for deleted files. Zero-touch, idempotent pipeline.",
        chips: ["sha256 diff", "CI pipeline"],
    },
    {
        title: "Edge deployment",
        body: "The agent runs on Cloudflare Workers via Mastra's CloudflareDeployer. Groq serves low-latency Llama 3.3 70B inference.",
        chips: ["Cloudflare Workers", "Groq"],
    },
]

export default function AiPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <header className="mb-8">
                <h1 className="text-2xl font-semibold">AI Engineering</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    The assistant on this site is a production-grade AI system — not an API wrapper.
                    Architecture, guardrails and live eval scores below.
                </p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    markdown → embeddings → pgvector → agent + guardrails → evals → Langfuse
                </p>
            </header>

            <section className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {STACK.map((item) => (
                    <div key={item.title} className="rounded-lg border border-border bg-secondary/20 p-4">
                        <h2 className="text-sm font-medium">{item.title}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {item.chips.map((c) => (
                                <span
                                    key={c}
                                    className="rounded-full bg-secondary/50 px-2 py-0.5 font-mono text-[10px]"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <section>
                <h2 className="mb-3 text-lg font-semibold">Live eval scores</h2>
                <EvalDashboard/>
            </section>
        </main>
    )
}
