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
