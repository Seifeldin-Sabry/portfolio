"use client"

import {useState} from "react"

import {sendToSeif} from "@/lib/agent"
import {SITE_CONFIG} from "@/lib/constants"
import {cn} from "@/lib/utils"

const TOPICS = ["A role on my team", "A website or SEO project", "Outbound / GTM", "Something else"] as const

/**
 * Posts straight to the agent worker's /contact endpoint (Resend), so visitor
 * details never pass through the LLM.
 */
export default function ContactForm({source, compact = false}: {source: string; compact?: boolean}) {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")
    const [fields, setFields] = useState({name: "", email: "", topic: compact ? "" : TOPICS[0], message: ""})

    if (state === "sent") {
        return (
            <p className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm">
                Sent. Seif will reply to <span className="font-medium">{fields.email}</span>, usually within a day.
            </p>
        )
    }

    const field = "w-full rounded-lg border bg-background px-3 py-2 text-base outline-none transition-colors focus:border-accent sm:text-sm"
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                setState("sending")
                const topic = fields.topic ? `Topic: ${fields.topic}\n\n` : ""
                const message = `${topic}${fields.message}\n\n--- sent from the ${source} form ---`
                setState((await sendToSeif({name: fields.name, email: fields.email, message})) ? "sent" : "error")
            }}
            className={cn("space-y-3", compact && "mt-2 rounded-xl border bg-background/60 p-3")}
        >
            {compact && <p className="text-sm font-medium">Send Seif a message, straight to his inbox.</p>}
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <input required autoComplete="name" value={fields.name} onChange={(e) => setFields({...fields, name: e.target.value})} className={field}/>
                </label>
                <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <input required type="email" autoComplete="email" value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} className={field}/>
                </label>
            </div>
            {!compact && (
                <fieldset className="space-y-1 text-sm">
                    <legend className="mb-1 text-muted-foreground">What is it about?</legend>
                    <div className="flex flex-wrap gap-2">
                        {TOPICS.map((t) => (
                            <button
                                type="button"
                                key={t}
                                onClick={() => setFields({...fields, topic: t})}
                                aria-pressed={fields.topic === t}
                                className={cn("rounded-full border px-3 py-1 text-sm transition-colors", fields.topic === t ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </fieldset>
            )}
            <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Message</span>
                <textarea required minLength={10} rows={compact ? 3 : 4} value={fields.message} onChange={(e) => setFields({...fields, message: e.target.value})} className={cn(field, "resize-none")}/>
            </label>
            <button type="submit" disabled={state === "sending"} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity disabled:opacity-50">
                {state === "sending" ? "Sending…" : "Send to Seif"}
            </button>
            {state === "error" && (
                <p className="text-sm text-destructive">
                    Sending failed. Email <a className="underline" href={`mailto:${SITE_CONFIG.EMAIL}`}>{SITE_CONFIG.EMAIL}</a> instead.
                </p>
            )}
        </form>
    )
}
