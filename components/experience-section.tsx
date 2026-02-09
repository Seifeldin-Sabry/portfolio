import Image from "next/image"
import {experiences} from "@/data/experiences"
import {education} from "@/data/education"
import {Badge} from "@/components/ui/badge"

export default function ExperienceSection() {
    return (
        <section id="experience" className="py-16 px-4 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Where I&apos;ve Worked</h2>
                    <p className="text-muted-foreground">
                        My journey through different roles and the lessons learned along the way.
                    </p>
                </div>

                {/* Experience Timeline */}
                <div className="space-y-0">
                    {experiences.map((exp, index) => (
                        <div 
                            key={exp.id} 
                            className="group relative"
                        >
                            {/* Timeline connector */}
                            {index < experiences.length - 1 && (
                                <div className="absolute left-7 top-14 bottom-0 w-px bg-border group-hover:bg-accent/30 transition-colors duration-300" />
                            )}
                            
                            <div className="flex gap-4 py-6 hover:bg-accent/5 rounded-lg transition-colors duration-300 -mx-2 px-2">
                                {exp.companyLogo && (
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary/50 flex-shrink-0 border border-border group-hover:border-accent/30 transition-all duration-300">
                                        <Image
                                            src={exp.companyLogo}
                                            alt={exp.company}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                                        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">
                                            {exp.role}
                                        </h3>
                                        <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                                            {exp.period}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground font-medium mb-2">{exp.company}</p>
                                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                        {exp.description}
                                    </p>
                                    {exp.technologies && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {exp.technologies.map((tech) => (
                                                <Badge 
                                                    key={tech} 
                                                    variant="secondary" 
                                                    className="text-xs font-mono bg-secondary/50"
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Education Section */}
                <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-6">Education</h3>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div 
                                key={edu.id} 
                                className="group flex gap-4 py-4 hover:bg-accent/5 rounded-lg transition-colors duration-300 -mx-2 px-2"
                            >
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary/50 flex-shrink-0 border border-border group-hover:border-accent/30 transition-all duration-300">
                                    <Image
                                        src={edu.logo}
                                        alt={edu.school}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                                        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">
                                            {edu.degree}
                                        </h3>
                                        <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                                            {edu.start} - {edu.end}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground font-medium">{edu.school}</p>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        {edu.info}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
