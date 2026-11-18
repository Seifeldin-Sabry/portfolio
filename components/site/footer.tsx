import Link from "next/link"

import {LINKS, SITE_CONFIG} from "@/lib/constants"
import {PROFILE} from "@/lib/site"

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p>
                    {PROFILE.name} · {PROFILE.location}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                    <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="hover:text-foreground">Email</a>
                    <a href={LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
                    <a href={LINKS.GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
                    <a href="/assets/documents/seifeldin-sabry-cv.pdf" className="hover:text-foreground">CV</a>
                    <Link href="/feed.xml" className="hover:text-foreground">RSS</Link>
                </div>
            </div>
        </footer>
    )
}
