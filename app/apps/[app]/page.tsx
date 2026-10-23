import type {Metadata} from "next"
import {notFound} from "next/navigation"
import Desktop from "@/components/desktop/desktop"
import type {AppId} from "@/components/apps/registry"
import {APP_PAGES} from "@/lib/app-pages"
import {getDesktopContent} from "@/lib/desktop-content"

type Params = Promise<{app: string}>

const isAppId = (id: string): id is AppId => id in APP_PAGES

export function generateStaticParams() {
    return Object.keys(APP_PAGES).map((app) => ({app}))
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
    const {app} = await params
    if (!isAppId(app)) return {}
    const {title, description} = APP_PAGES[app]
    return {
        title: `${title} · Seif`,
        description,
        alternates: {canonical: `/apps/${app}`},
        openGraph: {title, description, url: `/apps/${app}`},
        twitter: {card: "summary_large_image", title, description},
    }
}

/** Same desktop as "/", with this app opened: the shareable deep link. */
export default async function AppPage({params}: {params: Params}) {
    const {app} = await params
    if (!isAppId(app)) notFound()
    return <Desktop {...getDesktopContent()} initialApp={app}/>
}
