/**
 * Automation Opportunity Finder: scores a visitor's own recurring tasks.
 * Criteria follow common practice (Zapier's "what to automate next",
 * scorecard-style assessments): volume = frequency × time × people,
 * how rule-based the task is, error risk, and whether it already lives in
 * tools n8n can connect. Pure functions, so the maths has a runnable check.
 */

export type ToolKind = "email" | "chat" | "crm" | "sheets" | "forms" | "calendar" | "docs" | "invoicing"

export const TOOL_KINDS: {id: ToolKind; label: string; examples: string}[] = [
    {id: "email", label: "Email", examples: "Gmail, Outlook"},
    {id: "chat", label: "Team chat", examples: "Slack, Teams"},
    {id: "crm", label: "CRM", examples: "HubSpot, Pipedrive"},
    {id: "sheets", label: "Spreadsheets", examples: "Sheets, Excel, Airtable"},
    {id: "forms", label: "Forms", examples: "Typeform, website forms"},
    {id: "calendar", label: "Calendar", examples: "Google, Calendly"},
    {id: "docs", label: "Docs", examples: "Notion, Google Docs"},
    {id: "invoicing", label: "Invoicing", examples: "Stripe, Exact, QuickBooks"},
]

export interface TaskTemplate {
    id: string
    area: "Sales" | "Operations" | "Finance" | "Support" | "Marketing"
    label: string
    /** share of the work that follows fixed rules, so it can be automated (0-1) */
    ruleBased: number
    /** manual copying where mistakes are common */
    errorProne?: boolean
    tools: ToolKind[]
    /** the n8n workflow that would replace it, step by step */
    flow: string[]
}

export const TASKS: TaskTemplate[] = [
    {id: "lead-entry", area: "Sales", label: "Copying new leads into the CRM", ruleBased: 0.9, errorProne: true, tools: ["forms", "crm"], flow: ["Form submitted", "AI enriches the company", "Create CRM contact", "Ping sales in chat"]},
    {id: "follow-ups", area: "Sales", label: "Writing follow-ups after calls", ruleBased: 0.6, tools: ["calendar", "crm", "email"], flow: ["Call ends", "AI drafts follow-up from notes", "You approve", "Send + log in CRM"]},
    {id: "call-prep", area: "Sales", label: "Researching prospects before calls", ruleBased: 0.7, tools: ["calendar", "crm"], flow: ["Meeting booked", "AI researches company + person", "Brief lands in your inbox"]},
    {id: "reporting", area: "Operations", label: "Building weekly reports", ruleBased: 0.9, tools: ["sheets", "chat"], flow: ["Every Monday 08:00", "Pull numbers from your tools", "AI writes the summary", "Post to team chat"]},
    {id: "onboarding", area: "Operations", label: "Onboarding new clients", ruleBased: 0.85, tools: ["crm", "docs", "email"], flow: ["Deal marked won", "Create folders + project", "Send welcome pack", "Book kickoff"]},
    {id: "approvals", area: "Operations", label: "Chasing approvals and status updates", ruleBased: 0.8, tools: ["chat", "email"], flow: ["Request submitted", "Route to approver", "Nudge after 24h", "Update the tracker"]},
    {id: "re-typing", area: "Operations", label: "Re-typing data between tools", ruleBased: 0.95, errorProne: true, tools: ["sheets", "crm"], flow: ["Record changes", "Map the fields", "Update the other tool", "Flag mismatches"]},
    {id: "invoicing", area: "Finance", label: "Creating and chasing invoices", ruleBased: 0.9, errorProne: true, tools: ["invoicing", "crm", "email"], flow: ["Milestone reached", "Generate invoice", "Email the client", "Remind if unpaid"]},
    {id: "receipts", area: "Finance", label: "Collecting receipts and expenses", ruleBased: 0.75, tools: ["email", "sheets"], flow: ["Receipt emailed in", "AI reads amount + vendor", "Add to bookkeeping"]},
    {id: "inbox-triage", area: "Support", label: "Sorting and answering inbound email", ruleBased: 0.6, tools: ["email", "chat"], flow: ["Email arrives", "AI classifies + drafts reply", "Route to the right person", "Escalate if urgent"]},
    {id: "repeat-questions", area: "Support", label: "Answering the same customer questions", ruleBased: 0.7, tools: ["email", "docs"], flow: ["Question comes in", "AI answers from your docs", "Human checks if unsure"]},
    {id: "repurposing", area: "Marketing", label: "Turning content into social posts", ruleBased: 0.6, tools: ["docs"], flow: ["New post or video", "AI drafts social versions", "You approve", "Schedule"]},
]

export const FREQUENCIES = [
    {id: "daily", label: "Daily", perMonth: 21},
    {id: "few-weekly", label: "Few times a week", perMonth: 12},
    {id: "weekly", label: "Weekly", perMonth: 4.3},
    {id: "monthly", label: "Monthly", perMonth: 1},
] as const

export const DURATIONS = [5, 15, 30, 60, 120] as const

export interface TaskAnswer {
    taskId: string
    frequency: (typeof FREQUENCIES)[number]["id"]
    minutes: number
    people: number
}

export interface RankedTask {
    task: TaskTemplate
    hoursSaved: number
    /** tools this workflow needs that the visitor doesn't use yet */
    missingTools: ToolKind[]
}

export interface FinderResult {
    /** 0-100 overall readiness */
    score: number
    volume: number
    repeatability: number
    toolFit: number
    hoursPerMonth: number
    ranked: RankedTask[]
}

/** A team with ~40 automatable hours a month or more scores full marks on volume. */
const FULL_VOLUME_HOURS = 40
const ERROR_BONUS = 1.2

export function hoursSaved(task: TaskTemplate, answer: TaskAnswer): number {
    const runs = FREQUENCIES.find((f) => f.id === answer.frequency)?.perMonth ?? 0
    return (runs * answer.minutes * answer.people * task.ruleBased) / 60
}

export function scoreFinder(tools: ToolKind[], answers: TaskAnswer[]): FinderResult {
    const picked = answers
        .map((a) => ({answer: a, task: TASKS.find((t) => t.id === a.taskId)}))
        .filter((p): p is {answer: TaskAnswer; task: TaskTemplate} => p.task !== undefined)

    const ranked = picked
        .map(({task, answer}) => ({
            task,
            hoursSaved: hoursSaved(task, answer),
            missingTools: task.tools.filter((k) => !tools.includes(k)),
        }))
        // Error-prone manual work ranks higher: automating it also removes mistakes.
        .sort((a, b) => b.hoursSaved * (b.task.errorProne ? ERROR_BONUS : 1) - a.hoursSaved * (a.task.errorProne ? ERROR_BONUS : 1))

    const hoursPerMonth = ranked.reduce((sum, r) => sum + r.hoursSaved, 0)
    const needed = ranked.flatMap((r) => r.task.tools)
    const volume = Math.round(Math.min(hoursPerMonth / FULL_VOLUME_HOURS, 1) * 100)
    const repeatability = picked.length ? Math.round((picked.reduce((s, p) => s + p.task.ruleBased, 0) / picked.length) * 100) : 0
    const toolFit = needed.length ? Math.round((needed.filter((k) => tools.includes(k)).length / needed.length) * 100) : 0
    const score = Math.round(0.45 * volume + 0.35 * repeatability + 0.2 * toolFit)

    return {score, volume, repeatability, toolFit, hoursPerMonth, ranked}
}

export function verdict(score: number): {title: string; body: string} {
    if (score >= 70) return {title: "Prime for automation", body: "Lots of repetitive, rule-based work in tools that connect. This is where automation pays back fastest."}
    if (score >= 40) return {title: "Clear quick wins", body: "A few workflows are worth automating now. Start with the top one and let it pay for the rest."}
    return {title: "Start with one workflow", body: "Not a lot of volume yet. One well-chosen automation is the right first step."}
}
