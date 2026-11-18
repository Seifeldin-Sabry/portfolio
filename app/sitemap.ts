import type { MetadataRoute } from "next"
import { parse } from "date-fns"
import { getSortedBlogPosts } from "@/lib/blogs"
import { BLOG_CONFIG, SITE_URL } from "@/lib/constants"
import { getCaseStudies } from "@/lib/content"

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
        ...getCaseStudies().map((study) => ({
            url: `${baseUrl}/work/${study.id}`,
            changeFrequency: "monthly" as const,
            priority: study.featured ? 0.8 : 0.6,
        })),
        { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.6 },
        { url: `${baseUrl}/ask`, changeFrequency: "monthly" as const, priority: 0.5 },
        ...posts,
    ]
}
