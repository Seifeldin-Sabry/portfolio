"use client"

import {useState} from "react"
import {sendToSeif} from "@/lib/agent"
import {bookingUrl} from "@/lib/constants"

/**
 * End-of-tool capture: the visitor already has their result on screen; this
 * sends it to Seif with their details so he can follow up personally.
 * `context` is the tool result, appended to whatever the visitor writes.
 */
export default function LeadForm({context, source, cta}: {context: string; source: string; cta: string}) {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")
    const [fields, setFields] = useState({name: "", email: "", note: ""})

    if (state === "sent") {
        return (
            <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
                Sent. Seif will reply to <span className="font-medium">{fields.email}</span>, usually within a day.{" "}
                <a href={bookingUrl(source)} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                    Or book a quick chat now
                </a>
                .
            </div>
        )
    }

    const input = "w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs outline-none focus:border-accent"
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                setState("sending")
                const message = `${fields.note.trim() || "(no note)"}\n\n--- sent from the ${source} tool ---\n${context}`
                setState((await sendToSeif({name: fields.name, email: fields.email, message})) ? "sent" : "error")
            }}
            className="space-y-2 rounded-lg border border-border bg-secondary/20 p-3"
        >
            <p className="text-xs font-medium">{cta}</p>
            <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Your name" value={fields.name} onChange={(e) => setFields({...fields, name: e.target.value})} className={input} aria-label="Your name"/>
                <input required type="email" placeholder="Work email" value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} className={input} aria-label="Work email"/>
            </div>
            <textarea rows={2} placeholder="Anything to add? (optional)" value={fields.note} onChange={(e) => setFields({...fields, note: e.target.value})} className={`${input} resize-none`} aria-label="Optional note"/>
            <div className="flex items-center gap-3">
                <button type="submit" disabled={state === "sending"} className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-50">
                    {state === "sending" ? "Sending…" : "Send to Seif"}
                </button>
                <a href={bookingUrl(source)} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground">
                    or book a quick chat →
                </a>
            </div>
            {state === "error" && <p className="text-[11px] text-red-400">Sending failed. Email seif-dx@proton.me instead.</p>}
        </form>
    )
}
