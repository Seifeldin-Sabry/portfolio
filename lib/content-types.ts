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

export interface HomelabService {
    id: string
    title: string
    description: string
    icon: string
    technologies: string[]
    features: string[]
    category: "infrastructure" | "media" | "security" | "backup"
}

export const categoryColors: Record<HomelabService["category"], string> = {
    infrastructure: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    media: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    security: "bg-green-500/10 text-green-400 border-green-500/20",
    backup: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}
