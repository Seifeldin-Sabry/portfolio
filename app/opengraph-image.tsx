import {OG_SIZE, ogCard} from "@/lib/og-card"

export const dynamic = "force-static"
export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Seif: software engineer & founder"

export default function Image() {
    return ogCard({
        eyebrow: "seif-os",
        title: "Seif: software engineer & founder",
        description: "Platform owner at Qfacts. Founder of SDX Studio. A portfolio you can use like a desktop, with an AI assistant built in.",
    })
}
