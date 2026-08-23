import type { MetadataRoute } from "next"
import { parse } from "date-fns"
import { getSortedBlogPosts } from "@/lib/blogs"
import { BLOG_CONFIG } from "@/lib/constants"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL

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
        ...posts,
    ]
}
