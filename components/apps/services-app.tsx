"use client"

import {ArrowUpRight} from "lucide-react"
import type {AppId} from "@/components/apps/registry"
import type {Service} from "@/lib/content-types"
import {bookingUrl} from "@/lib/constants"

/** What you can hire Seif (or SDX Studio) for. Copy lives in content/services/*.md. */
export default function ServicesApp({services, onOpen}: {services: Service[]; onOpen: (id: AppId) => void}) {
    return (
        <div className="h-full overflow-y-auto [&_p]:mb-0">
            <div className="border-b border-window-border px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Hire</p>
                <h2 className="mt-1 text-lg font-semibold">Fixed scope, clear outcome.</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                    Taking one new project this quarter, alongside Qfacts. Every engagement starts with a quick chat.
                </p>
            </div>
            <div className="space-y-3 p-5">
                {services.map((s) => (
                    <article key={s.id} className="rounded-xl border border-border bg-secondary/10 p-4">
                        <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-sm font-semibold">{s.title}</h3>
                            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.via}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-accent">For {s.audience}</p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                        <ul className="mt-2 space-y-1">
                            {s.includes.map((item) => (
                                <li key={item} className="flex gap-2 text-xs">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent"/>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <a
                                href={bookingUrl(`services-${s.id}`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-foreground hover:brightness-110"
                            >
                                Book a quick chat
                            </a>
                            {s.tool && (
                                <button onClick={() => onOpen("tools")} className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-foreground/10">
                                    {s.tool === "outbound" ? "Estimate your pipeline" : "Check your billing"}
                                </button>
                            )}
                            {s.demo && (
                                <button onClick={() => onOpen(s.demo as AppId)} className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-foreground/10">
                                    See the live demo
                                </button>
                            )}
                            {s.link && (
                                <a href={s.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-1 text-xs text-muted-foreground hover:text-foreground">
                                    {new URL(s.link).hostname} <ArrowUpRight size={12}/>
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
