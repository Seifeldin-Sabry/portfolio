"use client"

import {useState} from "react"
import {Send} from "lucide-react"
import {sendToSeif} from "@/lib/agent"
import {SITE_CONFIG} from "@/lib/constants"

const SUBJECTS = ["A project for Seif", "Outbound for my MSSP (SDX Studio)", "A role / hiring", "Just saying hi"]

/** Mail.app-style compose window; goes straight to Seif's inbox via /contact. */
export default function MailApp() {
    const [fields, setFields] = useState({name: "", email: "", subject: SUBJECTS[0], body: ""})
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")

    if (state === "sent") {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center [&_p]:mb-0">
                <Send size={28} className="text-accent"/>
                <p className="text-sm font-semibold">Message sent</p>
                <p className="text-xs text-muted-foreground">Seif will reply to {fields.email}, usually within a day.</p>
            </div>
        )
    }

    const row = "flex items-center gap-3 border-b border-window-border px-4 py-2 text-xs"
    const field = "flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
    return (
        <form
            className="flex h-full flex-col"
            onSubmit={async (e) => {
                e.preventDefault()
                setState("sending")
                const ok = await sendToSeif({name: fields.name, email: fields.email, message: `[${fields.subject}]\n\n${fields.body}`})
                setState(ok ? "sent" : "error")
            }}
        >
            <div className="flex items-center justify-between border-b border-window-border px-4 py-2">
                <span className="text-xs font-semibold">New Message</span>
                <button
                    type="submit"
                    disabled={state === "sending"}
                    aria-label="Send"
                    className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground disabled:opacity-50"
                >
                    <Send size={12}/> {state === "sending" ? "Sending…" : "Send"}
                </button>
            </div>
            <div className={row}>
                <span className="w-14 text-muted-foreground">To:</span>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">Seif &lt;{SITE_CONFIG.EMAIL}&gt;</span>
            </div>
            <label className={row}>
                <span className="w-14 text-muted-foreground">From:</span>
                <input required placeholder="Your name" value={fields.name} onChange={(e) => setFields({...fields, name: e.target.value})} className={field}/>
            </label>
            <label className={row}>
                <span className="w-14 text-muted-foreground">Reply-to:</span>
                <input required type="email" placeholder="you@company.com" value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} className={field}/>
            </label>
            <label className={row}>
                <span className="w-14 text-muted-foreground">Subject:</span>
                <select value={fields.subject} onChange={(e) => setFields({...fields, subject: e.target.value})} className={`${field} cursor-pointer`}>
                    {SUBJECTS.map((s) => (
                        <option key={s} className="bg-popover">{s}</option>
                    ))}
                </select>
            </label>
            <textarea
                required
                minLength={10}
                placeholder="What are you working on?"
                value={fields.body}
                onChange={(e) => setFields({...fields, body: e.target.value})}
                aria-label="Message"
                className="flex-1 resize-none bg-transparent px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60"
            />
            {state === "error" && <p className="px-4 pb-3 text-[11px] text-red-400">Sending failed. Email {SITE_CONFIG.EMAIL} instead.</p>}
        </form>
    )
}
