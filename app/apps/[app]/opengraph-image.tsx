import {APP_PAGES} from "@/lib/app-pages"
import {OG_SIZE, ogCard} from "@/lib/og-card"
import type {AppId} from "@/components/apps/registry"

export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
    return Object.keys(APP_PAGES).map((app) => ({app}))
}

export default async function Image({params}: {params: Promise<{app: string}>}) {
    const {app} = await params
    const page = APP_PAGES[app as AppId] ?? APP_PAGES.about
    return ogCard({eyebrow: `seif-os · ${app}`, title: page.title, description: page.description})
}
