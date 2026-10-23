/**
 * Shared content types + presentational maps. Client-safe (no fs) — the
 * markdown loaders live in lib/content.ts (server only).
 */

export interface Project {
    id: string
    title: string
    description: string
    technologies: string[]
    github?: string
    liveDemo?: string
    challenges?: string[]
    solutions?: string[]
    generalFeatures?: string[]
    myContributions?: string[]
    results?: string[]
    status?: "In Production" | "Live" | "Coming Soon"
}

export interface Experience {
    id: string
    role: string
    company: string
    companyLogo?: string
    period: string
    description: string
    achievements?: string[]
    technologies?: string[]
}

export interface Education {
    id: string
    school: string
    logo: string
    degree: string
    field: string
    start: string
    end: string
    info: string
    courseWork: string[]
}

export interface Service {
    id: string
    title: string
    audience: string
    /** who delivers it: SDX Studio or Seif directly */
    via: string
    description: string
    includes: string[]
    /** external site for the offer */
    link?: string
    /** Tools-app tab that sizes this offer for the visitor */
    tool?: "outbound" | "stripe"
    /** app that demonstrates it live */
    demo?: string
}

export interface CaseStudy {
    id: string
    title: string
    company: string
    stack: string[]
    problem: string
    approach: string[]
    outcome: string[]
}

export interface ChangelogEntry {
    sha: string
    date: string
    /** conventional-commit type: feat, fix, perf, ... */
    type: string
    summary: string
}
