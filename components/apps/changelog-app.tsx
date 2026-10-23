"use client"

import type {ChangelogEntry} from "@/lib/content-types"
import {LINKS} from "@/lib/constants"

const TYPE_STYLES: Record<string, string> = {
    feat: "bg-accent/15 text-accent",
    fix: "bg-rose-500/15 text-rose-300",
    perf: "bg-sky-500/15 text-sky-300",
}

/** This site's own commit history, read from git at build time. */
export default function ChangelogApp({changelog}: {changelog: ChangelogEntry[]}) {
    return (
        <div className="h-full overflow-y-auto [&_p]:mb-0">
            <div className="border-b border-window-border px-5 py-3">
                <h2 className="text-sm font-semibold">What changed on this site</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Built from the git history at deploy time. Shipping continuously, in public.</p>
            </div>
            {changelog.length === 0 ? (
                <p className="p-5 text-xs text-muted-foreground">History unavailable in this build.</p>
            ) : (
                <ol className="px-5 py-3">
                    {changelog.map((c) => (
                        <li key={c.sha} className="flex items-baseline gap-3 border-b border-window-border/50 py-2 last:border-0">
                            <span className="w-20 shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">{c.date}</span>
                            <span className={`w-11 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-[10px] ${TYPE_STYLES[c.type] ?? "bg-foreground/10 text-muted-foreground"}`}>
                                {c.type}
                            </span>
                            <span className="flex-1 text-xs leading-relaxed">{c.summary}</span>
                            <a href={`${LINKS.GITHUB}/portfolio/commit/${c.sha}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted-foreground hover:text-accent">
                                {c.sha}
                            </a>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}
