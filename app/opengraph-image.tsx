import {OG_SIZE, ogCard} from "@/lib/og-card"

export const dynamic = "force-static"
export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Seifeldin Sabry: product engineer and GTM engineer"

export default function Image() {
    return ogCard({
        eyebrow: "Product & GTM engineer",
        title: "I build the product, the website and the pipeline.",
        description: "TypeScript and Python product work, website migrations with SEO and AEO, and AI-driven outbound. Software engineer at QFacts, founder of SDX Studio.",
    })
}
