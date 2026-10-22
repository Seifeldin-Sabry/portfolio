"use client"

import {useEffect, useRef, useState, type ReactNode} from "react"
import {APP_META, type AppId} from "@/components/apps/registry"
import {LINKS, SITE_CONFIG} from "@/lib/constants"

interface Line {
    kind: "in" | "out"
    text: ReactNode
}

const NEOFETCH = `        seif@seif-os
   ▄▄   ------------
  █  █  OS: seif-os 2.0 (Next.js 16)
  █▀▀█  Host: Antwerp, BE
  ▀  ▀  Role: Software Engineer @ Qfacts
        Studio: Founder @ SDX Studio (GTM engineering)
        Stack: TypeScript, NestJS, Next.js, GCP, Pulumi
        AI: Mastra agents, RAG, evals, guardrails`

const APP_IDS = Object.keys(APP_META) as AppId[]

function run(cmd: string, onOpen: (id: AppId) => void): ReactNode | "clear" {
    const [name, ...args] = cmd.trim().split(/\s+/)
    switch (name) {
        case "":
            return null
        case "help":
            return `commands:
  whoami        who is this guy
  neofetch      system info
  ls            list apps
  open <app>    open an app (e.g. open projects)
  shipped       recent work at Qfacts
  contact       ways to reach me
  clear         clear the screen`
        case "whoami":
            return "Seif — software engineer & founder. I build reliable products and the systems behind them."
        case "neofetch":
            return NEOFETCH
        case "ls":
            return APP_IDS.map((id) => `${id}/`).join("  ")
        case "open": {
            const id = args[0]?.toLowerCase() as AppId | undefined
            if (!id || !APP_IDS.includes(id)) return `open: unknown app "${args[0] ?? ""}". try: ls`
            onOpen(id)
            return `opening ${APP_META[id].label}…`
        }
        case "shipped":
            return `• Ollie — in-product AI agent (grounded Q&A, human-reviewed drafts, evals)
• Mobile companion — checklists & records from the shop floor
• Marketing site & CMS — off Wix to Next.js on Cloud Run, Strapi, SEO, i18n
• Stripe billing — trials, tiered seats, dunning, idempotent webhooks
• Monorepo + generated OpenAPI SDK, Pulumi infra on GCP`
        case "contact":
            return (
                <>
                    email     <a className="text-accent underline" href={`mailto:${SITE_CONFIG.EMAIL}`}>{SITE_CONFIG.EMAIL}</a>
                    {"\n"}call      <a className="text-accent underline" href={LINKS.CALENDLY} target="_blank" rel="noopener noreferrer">calendly (quick chat)</a>
                    {"\n"}github    <a className="text-accent underline" href={LINKS.GITHUB} target="_blank" rel="noopener noreferrer">Seifeldin-Sabry</a>
                </>
            )
        case "clear":
            return "clear"
        case "sudo":
            return "nice try. this incident will be reported."
        default:
            return `${name}: command not found. type "help"`
    }
}

export default function TerminalApp({onOpen}: {onOpen: (id: AppId) => void}) {
    const [lines, setLines] = useState<Line[]>([{kind: "out", text: 'seif-os terminal — type "help" to get started'}])
    const [input, setInput] = useState("")
    const [history, setHistory] = useState<string[]>([])
    const [cursor, setCursor] = useState(-1)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight})
    }, [lines])

    const submit = () => {
        const result = run(input, onOpen)
        if (input.trim()) setHistory((h) => [input, ...h])
        setCursor(-1)
        setInput("")
        if (result === "clear") return setLines([])
        setLines((l) => [...l, {kind: "in", text: input}, ...(result ? [{kind: "out" as const, text: result}] : [])])
    }

    const recall = (step: number) => {
        const next = Math.min(Math.max(cursor + step, -1), history.length - 1)
        setCursor(next)
        setInput(next === -1 ? "" : history[next])
    }

    return (
        <div
            ref={scrollRef}
            onClick={() => inputRef.current?.focus()}
            className="h-full overflow-y-auto bg-black/40 p-3 font-mono text-[12px] leading-relaxed"
        >
            {lines.map((line, i) => (
                <pre key={i} className={`whitespace-pre-wrap ${line.kind === "in" ? "text-foreground" : "text-muted-foreground"}`}>
                    {line.kind === "in" && <span className="text-accent">seif@os ~ % </span>}
                    {line.text}
                </pre>
            ))}
            <div className="flex">
                <span className="text-accent">seif@os ~ %&nbsp;</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submit()
                        if (e.key === "ArrowUp") (e.preventDefault(), recall(1))
                        if (e.key === "ArrowDown") (e.preventDefault(), recall(-1))
                    }}
                    autoFocus
                    spellCheck={false}
                    autoCapitalize="off"
                    aria-label="Terminal input"
                    className="flex-1 bg-transparent caret-accent outline-none"
                />
            </div>
        </div>
    )
}
