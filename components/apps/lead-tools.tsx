"use client"

import {useState} from "react"
import LeadForm from "@/components/apps/lead-form"
import {
    DURATIONS,
    FREQUENCIES,
    scoreFinder,
    TASKS,
    TOOL_KINDS,
    verdict,
    type FinderResult,
    type TaskAnswer,
    type ToolKind,
} from "@/lib/automation-finder"

/**
 * Interactive tools that sit inside their offer in the Services app:
 * value first, then an optional "send this to Seif".
 */

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

export function OutboundRoi() {
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

// ── Automation Opportunity Finder ────────────────────────────────────────────

const AREAS = ["Sales", "Operations", "Finance", "Support", "Marketing"] as const

export function AutomationFinder() {
    const [step, setStep] = useState<"tools" | "tasks" | "result">("tools")
    const [tools, setTools] = useState<ToolKind[]>([])
    const [answers, setAnswers] = useState<TaskAnswer[]>([])
    const result = scoreFinder(tools, answers)

    const toggleTool = (id: ToolKind) => setTools((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))
    const answerFor = (taskId: string) => answers.find((a) => a.taskId === taskId)
    const toggleTask = (taskId: string) =>
        setAnswers((a) => (a.some((x) => x.taskId === taskId) ? a.filter((x) => x.taskId !== taskId) : [...a, {taskId, frequency: "weekly", minutes: 30, people: 1}]))
    const updateTask = (taskId: string, patch: Partial<TaskAnswer>) =>
        setAnswers((a) => a.map((x) => (x.taskId === taskId ? {...x, ...patch} : x)))

    return (
        <div className="space-y-4">
            <ol className="flex gap-2 text-[11px]" aria-label="Progress">
                {(["tools", "tasks", "result"] as const).map((s, i) => (
                    <li key={s} className={`flex-1 rounded-full py-1 text-center ${step === s ? "bg-accent/20 text-accent" : "bg-foreground/5 text-muted-foreground"}`}>
                        {i + 1}. {s === "tools" ? "Your tools" : s === "tasks" ? "Your busywork" : "Your plan"}
                    </li>
                ))}
            </ol>

            {step === "tools" && (
                <div className="space-y-3">
                    <p className="text-sm font-medium">Which tools does your team use?</p>
                    <div className="grid grid-cols-2 gap-2">
                        {TOOL_KINDS.map((k) => (
                            <button
                                key={k.id}
                                onClick={() => toggleTool(k.id)}
                                aria-pressed={tools.includes(k.id)}
                                className={`rounded-lg border px-3 py-2 text-left ${tools.includes(k.id) ? "border-accent/50 bg-accent/10" : "border-border hover:bg-foreground/5"}`}
                            >
                                <p className="text-xs font-medium">{k.label}</p>
                                <p className="text-[10px] text-muted-foreground">{k.examples}</p>
                            </button>
                        ))}
                    </div>
                    <StepButton disabled={!tools.length} onClick={() => setStep("tasks")}>Next: your busywork</StepButton>
                </div>
            )}

            {step === "tasks" && (
                <div className="space-y-3">
                    <p className="text-sm font-medium">Which of these eat your team&apos;s time?</p>
                    {AREAS.map((area) => (
                        <div key={area}>
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{area}</p>
                            <div className="space-y-1.5">
                                {TASKS.filter((t) => t.area === area).map((t) => {
                                    const a = answerFor(t.id)
                                    return (
                                        <div key={t.id} className={`rounded-lg border px-3 py-2 ${a ? "border-accent/40 bg-accent/5" : "border-border"}`}>
                                            <label className="flex cursor-pointer items-center gap-2 text-xs">
                                                <input type="checkbox" checked={!!a} onChange={() => toggleTask(t.id)} className="accent-[hsl(var(--accent))]"/>
                                                {t.label}
                                            </label>
                                            {a && (
                                                <div className="mt-2 flex flex-wrap items-center gap-2 pl-5 text-[11px] text-muted-foreground">
                                                    <select value={a.frequency} onChange={(e) => updateTask(t.id, {frequency: e.target.value as TaskAnswer["frequency"]})} className="rounded border border-border bg-background px-1.5 py-0.5 text-foreground" aria-label="How often">
                                                        {FREQUENCIES.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                                                    </select>
                                                    <span>for</span>
                                                    <select value={a.minutes} onChange={(e) => updateTask(t.id, {minutes: Number(e.target.value)})} className="rounded border border-border bg-background px-1.5 py-0.5 text-foreground" aria-label="Minutes each time">
                                                        {DURATIONS.map((m) => <option key={m} value={m}>{m < 60 ? `${m} min` : `${m / 60} h`}</option>)}
                                                    </select>
                                                    <span>by</span>
                                                    <input type="number" min={1} max={50} value={a.people} onChange={(e) => updateTask(t.id, {people: Math.max(1, Number(e.target.value) || 1)})} className="w-12 rounded border border-border bg-background px-1.5 py-0.5 text-foreground" aria-label="People"/>
                                                    <span>{a.people === 1 ? "person" : "people"}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-2">
                        <StepButton secondary onClick={() => setStep("tools")}>Back</StepButton>
                        <StepButton disabled={!answers.length} onClick={() => setStep("result")}>See my automation plan</StepButton>
                    </div>
                </div>
            )}

            {step === "result" && <FinderResultView result={result} onBack={() => setStep("tasks")} tools={tools}/>}
        </div>
    )
}

function FinderResultView({result, onBack, tools}: {result: FinderResult; onBack: () => void; tools: ToolKind[]}) {
    const {title, body} = verdict(result.score)
    const top = result.ranked.slice(0, 3)
    const days = result.hoursPerMonth / 8
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/20 p-4">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4 border-accent/60">
                    <span className="text-2xl font-semibold tabular-nums">{result.score}</span>
                    <span className="text-[9px] uppercase tracking-wide text-muted-foreground">/ 100</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
                    <p className="mt-2 text-xs">
                        <span className="font-semibold text-accent">{Math.round(result.hoursPerMonth)} hours</span> a month back
                        {days >= 1 && <span className="text-muted-foreground">, about {days.toFixed(1)} working days</span>}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <Bar label="Volume" value={result.volume} hint="time spent on it"/>
                <Bar label="Repeatability" value={result.repeatability} hint="follows fixed rules"/>
                <Bar label="Tool fit" value={result.toolFit} hint="already in connectable tools"/>
            </div>
            <div>
                <p className="mb-2 text-xs font-semibold">Your top {top.length} automation{top.length === 1 ? "" : "s"}</p>
                <ol className="space-y-2">
                    {top.map((r, i) => (
                        <li key={r.task.id} className="rounded-lg border border-border bg-secondary/10 p-3">
                            <div className="flex items-baseline justify-between gap-2">
                                <p className="text-xs font-medium">{i + 1}. {r.task.label}</p>
                                <p className="shrink-0 text-xs font-semibold tabular-nums text-accent">{r.hoursSaved.toFixed(1)} h/mo</p>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px]">
                                {r.task.flow.map((stepLabel, j) => (
                                    <span key={stepLabel} className="flex items-center gap-1">
                                        {j > 0 && <span className="text-muted-foreground">→</span>}
                                        <span className="rounded bg-foreground/[0.07] px-1.5 py-0.5">{stepLabel}</span>
                                    </span>
                                ))}
                            </div>
                            {r.missingTools.length > 0 && (
                                <p className="mt-1.5 text-[10px] text-muted-foreground">
                                    Also needs: {r.missingTools.map((k) => TOOL_KINDS.find((t) => t.id === k)?.label).join(", ")}
                                </p>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
            <LeadForm
                source="services-automation"
                cta="Want these built? Send your plan to Seif and he'll map your processes and build the first workflow."
                context={`Automation finder: score ${result.score}/100, ~${Math.round(result.hoursPerMonth)} h/month. Tools: ${tools.join(", ")}. Top: ${top.map((r) => `${r.task.label} (${r.hoursSaved.toFixed(1)} h)`).join("; ")}.`}
            />
            <StepButton secondary onClick={onBack}>Adjust my answers</StepButton>
        </div>
    )
}

function Bar({label, value, hint}: {label: string; value: number; hint: string}) {
    return (
        <div>
            <div className="flex items-baseline justify-between text-[11px]">
                <span className="font-medium">{label}</span>
                <span className="tabular-nums text-muted-foreground">{value}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full rounded-full bg-accent" style={{width: `${value}%`}}/>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
        </div>
    )
}

function StepButton({children, onClick, disabled, secondary}: {children: React.ReactNode; onClick: () => void; disabled?: boolean; secondary?: boolean}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40 ${secondary ? "border border-border hover:bg-foreground/10" : "bg-accent text-accent-foreground hover:brightness-110"}`}
        >
            {children}
        </button>
    )
}
