import Image from "next/image"
import {Github, Linkedin, Mail, Calendar, Globe, Zap, Route, Atom, Wind, Database, Shield, FileText, Download, ArrowUpRight, ChevronDown} from "lucide-react"
import {SITE_CONFIG, LINKS} from "@/lib/constants"

const techStack = [
    { name: "ElysiaJS", icon: Zap, color: "text-yellow-400" },
    { name: "TanStack", icon: Route, color: "text-blue-400" },
    { name: "React", icon: Atom, color: "text-cyan-400" },
    { name: "Tailwind", icon: Wind, color: "text-sky-400" },
    { name: "Drizzle", icon: Database, color: "text-green-400" },
    { name: "Better Auth", icon: Shield, color: "text-orange-400" },
]

export default function ProfileSection() {
    return (
        <section className="py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Compact Profile Card */}
                <div className="flex items-start gap-4 mb-6">
                    {/* Profile Image with Status */}
                    <div className="relative">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-border">
                            <Image
                                src="/assets/images/seif.jpg"
                                alt="Seif Ismail"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Status Indicator - Discord Style */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full border-2 border-background animate-pulse-glow" />
                    </div>

                    {/* Name & Status */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-xl font-bold">Seif</h1>
                            <span className="text-xs font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">Live</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Founder @ <span className="text-foreground font-medium">SDX Studio</span> · Building <span className="text-foreground font-medium">Arkive</span> & <span className="text-foreground font-medium">Qfacts</span>
                        </p>
                    </div>
                </div>

                {/* Tech Stack Grid */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                    {techStack.map((tech) => (
                        <div 
                            key={tech.name}
                            className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg border border-border hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <tech.icon size={14} className={tech.color} />
                            <span className="text-xs font-medium">{tech.name}</span>
                        </div>
                    ))}
                </div>

                {/* Status Line */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Remote
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Open to opportunities
                    </span>
                </div>

                {/* Expandable CV Preview */}
                <details className="group mb-5">
                    <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg border border-border/70 bg-secondary/20 px-3 py-2.5 transition-colors duration-300 hover:border-accent/25 [&::-webkit-details-marker]:hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 text-accent">
                            <FileText size={16} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">CV</p>
                            <p className="hidden truncate text-xs text-muted-foreground sm:block">View my resume inline · PDF</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="hidden sm:inline">View</span>
                            <ChevronDown size={15} className="transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
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
                                    href="/assets/documents/seif-ismail-cv.pdf"
                                    download="Seif-Ismail-CV.pdf"
                                    className="inline-flex items-center gap-1.5 rounded-md border border-accent/35 px-2.5 py-1.5 text-xs font-medium text-accent transition-colors duration-300 hover:bg-accent/10"
                                >
                                    <Download size={13} aria-hidden="true" />
                                    Download
                                </a>
                                <a
                                    href="/assets/documents/seif-ismail-cv.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-accent/40 hover:text-foreground"
                                >
                                    Open
                                    <ArrowUpRight size={13} aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                        <div className="bg-white p-1.5">
                            <iframe
                                src="/assets/documents/seif-ismail-cv.pdf#toolbar=0&navpanes=0&view=FitH"
                                title="Seif Ismail CV preview"
                                className="h-[70vh] max-h-[720px] min-h-[520px] w-full rounded-sm border border-black/10 bg-white"
                            />
                        </div>
                    </div>
                </details>

                {/* Social Icons - Compact */}
                <div className="flex items-center gap-2">
                    <a
                        href={LINKS.SDX_STUDIO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/30 border border-border text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300"
                        aria-label="SDX Studio"
                    >
                        <Globe size={16} />
                    </a>
                    <a
                        href={LINKS.GITHUB}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/30 border border-border text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300"
                        aria-label="GitHub"
                    >
                        <Github size={16} />
                    </a>
                    <a 
                        href={LINKS.LINKEDIN} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/30 border border-border text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={16} />
                    </a>
                    <a 
                        href={`mailto:${SITE_CONFIG.EMAIL}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/30 border border-border text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300"
                        aria-label="Email"
                    >
                        <Mail size={16} />
                    </a>
                    <a 
                        href={LINKS.CALENDLY} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/30 border border-border text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300"
                        aria-label="Calendly"
                    >
                        <Calendar size={16} />
                    </a>
                </div>
            </div>
        </section>
    )
}
