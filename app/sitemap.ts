import type { MetadataRoute } from "next"
import { parse } from "date-fns"
import { getSortedBlogPosts } from "@/lib/blogs"
import { BLOG_CONFIG, SITE_URL } from "@/lib/constants"
import { APP_PAGES } from "@/lib/app-pages"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL

    const posts = getSortedBlogPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: parse(
            `${post.date} ${post.time ?? BLOG_CONFIG.DEFAULT_TIME}`,
            BLOG_CONFIG.DATE_TIME_FORMAT,
            new Date()
        ),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }))

    return [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 1,
        },
        ...Object.keys(APP_PAGES).map((app) => ({
            url: `${baseUrl}/apps/${app}`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        ...posts,
    ]
}
