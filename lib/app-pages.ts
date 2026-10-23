import type {AppId} from "@/components/apps/registry"

/**
 * Share copy per app: page <title>, meta description and the OG card text.
 * Every app gets a real static route (/apps/<id>) so a link to it unfurls
 * properly in LinkedIn, Slack or email instead of as a bare homepage link.
 */
export const APP_PAGES: Record<AppId, {title: string; description: string}> = {
    about: {title: "About Seif", description: "Software engineer in Antwerp. Owns the Qfacts platform end to end; founder of SDX Studio."},
    projects: {title: "Projects", description: "Qfacts.be, a GAMP 5 validated eQMS, and this AI-powered desktop portfolio."},
    experience: {title: "Experience", description: "Platform & infrastructure owner at Qfacts: monorepo, Stripe billing, GCP on Pulumi, an AI assistant."},
    blog: {title: "Writing", description: "Notes on platform engineering, AI evals and self-hosting."},
    assistant: {title: "Ask the Assistant", description: "A RAG assistant grounded in Seif's work, with fail-closed guardrails. Ask it anything."},
    lab: {title: "Lab: self-improving AI evals", description: "How this site's assistant is built: RAG, guardrails, LLM judges and an eval suite that grows itself in CI."},
    notes: {title: "Notes", description: "What Seif is working on now, and the engineering principles behind it."},
    terminal: {title: "Terminal", description: "A tiny terminal. Type help."},
    calculator: {title: "Calculator", description: "A calculator, because every desktop needs one."},
    services: {title: "Hire Seif", description: "Outbound for MSSPs via SDX Studio, platform audits, Stripe billing done right, and AI assistants with guardrails."},
    tools: {title: "Free tools: outbound ROI & Stripe billing check", description: "What are 6 qualified meetings worth to your MSSP? Is your Stripe billing safe? Two-minute answers."},
    mail: {title: "Email Seif", description: "Write to Seif directly. It goes straight to his inbox."},
    games: {title: "Games", description: "Apple Snake, Minesweeper and an unbeatable Tic-tac-toe."},
}
