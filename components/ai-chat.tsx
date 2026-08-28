"use client"

import {useEffect, useRef, useState} from "react"
import {useChat} from "@ai-sdk/react"
import {DefaultChatTransport} from "ai"
import {Bot, Send, Sparkles, X} from "lucide-react"
import {Streamdown} from "streamdown"

import {LINKS} from "@/lib/constants"

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:4111"

const SUGGESTIONS = [
    "What does Seif do at QFacts?",
    "Tell me about his homelab",
    "Book a call with Seif",
]

export default function AiChat() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    const {messages, sendMessage, status, error} = useChat({
        transport: new DefaultChatTransport({api: `${AGENT_URL}/chat`}),
    })

    const busy = status === "submitted" || status === "streaming"

    useEffect(() => {
        scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight, behavior: "smooth"})
    }, [messages, busy])

    const submit = (text: string) => {
        const trimmed = text.trim()
        if (!trimmed || busy) return
        void sendMessage({text: trimmed})
        setInput("")
    }

    return (
        <>
            {/* Floating toggle */}
            <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close AI chat" : "Open AI chat"}
                className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-105 transition-transform"
            >
                {open ? <X size={20}/> : <Sparkles size={20}/>}
            </button>

            {open && (
                <div
                    className="fixed bottom-20 right-5 z-50 flex h-[520px] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl backdrop-blur"
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                        <Bot size={16} className="text-accent"/>
                        <div className="flex-1">
                            <p className="text-sm font-medium leading-none">Ask about Seif</p>
                            <p className="mt-1 text-[10px] font-mono text-muted-foreground">
                                RAG · guardrails · evals — <a href="/ai" className="underline hover:text-accent">how it works</a>
                            </p>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${busy ? "bg-amber-400 animate-pulse" : "bg-green-400"}`}/>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                        {messages.length === 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    Grounded in the portfolio content — projects, experience, homelab, blog.
                                </p>
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => submit(s)}
                                        className="block w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-left text-xs hover:border-accent/40 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                                    m.role === "user"
                                        ? "ml-auto whitespace-pre-wrap bg-accent/15 text-foreground"
                                        : "bg-secondary/30"
                                }`}
                            >
                                {m.parts.map((part, i) => {
                                    if (part.type === "text") {
                                        if (m.role === "user") return <span key={i}>{part.text}</span>
                                        return (
                                            <Streamdown
                                                key={i}
                                                className="space-y-2 [&_a]:text-accent [&_a]:underline"
                                            >
                                                {part.text}
                                            </Streamdown>
                                        )
                                    }
                                    if (part.type === "tool-draftEmail") {
                                        const input = (part as {input?: {subject?: string; body?: string}}).input
                                        return <DraftEmailCard key={i} subject={input?.subject ?? ""} body={input?.body ?? ""}/>
                                    }
                                    if (part.type === "tool-bookMeeting") {
                                        return <BookingForm key={i}/>
                                    }
                                    if (part.type.startsWith("tool-")) {
                                        return (
                                            <span key={i} className="block text-[10px] font-mono text-muted-foreground">
                                                🔎 searching portfolio…
                                            </span>
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        ))}

                        {busy && (
                            <p className="text-[10px] font-mono text-muted-foreground animate-pulse">thinking…</p>
                        )}
                        {error && (
                            <p className="text-xs text-red-400">
                                Couldn&apos;t process that — try rephrasing, or email seif-dx@proton.me directly.
                            </p>
                        )}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            submit(input)
                        }}
                        className="flex items-center gap-2 border-t border-border px-3 py-2"
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about Seif…"
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                        <button
                            type="submit"
                            disabled={busy || !input.trim()}
                            aria-label="Send"
                            className="text-accent disabled:opacity-40"
                        >
                            <Send size={16}/>
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

/**
 * Human-in-the-loop approval card rendered when the agent calls draftEmail.
 * The agent writes the draft; the visitor adds name/email and approves.
 * Details post straight to the agent's /contact endpoint (Resend) —
 * they never pass through the LLM, so PII guardrails stay out of the way.
 */
function DraftEmailCard({subject, body}: {subject: string; body: string}) {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")
    const [fields, setFields] = useState({name: "", email: ""})

    if (state === "sent") {
        return (
            <div className="mt-2 rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-muted-foreground">
                ✓ Sent — Seif will reply to {fields.email}.
            </div>
        )
    }

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                setState("sending")
                try {
                    const res = await fetch(`${AGENT_URL}/contact`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({...fields, subject, message: body}),
                    })
                    const data = await res.json().catch(() => null)
                    setState(res.ok && data?.sent ? "sent" : "error")
                } catch {
                    setState("error")
                }
            }}
            className="mt-2 space-y-2 rounded-lg border border-border bg-secondary/20 p-3"
        >
            <p className="text-xs font-medium">Draft email to Seif — review &amp; approve.</p>
            <div className="rounded border border-border bg-background px-2 py-1.5">
                <p className="text-xs font-medium">{subject || "…"}</p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{body || "…"}</p>
            </div>
            <input
                required
                placeholder="Your name"
                value={fields.name}
                onChange={(e) => setFields({...fields, name: e.target.value})}
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent"
            />
            <input
                required
                type="email"
                placeholder="Your email — Seif replies here"
                value={fields.email}
                onChange={(e) => setFields({...fields, email: e.target.value})}
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent"
            />
            <button
                type="submit"
                disabled={state === "sending" || body.trim().length < 10}
                className="w-full rounded bg-accent px-2 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-50"
            >
                {state === "sending" ? "Sending…" : "Approve & send"}
            </button>
            <p className="text-[10px] text-muted-foreground">Want changes? Just tell me in the chat.</p>
            {state === "error" && (
                <p className="text-[10px] text-red-400">Sending failed — email seif-dx@proton.me instead.</p>
            )}
        </form>
    )
}

/**
 * Input step rendered when the agent calls bookMeeting: collects name/email
 * client-side, then opens a prefilled 30-minute Calendly page.
 */
function BookingForm() {
    const [opened, setOpened] = useState(false)
    const [fields, setFields] = useState({name: "", email: ""})

    const bookingUrl = () => {
        const url = new URL(LINKS.CALENDLY)
        if (fields.name) url.searchParams.set("name", fields.name)
        if (fields.email) url.searchParams.set("email", fields.email)
        return url.toString()
    }

    if (opened) {
        return (
            <div className="mt-2 rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-muted-foreground">
                ✓ Calendly opened — pick any 30-minute slot.{" "}
                <a href={bookingUrl()} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                    Reopen it
                </a>{" "}
                if it didn&apos;t appear.
            </div>
        )
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                window.open(bookingUrl(), "_blank", "noopener,noreferrer")
                setOpened(true)
            }}
            className="mt-2 space-y-2 rounded-lg border border-border bg-secondary/20 p-3"
        >
            <p className="text-xs font-medium">Book a 30-minute call with Seif.</p>
            <input
                required
                placeholder="Your name"
                value={fields.name}
                onChange={(e) => setFields({...fields, name: e.target.value})}
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent"
            />
            <input
                required
                type="email"
                placeholder="Your email"
                value={fields.email}
                onChange={(e) => setFields({...fields, email: e.target.value})}
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent"
            />
            <button
                type="submit"
                className="w-full rounded bg-accent px-2 py-1.5 text-xs font-medium text-accent-foreground"
            >
                Pick a time slot
            </button>
        </form>
    )
}
