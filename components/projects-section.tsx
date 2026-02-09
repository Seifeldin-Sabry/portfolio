"use client"

import {useState} from "react"
import {projects} from "@/data/projects"
import {Badge} from "@/components/ui/badge"
import {Github, ExternalLink, ChevronDown} from "lucide-react"

const orderedIds = ["etoile-events", "qfacts", "portfolio", "stackbase"]
const orderedProjects = orderedIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean) as typeof projects

export default function ProjectsSection() {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
        <section id="projects" className="py-6 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold">Projects</h2>
                    <span className="text-xs font-mono bg-secondary/50 px-2 py-0.5 rounded-full">{orderedProjects.length}</span>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {orderedProjects.map((project) => {
                        const isExpanded = expandedId === project.id
                        
                        return (
                            <div 
                                key={project.id}
                                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                                className={`cursor-pointer bg-secondary/20 border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/30 ${
                                    isExpanded ? 'col-span-2 bg-secondary/30' : ''
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
                </div>
            </div>
        </section>
    )
}
