"use client"

import {useState} from "react"
import {homelabServices, categoryColors} from "@/data/homelab"
import {Badge} from "@/components/ui/badge"
import {ChevronDown} from "lucide-react"

export default function HomelabSection() {
    const [isOpen, setIsOpen] = useState(false)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
        <section id="homelab" className="py-6 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Section Header — clickable to collapse/expand */}
                <button
                    onClick={() => {
                        setIsOpen(!isOpen)
                        if (isOpen) setExpandedId(null)
                    }}
                    className="w-full flex items-center justify-between mb-4 hover:text-accent transition-colors duration-300"
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Homelab</h2>
                        <span className="text-xs font-mono bg-secondary/50 px-2 py-0.5 rounded-full">{homelabServices.length}</span>
                    </div>
                    <ChevronDown
                        size={18}
                        className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                <p className={`text-xs text-muted-foreground ${isOpen ? 'mb-4' : ''} -mt-3`}>
                    Proxmox VE cluster with Docker stacks behind Caddy + CrowdSec WAF
                </p>

                {isOpen && (
                    <>
                        {/* Services Grid */}
                        <div className="grid grid-cols-2 gap-3 animate-fade-in">
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
                                        className={`cursor-pointer bg-secondary/20 border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                                            isExpanded ? 'col-span-2 bg-secondary/30' : ''
                                        }`}
                                    >
                                        {/* Compact View */}
                                        <div className="p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-sm flex-shrink-0">{service.icon}</span>
                                                    <h3 className="text-sm font-medium truncate">{service.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                                    <span className={`text-xs px-1.5 py-0.5 rounded border ${categoryColors[service.category]}`}>
                                                        {service.category}
                                                    </span>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </div>

                                            {!isExpanded && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {service.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Expanded View */}
                                        {isExpanded && (
                                            <div className="px-3 pb-3 border-t border-border/50 animate-fade-in">
                                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                                    {service.description}
                                                </p>

                                                {/* Tech Stack */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {service.technologies.map((tech) => (
                                                        <Badge key={tech} variant="secondary" className="text-xs font-mono">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Features */}
                                                <div>
                                                    <p className="text-xs font-mono text-accent mb-1">Features</p>
                                                    <ul className="space-y-0.5">
                                                        {service.features.map((feature, idx) => (
                                                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
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

                        {/* Uptime Kuma Status Embed */}
                        {expandedId === "uptime-kuma" && (
                            <div className="mt-4 rounded-lg border border-border overflow-hidden animate-fade-in">
                                <div className="px-3 py-2 bg-secondary/30 border-b border-border/50">
                                    <p className="text-xs font-mono text-muted-foreground">Live Status — Uptime Kuma</p>
                                </div>
                                <iframe
                                    src="https://status.homelab.seif-dx.com/status/homelab"
                                    title="Homelab Uptime Status"
                                    className="w-full h-[300px] bg-background"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}
