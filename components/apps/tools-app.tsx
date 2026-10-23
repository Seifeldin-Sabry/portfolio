"use client"

import {useState} from "react"
import LeadForm from "@/components/apps/lead-form"

type ToolId = "outbound" | "stripe"

const TOOLS: {id: ToolId; label: string}[] = [
    {id: "outbound", label: "Outbound ROI (MSSPs)"},
    {id: "stripe", label: "Stripe billing check"},
]

export default function ToolsApp() {
    const [tool, setTool] = useState<ToolId>("outbound")
    return (
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 gap-1 border-b border-window-border p-2" role="tablist">
                {TOOLS.map((t) => (
                    <button
                        key={t.id}
                        role="tab"
                        aria-selected={tool === t.id}
                        onClick={() => setTool(t.id)}
                        className={`rounded-md px-3 py-1 text-xs font-medium ${
                            tool === t.id ? "bg-foreground/15 text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto p-5 [&_p]:mb-0">
                {tool === "outbound" ? <OutboundRoi/> : <StripeCheck/>}
            </div>
        </div>
    )
}

// ── Outbound ROI ─────────────────────────────────────────────────────────────

/** SDX Studio's guarantee: 6 qualified appointments in 90 days. */
const GUARANTEED_MEETINGS = 6
const eur = (n: number) => new Intl.NumberFormat("en-IE", {style: "currency", currency: "EUR", maximumFractionDigits: 0}).format(n)

function NumberField({label, hint, value, onChange, suffix}: {label: string; hint: string; value: number; onChange: (n: number) => void; suffix?: string}) {
    return (
        <label className="block">
            <span className="text-xs font-medium">{label}</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 focus-within:border-accent">
                <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-transparent text-sm tabular-nums outline-none"
                />
                {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
            </span>
            <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
        </label>
    )
}

export function outboundRoi(dealValue: number, closeRatePct: number) {
    const clients = GUARANTEED_MEETINGS * (closeRatePct / 100)
    const perQuarter = clients * dealValue
    return {clients, perQuarter, perYear: perQuarter * 4}
}

function OutboundRoi() {
    const [dealValue, setDealValue] = useState(24000)
    const [closeRate, setCloseRate] = useState(20)
    const {clients, perQuarter, perYear} = outboundRoi(dealValue, closeRate)

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold">What are 6 qualified meetings worth to your MSSP?</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                    SDX Studio books {GUARANTEED_MEETINGS} qualified appointments in 90 days, or keeps working for free. Plug in your numbers.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <NumberField label="First-year value of a new client" hint="Managed security contract, year one" value={dealValue} onChange={setDealValue} suffix="€"/>
                <NumberField label="Meetings that become clients" hint="Your close rate from a qualified meeting" value={closeRate} onChange={(n) => setCloseRate(Math.min(100, n))} suffix="%"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <Stat label="New clients / quarter" value={clients.toFixed(1)}/>
                <Stat label="First-year revenue / quarter" value={eur(perQuarter)}/>
                <Stat label="At that pace, per year" value={eur(perYear)} highlight/>
            </div>
            <p className="text-[11px] text-muted-foreground">Your inputs, simple maths: an estimate, not a promise.</p>
            <LeadForm
                source="tools-outbound"
                cta="Want this pipeline? Send it to Seif and he'll come back with a plan for your MSSP."
                context={`Outbound ROI: client value ${eur(dealValue)}, close rate ${closeRate}% -> ${clients.toFixed(1)} clients/quarter, ${eur(perQuarter)}/quarter, ${eur(perYear)}/year.`}
            />
        </div>
    )
}

function Stat({label, value, highlight}: {label: string; value: string; highlight?: boolean}) {
    return (
        <div className={`rounded-lg border p-3 ${highlight ? "border-accent/40 bg-accent/10" : "border-border bg-secondary/20"}`}>
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className={`mt-1 text-xl font-semibold tabular-nums ${highlight ? "text-accent" : ""}`}>{value}</p>
        </div>
    )
}

// ── Stripe billing health check ──────────────────────────────────────────────

/** Each check is a failure mode met while building Qfacts' self-serve billing. */
export const STRIPE_CHECKS: {q: string; risk: string}[] = [
    {q: "Every charge/subscription create call sends an idempotency key", risk: "Retries and double-clicks can charge a customer twice."},
    {q: "Webhook handlers are idempotent: the same event twice is harmless", risk: "Stripe redelivers events; non-idempotent handlers double-provision or double-email."},
    {q: "You verify webhook signatures", risk: "Anyone who finds the endpoint can forge 'payment succeeded'."},
    {q: "Missed webhooks are reconciled (catch-up job or event replay)", risk: "One outage silently leaves accounts in the wrong billing state."},
    {q: "Failed payments trigger dunning: retries plus customer emails", risk: "Involuntary churn: cards expire and revenue quietly leaks."},
    {q: "There's a grace period before access is revoked", risk: "A single declined card locks out a paying customer."},
    {q: "Upgrades, downgrades and seat changes (proration) are tested", risk: "Plan changes are where invoices go wrong and support tickets pile up."},
    {q: "Concurrent checkouts for one org can't create duplicate subscriptions", risk: "Race conditions create two customers or two subscriptions."},
    {q: "Billing state comes from Stripe, not a hand-maintained copy", risk: "Two sources of truth drift; someone ends up with free access."},
    {q: "Trial expiry and conversion are automated and tested", risk: "Trials that never end, or end without a working checkout."},
]

function StripeCheck() {
    const [answers, setAnswers] = useState<(boolean | null)[]>(() => STRIPE_CHECKS.map(() => null))
    const answered = answers.filter((a) => a !== null).length
    const score = answers.filter((a) => a === true).length
    const gaps = STRIPE_CHECKS.filter((_, i) => answers[i] === false)
    const done = answered === STRIPE_CHECKS.length

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-base font-semibold">Is your Stripe billing safe?</h2>
                <p className="mt-1 text-xs text-muted-foreground">Ten checks, each a real way self-serve billing breaks. Two minutes.</p>
            </div>
            <ol className="space-y-2">
                {STRIPE_CHECKS.map((c, i) => (
                    <li key={c.q} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/10 px-3 py-2">
                        <span className="w-5 text-xs tabular-nums text-muted-foreground">{i + 1}.</span>
                        <span className="flex-1 text-xs">{c.q}</span>
                        {[true, false].map((v) => (
                            <button
                                key={String(v)}
                                onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? v : x)))}
                                aria-pressed={answers[i] === v}
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                    answers[i] === v ? (v ? "bg-sky-500/25 text-sky-300" : "bg-rose-500/25 text-rose-300") : "bg-foreground/[0.06] text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {v ? "Yes" : "No"}
                            </button>
                        ))}
                    </li>
                ))}
            </ol>
            {done && (
                <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                    <p className="text-sm">
                        Score: <span className="text-xl font-semibold tabular-nums text-accent">{score}/10</span>{" "}
                        <span className="text-muted-foreground">
                            {score === 10 ? "Solid. Rare, too." : score >= 7 ? "Mostly safe, with a few sharp edges." : "Real money and trust at risk."}
                        </span>
                    </p>
                    {gaps.length > 0 && (
                        <ul className="space-y-1.5">
                            {gaps.map((g) => (
                                <li key={g.q} className="text-xs">
                                    <span className="font-medium">{g.q}.</span> <span className="text-muted-foreground">{g.risk}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {done && gaps.length > 0 && (
                <LeadForm
                    source="tools-stripe"
                    cta="Want these fixed? Send your result to Seif, who built Qfacts' billing from scratch."
                    context={`Stripe check: ${score}/10. Gaps: ${gaps.map((g) => g.q).join("; ")}.`}
                />
            )}
            {!done && <p className="text-[11px] text-muted-foreground">{answered}/10 answered</p>}
        </div>
    )
}
