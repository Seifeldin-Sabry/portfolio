"use client"

import Image from "next/image"
import {Badge} from "@/components/ui/badge"
import type {Education, Experience} from "@/lib/content-types"

export default function ExperienceApp({experiences, education}: {experiences: Experience[]; education: Education[]}) {
    return (
        <div className="h-full overflow-y-auto">
            <div className="border-b border-window-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">Where I&apos;ve Worked</h2>
                    <span className="rounded-full bg-secondary/50 px-2 py-0.5 font-mono text-xs">{experiences.length}</span>
                </div>
            </div>

            <div className="space-y-3 px-4 py-4">
                {experiences.map((exp) => (
                    <div
                        key={exp.id}
                        className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-all duration-300 hover:border-accent/30"
                    >
                        {exp.companyLogo && (
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                                <Image src={exp.companyLogo} alt={exp.company} fill className="object-contain p-1.5"/>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="text-sm font-medium">{exp.role}</h3>
                                    <p className="text-xs text-muted-foreground">{exp.company}</p>
                                </div>
                                <span className="flex-shrink-0 font-mono text-xs text-muted-foreground">{exp.period}</span>
                            </div>
                            {exp.description && (
                                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{exp.description}</p>
                            )}
                            {exp.technologies && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {exp.technologies.slice(0, 5).map((tech) => (
                                        <Badge key={tech} variant="secondary" className="font-mono text-xs">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="pt-2">
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">Education</h3>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-3 flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3">
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                                <Image src={edu.logo} alt={edu.school} fill className="object-contain p-1.5 brightness-0 invert"/>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm font-medium">{edu.degree}</h3>
                                        <p className="text-xs text-muted-foreground">{edu.school}</p>
                                    </div>
                                    <span className="flex-shrink-0 font-mono text-xs text-muted-foreground">
                                        {edu.start}-{edu.end}
                                    </span>
                                </div>
                                {edu.info && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{edu.info}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pb-2"/>
            </div>
        </div>
    )
}
