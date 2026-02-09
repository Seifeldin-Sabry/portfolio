"use client"

import {useState} from "react"
import {projects} from "@/data/projects"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Github, ExternalLink, ChevronDown} from "lucide-react"

const orderedIds = ["etoile-events", "qfacts", "portfolio", "stackbase"]
const orderedProjects = orderedIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean) as typeof projects

export default function ProjectsSection() {
    const [showAll, setShowAll] = useState(false)
    const visibleProjects = showAll ? orderedProjects : orderedProjects.slice(0, 2)

    return (
        <section id="projects" className="py-16 px-4 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Things I&apos;ve Built</h2>
                    <p className="text-muted-foreground">
                        A selection of projects I&apos;ve worked on. Some are live, others are works in progress.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleProjects.map((project, index) => (
                        <Card 
                            key={project.id} 
                            className="group border border-border bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.08)] hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardContent className="p-5">
                                {/* Header with Title and Status */}
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    {project.status && (
                                        <Badge 
                                            variant="outline" 
                                            className={`text-xs flex-shrink-0 ml-2 font-mono ${
                                                project.status === "Live" 
                                                    ? "border-accent/40 text-accent" 
                                                    : project.status === "In Production"
                                                    ? "border-primary/40 text-primary"
                                                    : "border-muted-foreground/40 text-muted-foreground"
                                            }`}
                                        >
                                            {project.status === "Live" && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse mr-1.5" />
                                            )}
                                            {project.status}
                                        </Badge>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                                    {project.description}
                                </p>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.technologies.slice(0, 5).map((tech) => (
                                        <Badge 
                                            key={tech} 
                                            variant="secondary" 
                                            className="text-xs font-mono bg-secondary/50 hover:bg-secondary transition-colors"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                    {project.technologies.length > 5 && (
                                        <Badge 
                                            variant="secondary" 
                                            className="text-xs font-mono bg-secondary/50"
                                        >
                                            +{project.technologies.length - 5}
                                        </Badge>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {project.github && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 text-xs border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                                            asChild
                                        >
                                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                                                <Github className="w-3.5 h-3.5 mr-1.5" />
                                                Code
                                            </a>
                                        </Button>
                                    )}
                                    {project.liveDemo && (
                                        <Button 
                                            size="sm" 
                                            className="h-8 text-xs bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
                                            asChild
                                        >
                                            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                                View
                                            </a>
                                        </Button>
                                    )}
                                </div>

                                {/* Hover Overlay with Features */}
                                {project.generalFeatures && project.generalFeatures.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-xs font-mono text-accent mb-2">Key features</p>
                                        <ul className="space-y-1">
                                            {project.generalFeatures.slice(0, 3).map((feature, idx) => (
                                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                                    <span className="text-accent mt-0.5">›</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Show More/Less Button */}
                <div className="flex justify-center mt-8">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-all duration-300"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Show less" : "Show more"}
                        <ChevronDown className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}/>
                    </Button>
                </div>
            </div>
        </section>
    )
}
