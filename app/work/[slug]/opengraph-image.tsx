import {OG_SIZE, ogCard} from "@/lib/og-card"
import {getCaseStudies, getCaseStudy} from "@/lib/content"
import {PILLARS} from "@/lib/site"

export const dynamic = "force-static"
export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Case study by Seifeldin Sabry"

export function generateStaticParams() {
    return getCaseStudies().map((s) => ({slug: s.id}))
}

export default async function Image({params}: {params: Promise<{slug: string}>}) {
    const {slug} = await params
    const study = getCaseStudy(slug)
    return ogCard({
        eyebrow: study ? `${study.company} · ${PILLARS[study.pillar].label}` : "Case study",
        title: study?.title ?? "Case study",
        description: study?.summary ?? "",
    })
}
