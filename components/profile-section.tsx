import Image from "next/image"
import {Github, Linkedin, Mail, Calendar, Zap, Route, Atom, Wind, Database, Shield} from "lucide-react"
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
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border">
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
                            <h1 className="text-xl font-bold">Seif Ismail</h1>
                            <span className="text-xs font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">Live</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Currently building <span className="text-foreground font-medium">Qfacts</span> & <span className="text-foreground font-medium">Etoile</span>
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

                {/* Social Icons - Compact */}
                <div className="flex items-center gap-2">
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
