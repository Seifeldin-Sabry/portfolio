"use client"

import {useState} from "react"
import Image from "next/image"
import {AnimatePresence, motion} from "framer-motion"
import {ArrowLeft, ExternalLink, Github} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import type {Project} from "@/lib/content-types"

const orderedIds = ["qfacts", "portfolio"]

export default function ProjectsApp({projects}: {projects: Project[]}) {
    const orderedProjects = orderedIds.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as Project[]
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selected = orderedProjects.find((p) => p.id === selectedId) ?? null

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-window-border px-4 py-2.5">
                <h2 className="text-sm font-semibold">Projects</h2>
                <span className="rounded-full bg-secondary/50 px-2 py-0.5 font-mono text-xs">{orderedProjects.length}</span>
            </div>

            <div className="relative flex-1 overflow-y-auto">
                <AnimatePresence mode="wait" initial={false}>
                    {selected ? (
                        <motion.div
                            key="detail"
                            initial={{opacity: 0, x: 24}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 24}}
                            transition={{duration: 0.2, ease: "easeOut"}}
                            className="px-4 py-4"
                        >
                            <button
                                onClick={() => setSelectedId(null)}
                                className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
                            >
                                <ArrowLeft size={13}/>
                                All projects
                            </button>

                            <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-border">
                                <Image
                                    src={`https://picsum.photos/seed/${selected.id}-cover/800/400?grayscale`}
                                    alt={`${selected.title} cover`}
                                    fill
                                    className="object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-window-bg via-transparent to-transparent"/>
                            </div>

                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-lg font-semibold tracking-tight">{selected.title}</h3>
                                {selected.status && (
                                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                selected.status === "Live" ? "animate-pulse bg-accent" : "bg-muted-foreground"
                                            }`}
                                        />
                                        {selected.status}
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>

                            <div className="mt-3 flex flex-wrap gap-1">
                                {selected.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="font-mono text-xs">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>

                            {selected.generalFeatures && (
                                <div className="mt-4">
                                    <p className="mb-1 font-mono text-xs text-accent">Features</p>
                                    <ul className="space-y-1">
                                        {selected.generalFeatures.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                                <span className="text-accent">›</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-5 flex gap-3 pb-2">
                                {selected.github && (
                                    <a
                                        href={selected.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
                                    >
                                        <Github size={13}/>
                                        Code
                                    </a>
                                )}
                                {selected.liveDemo && (
                                    <a
                                        href={selected.liveDemo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
                                    >
                                        <ExternalLink size={13}/>
                                        Live
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.15}}
                            className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2"
                        >
                            {orderedProjects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => setSelectedId(project.id)}
                                    className="group overflow-hidden rounded-xl border border-border bg-secondary/20 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30"
                                >
                                    <div className="relative h-28 overflow-hidden">
                                        <Image
                                            src={`https://picsum.photos/seed/${project.id}-cover/640/360?grayscale`}
                                            alt={`${project.title} cover`}
                                            fill
                                            className="object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-window-bg/90 to-transparent"/>
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="truncate text-sm font-medium">{project.title}</h3>
                                            {project.status && (
                                                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            project.status === "Live" ? "animate-pulse bg-accent" : "bg-muted-foreground"
                                                        }`}
                                                    />
                                                    {project.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
