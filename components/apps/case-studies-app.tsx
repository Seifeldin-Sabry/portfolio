"use client"

import {useState} from "react"
import type {CaseStudy} from "@/lib/content-types"
import {bookingUrl} from "@/lib/constants"

/** Outcomes, not technologies. Copy lives in content/case-studies/*.md. */
export default function CaseStudiesApp({caseStudies}: {caseStudies: CaseStudy[]}) {
    const [activeId, setActiveId] = useState(caseStudies[0]?.id)
    const study = caseStudies.find((c) => c.id === activeId) ?? caseStudies[0]
    if (!study) return null

    return (
        <div className="flex h-full [&_p]:mb-0">
            <aside className="w-56 shrink-0 overflow-y-auto border-r border-window-border bg-window-chrome/50 py-2">
                {caseStudies.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        className={`block w-full px-3 py-2.5 text-left ${c.id === study.id ? "bg-accent/15" : "hover:bg-foreground/5"}`}
                    >
                        <p className="text-xs font-medium leading-snug">{c.title}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{c.company}</p>
                    </button>
                ))}
            </aside>
            <article className="flex-1 overflow-y-auto px-6 py-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-accent">{study.company}</p>
                <h2 className="mt-1 text-lg font-semibold leading-snug">{study.title}</h2>
                <div className="mt-2 flex flex-wrap gap-1">
                    {study.stack.map((s) => (
                        <span key={s} className="rounded-full bg-secondary/50 px-2 py-0.5 font-mono text-[10px]">{s}</span>
                    ))}
                </div>
                <Section title="Problem">
                    <p className="text-sm leading-relaxed text-muted-foreground">{study.problem}</p>
                </Section>
                <Section title="What I did">
                    <Bullets items={study.approach}/>
                </Section>
                <Section title="Outcome">
                    <Bullets items={study.outcome} accent/>
                </Section>
                <a
                    href={bookingUrl(`case-${study.id}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground hover:brightness-110"
                >
                    Need this for your team? Book a quick chat
                </a>
            </article>
        </div>
    )
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
    return (
        <section className="mt-5">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
            {children}
        </section>
    )
}

function Bullets({items, accent}: {items: string[]; accent?: boolean}) {
    return (
        <ul className="space-y-1.5">
            {items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed">
                    <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent ? "bg-accent" : "bg-foreground/50"}`}/>
                    <span className={accent ? "" : "text-muted-foreground"}>{item}</span>
                </li>
            ))}
        </ul>
    )
}
