"use client"

import {useEffect, useState} from "react"

interface Note {
    id: string
    title: string
    date: string
    body: string
    editable?: boolean
}

const SCRATCH_KEY = "seif-os-scratchpad"

const NOTES: Note[] = [
    {
        id: "welcome",
        title: "Welcome 👋",
        date: "pinned",
        body: `Hey, I'm Seif.

This site works like a tiny desktop:
• drag windows by their title bar, resize from the edges
• double-click a title bar to maximize
• click a dock icon to open or minimize an app
• try the Terminal — type "help"

The Assistant answers questions about my work. It's a real
RAG agent with guardrails and self-improving evals (see Lab).`,
    },
    {
        id: "now",
        title: "Now",
        date: "Oct 2026",
        body: `• Owning the Qfacts platform end to end — monorepo, infra, billing, releases
• Shipped Ollie, the in-product AI agent (grounded Q&A, human-reviewed drafts)
• Shipped the Qfacts mobile companion for floor workers
• Moved the Qfacts marketing site off Wix to Next.js + Strapi CMS
• Running SDX Studio: done-for-you outbound for MSSPs, run from Claude Code
• Gym, tennis, long walks with a 20 kg vest`,
    },
    {
        id: "principles",
        title: "Engineering notes",
        date: "ongoing",
        body: `1. Contract breaks should fail the build, not production.
2. Idempotency keys before you need them.
3. Audit trails are append-only. Enforce it in the database.
4. AI features ship with evals and a human in the loop.
5. Write the recovery playbook before the incident.`,
    },
    {
        id: "scratch",
        title: "Your note",
        date: "editable",
        editable: true,
        body: "",
    },
]

export default function NotesApp() {
    const [activeId, setActiveId] = useState(NOTES[0].id)
    const [scratch, setScratch] = useState("")
    const active = NOTES.find((n) => n.id === activeId)!

    useEffect(() => {
        try {
            setScratch(localStorage.getItem(SCRATCH_KEY) ?? "")
        } catch {
            /* private mode */
        }
    }, [])

    const saveScratch = (value: string) => {
        setScratch(value)
        try {
            localStorage.setItem(SCRATCH_KEY, value)
        } catch {
            /* private mode */
        }
    }

    return (
        <div className="flex h-full">
            <aside className="w-44 shrink-0 overflow-y-auto border-r border-window-border bg-window-chrome/50 py-2">
                {NOTES.map((n) => (
                    <button
                        key={n.id}
                        onClick={() => setActiveId(n.id)}
                        className={`block w-full px-3 py-2 text-left ${
                            n.id === activeId ? "bg-amber-300/10" : "hover:bg-foreground/5"
                        }`}
                    >
                        <p className="truncate text-xs font-medium">{n.title}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{n.date}</p>
                    </button>
                ))}
            </aside>
            <div className="flex flex-1 flex-col overflow-hidden">
                <p className="px-5 pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{active.date}</p>
                <h2 className="px-5 pt-1 text-lg font-semibold">{active.title}</h2>
                {active.editable ? (
                    <textarea
                        value={scratch}
                        onChange={(e) => saveScratch(e.target.value)}
                        placeholder="Leave yourself a note while you browse. Saved in this browser only."
                        aria-label="Your note"
                        className="m-5 mt-3 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60"
                    />
                ) : (
                    <p className="flex-1 overflow-y-auto whitespace-pre-wrap px-5 py-3 text-sm leading-relaxed text-muted-foreground">
                        {active.body}
                    </p>
                )}
            </div>
        </div>
    )
}
