"use client"

import {useState} from "react"
import {projects} from "@/data/projects"
import {Badge} from "@/components/ui/badge"
import {Github, ExternalLink, ChevronLeft, ChevronRight} from "lucide-react"
import {motion, AnimatePresence} from "framer-motion"

const orderedIds = ["arkive", "qfacts", "portfolio"]
const orderedProjects = orderedIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean) as typeof projects

const PROJECTS_PER_PAGE = 2
const pages: (typeof projects)[] = []
for (let i = 0; i < orderedProjects.length; i += PROJECTS_PER_PAGE) {
    pages.push(orderedProjects.slice(i, i + PROJECTS_PER_PAGE))
}

export default function ProjectsSection() {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [direction, setDirection] = useState(0)

    const goToPage = (page: number) => {
        if (page < 0 || page >= pages.length) return
        setDirection(page > currentPage ? 1 : -1)
        setExpandedId(null)
        setCurrentPage(page)
    }

    const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
        const swipeThreshold = 50
        const velocityThreshold = 500
        if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
            goToPage(currentPage + 1)
        } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
            goToPage(currentPage - 1)
        }
    }

    const currentProjects = pages[currentPage]

    return (
        <section id="projects" className="py-6 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Projects</h2>
                        <span className="text-xs font-mono bg-secondary/50 px-2 py-0.5 rounded-full">{orderedProjects.length}</span>
                    </div>

                    {/* Navigation Arrows */}
                    {pages.length > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Previous projects"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            {/* Dot Indicators */}
                            <div className="flex items-center gap-1 mx-1">
                                {pages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => goToPage(idx)}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                            idx === currentPage ? "bg-accent w-3" : "bg-muted-foreground/40"
                                        }`}
                                        aria-label={`Page ${idx + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === pages.length - 1}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Next projects"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Projects Grid with Swipe */}
                <div className="overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={currentPage}
                            initial={{x: direction > 0 ? 200 : -200, opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            exit={{x: direction > 0 ? -200 : 200, opacity: 0}}
                            transition={{duration: 0.25, ease: "easeInOut"}}
                            drag="x"
                            dragConstraints={{left: 0, right: 0}}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            className={`grid gap-3 ${currentProjects.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-2"}`}
                        >
                            {currentProjects.map((project) => {
                                const isExpanded = expandedId === project.id

                                return (
                                    <div
                                        key={project.id}
                                        onClick={() => setExpandedId(isExpanded ? null : project.id)}
                                        className={`cursor-pointer bg-secondary/20 border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/30 ${
                                            isExpanded ? 'col-span-full bg-secondary/30' : ''
                                        }`}
                                    >
                                        {/* Compact View */}
                                        <div className="p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-sm font-medium truncate">{project.title}</h3>
                                                {project.status && (
                                                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            project.status === "Live" ? "bg-accent animate-pulse" : "bg-muted-foreground"
                                                        }`} />
                                                        <span className="text-xs text-muted-foreground">{project.status}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {!isExpanded && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Expanded View */}
                                        {isExpanded && (
                                            <div className="px-3 pb-3 border-t border-border/50 animate-fade-in">
                                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                                    {project.description}
                                                </p>

                                                {/* Tech Stack */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {project.technologies.map((tech) => (
                                                        <Badge key={tech} variant="secondary" className="text-xs font-mono">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Key Features */}
                                                {project.generalFeatures && (
                                                    <div className="mb-3">
                                                        <p className="text-xs font-mono text-accent mb-1">Features</p>
                                                        <ul className="space-y-0.5">
                                                            {project.generalFeatures.slice(0, 3).map((feature, idx) => (
                                                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                                                    <span className="text-accent">›</span>
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Links */}
                                                <div className="flex gap-2">
                                                    {project.github && (
                                                        <a
                                                            href={project.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
                                                        >
                                                            <Github size={12} />
                                                            Code
                                                        </a>
                                                    )}
                                                    {project.liveDemo && (
                                                        <a
                                                            href={project.liveDemo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
                                                        >
                                                            <ExternalLink size={12} />
                                                            Live
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
