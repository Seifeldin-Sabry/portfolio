"use client"

import {useEffect, useRef, useState} from "react"
import {ArrowUp, RotateCcw, Sparkles, Square, X} from "lucide-react"
import {Streamdown} from "streamdown"

import {useAssistant} from "@/components/assistant/assistant-provider"
import ContactForm from "@/components/site/contact-form"
import {ASSISTANT_STARTERS} from "@/lib/site"
import {SITE_CONFIG, bookingUrl} from "@/lib/constants"
import {cn} from "@/lib/utils"

/** Floating launcher plus the chat panel (side sheet on desktop, full sheet on phones). */
export default function AssistantPanel() {
    const {isOpen, open, close} = useAssistant()

    return (
        <>
            {!isOpen && (
                <button
                    onClick={open}
                    className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background shadow-lg transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
                    aria-label="Ask my AI assistant"
                >
                    <Sparkles size={16} aria-hidden/>
                    Ask my AI
                    <kbd className="hidden rounded border border-background/30 px-1.5 font-mono text-[11px] text-background/70 sm:inline">/</kbd>
                </button>
            )}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[1px] sm:hidden" onClick={close} aria-hidden/>
                    <section
                        role="dialog"
                        aria-label="Chat with Seif's AI assistant"
                        className="fixed inset-x-0 bottom-0 z-50 flex h-[88dvh] flex-col rounded-t-2xl border bg-card shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100dvh-3rem))] sm:w-[420px] sm:rounded-2xl"
                    >
                        <Chat/>
                    </section>
                </>
            )}
        </>
    )
}

function Chat() {
    const {chat, close, ask, reset} = useAssistant()
    const {messages, status, error, stop, regenerate} = chat
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const busy = status === "submitted" || status === "streaming"

    useEffect(() => {
        // On phones, focusing would open the keyboard over the starter questions.
        if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus()
    }, [])

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        // Follow the stream only while the reader is near the bottom; scroll
        // instantly while tokens arrive, because a smooth scroll per chunk stutters.
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160
        if (nearBottom) el.scrollTo({top: el.scrollHeight, behavior: busy ? "auto" : "smooth"})
    }, [messages, busy])

    const submit = () => {
        if (!input.trim() || busy) return
        ask(input)
        setInput("")
    }

    return (
        <>
            <header className="flex items-center gap-3 border-b px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Sparkles size={16} aria-hidden/>
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">Ask about Seif</p>
                    <p className="text-xs text-muted-foreground">
                        Answers come from this site. <a href="/ask" className="underline-offset-2 hover:underline">How it works</a>
                    </p>
                </div>
                {messages.length > 0 && (
                    <button onClick={reset} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Start a new chat" title="New chat">
                        <RotateCcw size={16}/>
                    </button>
                )}
                <button onClick={close} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Close chat">
                    <X size={18}/>
                </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
                {messages.length === 0 && <Starters onPick={ask}/>}

                {messages.map((m) => (
                    <div key={m.id} className={cn("text-sm leading-relaxed", m.role === "user" ? "ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-secondary px-3.5 py-2" : "max-w-full")}>
                        {m.parts.map((part, i) => {
                            if (part.type === "text") {
                                if (m.role === "user") return <span key={i}>{part.text}</span>
                                return (
                                    <Streamdown key={i} className="space-y-2 [&_a]:text-accent [&_a]:underline [&_li]:my-0.5 [&_ul]:pl-4">
                                        {part.text}
                                    </Streamdown>
                                )
                            }
                            if (part.type === "tool-showContactForm") return <ContactForm key={i} source="assistant" compact/>
                            if (part.type.startsWith("tool-") && busy) {
                                return <p key={i} className="text-xs text-muted-foreground">Looking through Seif&apos;s work…</p>
                            }
                            return null
                        })}
                    </div>
                ))}

                {status === "submitted" && <TypingDots/>}

                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
                        <p>That didn&apos;t go through.</p>
                        <div className="mt-1 flex gap-3 text-xs">
                            <button onClick={() => regenerate()} className="font-medium text-accent hover:underline">Try again</button>
                            <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="text-muted-foreground hover:text-foreground">or email Seif</a>
                        </div>
                    </div>
                )}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    submit()
                }}
                className="border-t p-3"
            >
                <div className="flex items-end gap-2 rounded-xl border bg-background px-3 py-2 focus-within:border-accent">
                    <textarea
                        ref={inputRef}
                        value={input}
                        rows={1}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                submit()
                            }
                        }}
                        placeholder="Ask anything about Seif's work…"
                        aria-label="Your question"
                        className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
                    />
                    {busy ? (
                        <button type="button" onClick={() => stop()} aria-label="Stop the answer" className="rounded-full bg-foreground p-1.5 text-background">
                            <Square size={14}/>
                        </button>
                    ) : (
                        <button type="submit" disabled={!input.trim()} aria-label="Send" className="rounded-full bg-foreground p-1.5 text-background disabled:opacity-30">
                            <ArrowUp size={14}/>
                        </button>
                    )}
                </div>
                <p className="mt-2 flex justify-between px-1 text-[11px] text-muted-foreground">
                    <span>Enter to send · Shift+Enter for a new line</span>
                    <a href={bookingUrl("assistant")} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Book a call →</a>
                </p>
            </form>
        </>
    )
}

function Starters({onPick}: {onPick: (q: string) => void}) {
    const [group, setGroup] = useState(0)
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Hi, I&apos;m Seif&apos;s assistant. Ask me about his work, or pick a question. Who are you?
            </p>
            <div className="flex flex-wrap gap-1.5" role="tablist">
                {ASSISTANT_STARTERS.map((g, i) => (
                    <button
                        key={g.audience}
                        role="tab"
                        aria-selected={i === group}
                        onClick={() => setGroup(i)}
                        className={cn("rounded-full border px-3 py-1 text-xs transition-colors", i === group ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
                    >
                        {g.audience}
                    </button>
                ))}
            </div>
            <div className="space-y-2">
                {ASSISTANT_STARTERS[group].questions.map((q) => (
                    <button key={q} onClick={() => onPick(q)} className="block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:border-accent/50 hover:bg-accent/5">
                        {q}
                    </button>
                ))}
            </div>
        </div>
    )
}

function TypingDots() {
    return (
        <div className="flex gap-1" aria-label="Thinking">
            {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{animationDelay: `${i * 120}ms`}}/>
            ))}
        </div>
    )
}
