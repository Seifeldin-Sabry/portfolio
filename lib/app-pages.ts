import type {AppId} from "@/components/apps/registry"

/**
 * Share copy per app: page <title>, meta description and the OG card text.
 * Every app gets a real static route (/apps/<id>) so a link to it unfurls
 * properly in LinkedIn, Slack or email instead of as a bare homepage link.
 */
export const APP_PAGES: Record<AppId, {title: string; description: string}> = {
    about: {title: "About Seif", description: "Software engineer in Antwerp. Owns the Qfacts platform end to end; founder of SDX Studio."},
    work: {title: "Work", description: "Platform & infrastructure owner at Qfacts: experience, case studies and projects."},
    services: {title: "Hire Seif", description: "Outbound for MSSPs via SDX Studio, freelance software engineering, and AI automation workflows that win back 15+ hours a month."},
    blog: {title: "Writing", description: "Notes on platform engineering, AI evals and self-hosting."},
    assistant: {title: "Ask the Assistant", description: "A RAG assistant grounded in Seif's work, with fail-closed guardrails and self-improving evals. Ask it anything, or see how it's built."},
    games: {title: "Games", description: "Apple Snake, Minesweeper and an unbeatable Tic-tac-toe."},
}
