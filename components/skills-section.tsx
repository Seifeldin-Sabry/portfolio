"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { 
    Sparkles, 
    Wrench, 
    Code2, 
    Layers, 
    Cloud,
    Bot,
} from "lucide-react"

const skillCategories = [
    {
        id: "ai-first",
        title: "AI-First Dev",
        icon: Sparkles,
        color: "text-accent",
        bgColor: "bg-accent/10",
        borderColor: "border-accent/30",
        items: ["Opencode", "Claude Code", "Plugins", "Skills"],
        highlight: "0 hand-written lines in 2026",
        isAiFirst: true,
    },
    {
        id: "dev-tools",
        title: "Dev Tools",
        icon: Wrench,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/30",
        items: ["WebStorm", "Git", "Brew", "Ghostty", "Drizzle", "Docker"],
    },
    {
        id: "languages",
        title: "Languages",
        icon: Code2,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        borderColor: "border-yellow-400/30",
        items: ["TypeScript", "Java", "Python"],
    },
    {
        id: "frameworks",
        title: "Frameworks",
        icon: Layers,
        color: "text-cyan-400",
        bgColor: "bg-cyan-400/10",
        borderColor: "border-cyan-400/30",
        items: ["Next.js", "TanStack", "NestJS", "FastAPI"],
    },
    {
        id: "cloud",
        title: "Cloud",
        icon: Cloud,
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/30",
        items: ["Fly.io", "GCP", "AWS"],
    },
    {
        id: "ai-tools",
        title: "AI Tools",
        icon: Bot,
        color: "text-pink-400",
        bgColor: "bg-pink-400/10",
        borderColor: "border-pink-400/30",
        items: ["Claude Code", "Opencode", "AI SDK", "HuggingFace"],
    },
]

function SkillCard({ category }: { category: typeof skillCategories[0] }) {
    return (
        <div
            className={`flex-shrink-0 px-3 py-2 rounded-lg border ${category.borderColor} ${category.bgColor} backdrop-blur-sm group hover:border-opacity-60 transition-all duration-200`}
        >
            <div className="flex items-center gap-3">
                {/* Icon + Title */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <category.icon size={14} className={category.color} />
                    <span className={`text-xs font-medium ${category.color}`}>
                        {category.title}
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-3 bg-border" />

                {/* AI Highlight or Skills */}
                {category.isAiFirst ? (
                    <span className="text-[10px] font-mono text-accent bg-accent/20 px-1.5 py-0.5 rounded">
                        {category.highlight}
                    </span>
                ) : (
                    <div className="flex items-center gap-1.5">
                        {category.items.map((item) => (
                            <span 
                                key={item}
                                className="text-[10px] text-muted-foreground"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SkillsSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const firstSetRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-50px" })
    const [setWidth, setSetWidth] = useState(0)

    const measure = useCallback(() => {
        if (firstSetRef.current) {
            setSetWidth(firstSetRef.current.offsetWidth)
        }
    }, [])

    useEffect(() => {
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [measure])

    return (
        <section ref={containerRef} className="py-2 -mt-2">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header inline with marquee */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2 mb-2"
                >
                    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</h2>
                    <div className="flex-1 h-px bg-border/50" />
                </motion.div>

                {/* Marquee Container */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative overflow-hidden"
                >
                    <div
                        className="marquee-track flex w-fit hover:[animation-play-state:paused]"
                        style={{ "--marquee-distance": `-${setWidth}px` } as React.CSSProperties}
                    >
                        {/* First Set */}
                        <div ref={firstSetRef} className="flex gap-2 shrink-0 pr-2">
                            {skillCategories.map((category) => (
                                <SkillCard key={`first-${category.id}`} category={category} />
                            ))}
                        </div>

                        {/* Duplicate Set for Seamless Loop */}
                        <div className="flex gap-2 shrink-0 pr-2">
                            {skillCategories.map((category) => (
                                <SkillCard key={`second-${category.id}`} category={category} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
