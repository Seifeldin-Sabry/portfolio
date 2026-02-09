"use client"

import {useState} from "react"
import Image from "next/image"
import {experiences} from "@/data/experiences"
import {education} from "@/data/education"
import {Badge} from "@/components/ui/badge"
import {ChevronDown} from "lucide-react"

export default function ExperienceSection() {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <section id="experience" className="py-6 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Accordion Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between mb-4 hover:text-accent transition-colors duration-300"
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Where I&apos;ve Worked</h2>
                        <span className="text-xs font-mono bg-secondary/50 px-2 py-0.5 rounded-full">{experiences.length}</span>
                    </div>
                    <ChevronDown 
                        size={18} 
                        className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                    <div className="space-y-3 animate-fade-in">
                        {/* Experience */}
                        {experiences.map((exp) => (
                            <div key={exp.id} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg border border-border hover:border-accent/30 transition-all duration-300">
                                {exp.companyLogo && (
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                                        <Image
                                            src={exp.companyLogo}
                                            alt={exp.company}
                                            fill
                                            className="object-contain p-1.5"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-sm font-medium">{exp.role}</h3>
                                            <p className="text-xs text-muted-foreground">{exp.company}</p>
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground flex-shrink-0">{exp.period}</span>
                                    </div>
                                    {exp.technologies && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {exp.technologies.slice(0, 3).map((tech) => (
                                                <Badge key={tech} variant="secondary" className="text-xs font-mono">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Education */}
                        <div className="pt-2">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Education</h3>
                            {education.map((edu) => (
                                <div key={edu.id} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg border border-border">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                                        <Image
                                            src={edu.logo}
                                            alt={edu.school}
                                            fill
                                            className="object-contain p-1.5"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-sm font-medium">{edu.degree}</h3>
                                                <p className="text-xs text-muted-foreground">{edu.school}</p>
                                            </div>
                                            <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                                                {edu.start}-{edu.end}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
