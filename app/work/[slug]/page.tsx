import type {Metadata} from "next"
import Link from "next/link"
import {notFound} from "next/navigation"
import {ArrowLeft, ArrowUpRight} from "lucide-react"

import AskButton from "@/components/site/ask-button"
import MetricGrid from "@/components/site/metric-grid"
import {Tag} from "@/components/site/section"
import {getCaseStudies, getCaseStudy} from "@/lib/content"
import {SITE_URL, bookingUrl} from "@/lib/constants"
import {PILLARS} from "@/lib/site"

type Params = Promise<{slug: string}>

export function generateStaticParams() {
    return getCaseStudies().map((s) => ({slug: s.id}))
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
    const {slug} = await params
    const study = getCaseStudy(slug)
    if (!study) return {}
    return {
        title: study.title,
        description: study.summary,
        alternates: {canonical: `/work/${study.id}`},
        openGraph: {title: study.title, description: study.summary, url: `/work/${study.id}`, type: "article"},
        twitter: {card: "summary_large_image", title: study.title, description: study.summary},
    }
}

export default async function CaseStudyPage({params}: {params: Params}) {
    const {slug} = await params
    const study = getCaseStudy(slug)
    if (!study) notFound()

    const others = getCaseStudies().filter((s) => s.id !== study.id && s.pillar === study.pillar).slice(0, 2)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: study.title,
        description: study.summary,
        author: {"@id": `${SITE_URL}/#person`},
        url: `${SITE_URL}/work/${study.id}`,
    }

    return (
        <article className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
            <Link href="/#work" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={14} aria-hidden/> All work
            </Link>
            <p className="mt-8 text-sm text-muted-foreground">
                {study.company} · {PILLARS[study.pillar].label}
                {study.period && <> · {study.period}</>}
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{study.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{study.summary}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
                {study.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                ))}
            </div>

            {study.metrics.length > 0 && <MetricGrid metrics={study.metrics} showSource className="mt-10"/>}

            <div className="mt-12 space-y-10">
                <section>
                    <h2 className="text-lg font-semibold">The problem</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{study.problem}</p>
                </section>
                <section>
                    <h2 className="text-lg font-semibold">What I did</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground marker:text-border">
                        {study.approach.map((a) => (
                            <li key={a}>{a}</li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg font-semibold">What changed</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground marker:text-border">
                        {study.outcome.map((o) => (
                            <li key={o}>{o}</li>
                        ))}
                    </ul>
                </section>
            </div>

            <div className="mt-12 flex flex-wrap gap-3 rounded-2xl border bg-card p-5">
                <p className="w-full font-medium">Want something like this?</p>
                <a href={bookingUrl(`case-${study.id}`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">
                    Book a call
                </a>
                <AskButton question={`Tell me more about "${study.title}". What was the hardest part?`} className="rounded-full border px-4 py-2 text-sm hover:bg-secondary">
                    Ask my AI about this project
                </AskButton>
                {study.link && (
                    <a href={study.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                        Visit {new URL(study.link).hostname} <ArrowUpRight size={14} aria-hidden/>
                    </a>
                )}
            </div>

            {others.length > 0 && (
                <nav className="mt-12" aria-label="Related work">
                    <p className="text-sm text-muted-foreground">More in {PILLARS[study.pillar].label}</p>
                    <ul className="mt-3 space-y-2">
                        {others.map((o) => (
                            <li key={o.id}>
                                <Link href={`/work/${o.id}`} className="font-medium hover:underline hover:underline-offset-4">
                                    {o.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </article>
    )
}
