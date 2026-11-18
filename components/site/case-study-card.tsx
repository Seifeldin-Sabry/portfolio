import Link from "next/link"
import {ArrowUpRight} from "lucide-react"

import MetricGrid from "@/components/site/metric-grid"
import type {CaseStudy} from "@/lib/content-types"
import {PILLARS} from "@/lib/site"

export function FeaturedCaseStudy({study}: {study: CaseStudy}) {
    return (
        <Link href={`/work/${study.id}`} className="group block rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/30 sm:p-7">
            <p className="text-sm text-muted-foreground">
                {study.company} · {PILLARS[study.pillar].label}
            </p>
            <h3 className="mt-2 flex items-start justify-between gap-4 text-xl font-semibold sm:text-2xl">
                {study.title}
                <ArrowUpRight className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" size={20} aria-hidden/>
            </h3>
            <p className="mt-3 max-w-2xl text-muted-foreground">{study.summary}</p>
            <MetricGrid metrics={study.metrics.slice(0, 3)} className="mt-6"/>
        </Link>
    )
}

export function CaseStudyRow({study}: {study: CaseStudy}) {
    return (
        <Link href={`/work/${study.id}`} className="group flex flex-col gap-1 border-t py-5 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="w-40 shrink-0 text-sm text-muted-foreground">
                {study.company}
                <span className="block text-xs">{PILLARS[study.pillar].label}</span>
            </p>
            <div className="flex-1">
                <h3 className="font-medium group-hover:underline group-hover:decoration-muted-foreground group-hover:underline-offset-4">{study.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{study.summary}</p>
            </div>
            <ArrowUpRight className="hidden shrink-0 text-muted-foreground sm:block" size={18} aria-hidden/>
        </Link>
    )
}
