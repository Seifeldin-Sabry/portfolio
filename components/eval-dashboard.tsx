"use client"

import {useEffect, useState} from "react"

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:4111"

interface SummaryRow {
    git_sha: string
    run_at: string
    scorer: string
    avg_score: number | string
    n: number | string
}

interface LatestRow {
    git_sha: string
    run_at: string
    scorer: string
    question: string
    score: number | null
    reason: string | null
}

function scoreColor(score: number | null): string {
    if (score === null) return "text-muted-foreground"
    if (score >= 0.8) return "text-green-400"
    if (score >= 0.6) return "text-amber-400"
    return "text-red-400"
}

export default function EvalDashboard() {
    const [summary, setSummary] = useState<SummaryRow[] | null>(null)
    const [latest, setLatest] = useState<LatestRow[] | null>(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        fetch(`${AGENT_URL}/evals`)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
            .then((d) => {
                setSummary(d.summary ?? [])
                setLatest(d.latest ?? [])
            })
            .catch(() => setFailed(true))
    }, [])

    if (failed) {
        return (
            <p className="text-sm text-muted-foreground">
                Eval data unavailable — the agent API is offline or evals haven&apos;t run yet.
            </p>
        )
    }

    if (!summary || !latest) {
        return <p className="text-sm font-mono text-muted-foreground animate-pulse">loading eval runs…</p>
    }

    const latestSha = latest[0]?.git_sha
    const latestSummary = summary.filter((s) => s.git_sha === latestSha)

    return (
        <div className="space-y-6">
            {/* Latest run score cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {latestSummary.map((s) => (
                    <div
                        key={s.scorer}
                        className="rounded-lg border border-border bg-secondary/20 p-4"
                    >
                        <p className="text-xs font-mono text-muted-foreground">{s.scorer}</p>
                        <p className={`mt-1 text-3xl font-semibold ${scoreColor(Number(s.avg_score))}`}>
                            {Number(s.avg_score).toFixed(2)}
                        </p>
                        <p className="mt-1 text-[10px] font-mono text-muted-foreground">
                            avg over {String(s.n)} questions · {latestSha?.slice(0, 7)}
                        </p>
                    </div>
                ))}
                {latestSummary.length === 0 && (
                    <p className="text-sm text-muted-foreground">No eval runs recorded yet.</p>
                )}
            </div>

            {/* History */}
            {summary.length > 0 && (
                <div>
                    <h3 className="mb-2 text-sm font-medium">Run history</h3>
                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-secondary/30 font-mono text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2">commit</th>
                                <th className="px-3 py-2">scorer</th>
                                <th className="px-3 py-2">avg</th>
                                <th className="px-3 py-2">n</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summary.slice(0, 20).map((s, i) => (
                                <tr key={i} className="border-t border-border">
                                    <td className="px-3 py-1.5 font-mono">{s.git_sha.slice(0, 7)}</td>
                                    <td className="px-3 py-1.5 font-mono">{s.scorer}</td>
                                    <td className={`px-3 py-1.5 font-mono ${scoreColor(Number(s.avg_score))}`}>
                                        {Number(s.avg_score).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-1.5 font-mono">{String(s.n)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Latest per-question */}
            {latest.length > 0 && (
                <div>
                    <h3 className="mb-2 text-sm font-medium">Latest run — per question</h3>
                    <div className="space-y-2">
                        {latest.map((row, i) => (
                            <div key={i} className="rounded-lg border border-border bg-secondary/10 p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-xs">{row.question}</p>
                                    <span className={`font-mono text-sm ${scoreColor(row.score)}`}>
                                        {row.score === null ? "—" : row.score.toFixed(2)}
                                    </span>
                                </div>
                                <p className="mt-1 text-[10px] font-mono text-muted-foreground">{row.scorer}</p>
                                {row.reason && (
                                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{row.reason}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
