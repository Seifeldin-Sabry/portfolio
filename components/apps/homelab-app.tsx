"use client"

import {useState} from "react"
import {ChevronDown} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {categoryColors, type HomelabService} from "@/lib/content-types"

export default function HomelabApp({homelabServices}: {homelabServices: HomelabService[]}) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
        <div className="h-full overflow-y-auto">
            <div className="border-b border-window-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">Homelab</h2>
                    <span className="rounded-full bg-secondary/50 px-2 py-0.5 font-mono text-xs">{homelabServices.length}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Proxmox VE cluster with Docker stacks behind Caddy + CrowdSec WAF
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2">
                {homelabServices.map((service) => {
                    const isExpanded = expandedId === service.id
                    return (
                        <div
                            key={service.id}
                            role="button"
                            tabIndex={0}
                            aria-expanded={isExpanded}
                            onClick={() => setExpandedId(isExpanded ? null : service.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    setExpandedId(isExpanded ? null : service.id)
                                }
                            }}
                            className={`cursor-pointer overflow-hidden rounded-lg border border-border bg-secondary/20 transition-all duration-300 hover:border-accent/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                                isExpanded ? "sm:col-span-2 bg-secondary/30" : ""
                            }`}
                        >
                            <div className="p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="flex-shrink-0 text-sm">{service.icon}</span>
                                        <h3 className="truncate text-sm font-medium">{service.title}</h3>
                                    </div>
                                    <div className="flex flex-shrink-0 items-center gap-1.5">
                                        <span className={`rounded border px-1.5 py-0.5 text-xs ${categoryColors[service.category]}`}>
                                            {service.category}
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </div>
                                {!isExpanded && (
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{service.description}</p>
                                )}
                            </div>

                            {isExpanded && (
                                <div className="animate-fade-in border-t border-border/50 px-3 pb-3">
                                    <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground">{service.description}</p>
                                    <div className="mb-3 flex flex-wrap gap-1">
                                        {service.technologies.map((tech) => (
                                            <Badge key={tech} variant="secondary" className="font-mono text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="mb-1 font-mono text-xs text-accent">Features</p>
                                        <ul className="space-y-0.5">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                                    <span className="text-accent">›</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
