"use client"

import {useState} from "react"
import LeadForm from "@/components/apps/lead-form"

type ToolId = "outbound" | "automation"

const TOOLS: {id: ToolId; label: string}[] = [
    {id: "outbound", label: "Outbound ROI (MSSPs)"},
    {id: "automation", label: "Automation savings"},
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
                {tool === "outbound" ? <OutboundRoi/> : <AutomationSavings/>}
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

// ── Automation savings ──────────────────────────────────────────────────────

const WEEKS_PER_MONTH = 52 / 12

export function automationSavings(hoursPerWeek: number, automatablePct: number, hourlyCost: number) {
    const hoursPerMonth = hoursPerWeek * WEEKS_PER_MONTH * (automatablePct / 100)
    return {hoursPerMonth, perYear: hoursPerMonth * 12 * hourlyCost}
}

function AutomationSavings() {
    const [hoursPerWeek, setHoursPerWeek] = useState(8)
    const [automatable, setAutomatable] = useState(50)
    const [hourlyCost, setHourlyCost] = useState(45)
    const {hoursPerMonth, perYear} = automationSavings(hoursPerWeek, automatable, hourlyCost)

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold">How much time is your team losing to busywork?</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                    Copy-pasting between tools, chasing updates, re-typing data. Count it, then see what n8n and AI could take off your plate.
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <NumberField label="Repetitive work" hint="Team hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="h"/>
                <NumberField label="Automatable" hint="Share that follows a fixed pattern" value={automatable} onChange={(n) => setAutomatable(Math.min(100, n))} suffix="%"/>
                <NumberField label="Cost of an hour" hint="Loaded cost of whoever does it" value={hourlyCost} onChange={setHourlyCost} suffix="€"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Stat label="Hours back every month" value={`${Math.round(hoursPerMonth)} h`} highlight/>
                <Stat label="Worth per year" value={eur(perYear)}/>
            </div>
            <p className="text-[11px] text-muted-foreground">
                {hoursPerMonth >= 15
                    ? "That's squarely in range: most teams I look at have 15+ hours a month to win back."
                    : "Smaller teams often find more once the processes are mapped; a diagnosis makes it concrete."}
            </p>
            <LeadForm
                source="tools-automation"
                cta="Want those hours back? Send this to Seif and he'll look at your processes."
                context={`Automation savings: ${hoursPerWeek} h/week repetitive, ${automatable}% automatable, €${hourlyCost}/h -> ${Math.round(hoursPerMonth)} h/month, ${eur(perYear)}/year.`}
            />
        </div>
    )
}
