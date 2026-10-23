"use client"

import {useState} from "react"
import Image from "next/image"
import {ArrowUpRight, Calendar, Download, FileText, Github, Globe, Linkedin, Mail} from "lucide-react"
import {bookingUrl, LINKS, SITE_CONFIG} from "@/lib/constants"

const techStack = [
    {name: "ElysiaJS", color: "text-yellow-400"},
    {name: "TanStack", color: "text-blue-400"},
    {name: "React", color: "text-cyan-400"},
    {name: "Tailwind", color: "text-sky-400"},
    {name: "Drizzle", color: "text-lime-200"},
    {name: "Better Auth", color: "text-orange-400"},
]

const skillCategories = [
    {
        title: "AI-First Dev",
        color: "border-accent/30 bg-accent/10 text-accent",
        items: ["Claude Code", "Command Code", "T3 Code", "Skills"],
        highlight: "0 hand-written lines in 2026",
    },
    {
        title: "Dev Tools",
        color: "border-blue-400/30 bg-blue-400/10 text-blue-400",
        items: ["cmux", "Git", "Docker", "Drizzle"],
    },
    {
        title: "Languages",
        color: "border-yellow-400/30 bg-yellow-400/10 text-yellow-400",
        items: ["TypeScript", "Python"],
    },
    {
        title: "Frameworks",
        color: "border-cyan-400/30 bg-cyan-400/10 text-cyan-400",
        items: ["Next.js", "TanStack", "NestJS", "FastAPI"],
    },
    {
        title: "Cloud",
        color: "border-purple-400/30 bg-purple-400/10 text-purple-400",
        items: ["Fly.io", "GCP", "AWS"],
    },
    {
        title: "AI Tools",
        color: "border-pink-400/30 bg-pink-400/10 text-pink-400",
        items: ["Mastra", "AI SDK", "Langfuse", "HuggingFace"],
    },
]

export default function AboutApp() {
    const [cvOpen, setCvOpen] = useState(false)
    return (
        <div className="h-full overflow-y-auto px-4 py-4">
            <div className="mx-auto max-w-[65ch]">
                {/* Identity */}
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-border">
                            <Image src="/assets/images/seif.jpg" alt="Seifeldin Sabry" fill className="object-cover" priority/>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 animate-pulse rounded-full border-2 border-background bg-accent"/>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight">Seif</h1>
                            <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-xs text-accent">Live</span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Engineer @ <span className="font-medium text-foreground">Qfacts</span> · Founder @{" "}
                            <a href={LINKS.SDX_STUDIO} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline decoration-foreground/30 underline-offset-2 hover:text-accent">
                                SDX Studio
                            </a> (GTM engineering)
                        </p>
                    </div>
                </div>

                {/* Bio */}
                <div className="mt-5 space-y-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Software engineer in Antwerp. At QFacts I own the platform end to end and shipped its AI agent, mobile
                        companion and the company&apos;s new marketing site and CMS.
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        I take pride in my work, in clear communication and in the trust I build with the people I work with. I
                        focus on delivering quality outcomes for the business, and I pick up new skills wherever I can.
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        I use T3 Code to combine different coding agents, and automated schedules so my software processes keep
                        improving themselves.
                    </p>
                </div>

                {/* Current stack */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                    {techStack.map((tech) => (
                        <div
                            key={tech.name}
                            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30"
                        >
                            <span className={`h-1.5 w-1.5 rounded-full bg-current ${tech.color}`}/>
                            <span className="text-xs font-medium">{tech.name}</span>
                        </div>
                    ))}
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent"/>
                        Remote
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"/>
                        Open to opportunities
                    </span>
                </div>

                {/* CV */}
                <details className="group mt-5" onToggle={(e) => setCvOpen(e.currentTarget.open)}>
                    <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg border border-border/70 bg-secondary/20 px-3 py-2.5 transition-colors duration-300 hover:border-accent/25 [&::-webkit-details-marker]:hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 text-accent">
                            <FileText size={16} aria-hidden="true"/>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">CV</p>
                            <p className="hidden truncate text-xs text-muted-foreground sm:block">View my resume inline · PDF</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="hidden sm:inline">View</span>
                        </div>
                    </summary>
                    <div className="mt-2 overflow-hidden rounded-lg border border-border/70 bg-secondary/20">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="font-medium">CV preview</span>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">PDF</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <a
                                    href="/assets/documents/seifeldin-sabry-cv.pdf"
                                    download="Seifeldin-Sabry-CV.pdf"
                                    className="inline-flex items-center gap-1.5 rounded-md border border-accent/35 px-2.5 py-1.5 text-xs font-medium text-accent transition-colors duration-300 hover:bg-accent/10"
                                >
                                    <Download size={13} aria-hidden="true"/>
                                    Download
                                </a>
                                <a
                                    href="/assets/documents/seifeldin-sabry-cv.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-accent/40 hover:text-foreground"
                                >
                                    Open
                                    <ArrowUpRight size={13} aria-hidden="true"/>
                                </a>
                            </div>
                        </div>
                        {/* The embedded PDF viewer is heavy on phones: mount it only
                            when the preview is actually opened. */}
                        {cvOpen && (
                            <div className="bg-white p-1.5">
                                <iframe
                                    src="/assets/documents/seifeldin-sabry-cv.pdf#toolbar=0&navpanes=0&view=FitH"
                                    title="Seifeldin Sabry CV preview"
                                    loading="lazy"
                                    className="h-[70vh] max-h-[720px] min-h-[420px] w-full rounded-sm border border-foreground/10 bg-white"
                                />
                            </div>
                        )}
                    </div>
                </details>

                {/* Skills */}
                <h2 className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tech stack</h2>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {skillCategories.map((category) => (
                        <div key={category.title} className={`rounded-lg border px-3 py-2 ${category.color}`}>
                            <p className="text-xs font-medium">{category.title}</p>
                            {category.highlight ? (
                                <p className="mt-1 font-mono text-[10px]">{category.highlight}</p>
                            ) : (
                                <p className="mt-1 text-[10px] text-muted-foreground">{category.items.join(", ")}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Socials */}
                <div className="mt-6 flex items-center gap-2 pb-2">
                    <SocialLink href={LINKS.SDX_STUDIO} label="SDX Studio">
                        <Globe size={16}/>
                    </SocialLink>
                    <SocialLink href={LINKS.GITHUB} label="GitHub">
                        <Github size={16}/>
                    </SocialLink>
                    <SocialLink href={LINKS.LINKEDIN} label="LinkedIn">
                        <Linkedin size={16}/>
                    </SocialLink>
                    <SocialLink href={`mailto:${SITE_CONFIG.EMAIL}`} label="Email">
                        <Mail size={16}/>
                    </SocialLink>
                    <SocialLink href={bookingUrl("about")} label="Book a call">
                        <Calendar size={16}/>
                    </SocialLink>
                </div>
            </div>
        </div>
    )
}

function SocialLink({href, label, children}: {href: string; label: string; children: React.ReactNode}) {
    return (
        <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary/30 text-muted-foreground transition-all duration-300 hover:border-accent/30 hover:text-accent"
        >
            {children}
        </a>
    )
}
