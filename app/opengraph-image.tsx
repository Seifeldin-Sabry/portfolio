import {OG_SIZE, ogCard} from "@/lib/og-card"

export const dynamic = "force-static"
export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Seif: founder of SDX Studio & software engineer"

export default function Image() {
    return ogCard({
        eyebrow: "seif-os",
        title: "Seif: founder of SDX Studio & software engineer",
        description: "Founder of SDX Studio: qualified meetings with security buyers for MSSPs. Platform owner at Qfacts. A portfolio you can use like a desktop, with an AI assistant built in.",
    })
}
