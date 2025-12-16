import RSS from "rss"
import { getSortedBlogPosts } from "@/lib/blogs"

export async function GET() {
    const posts = getSortedBlogPosts()
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.seifeldinismail.com"

    const feed = new RSS({
        title: "Seif's Blog",
        description: "Blog posts about web development, technology, and software engineering",
        feed_url: `${baseUrl}/feed.xml`,
        site_url: baseUrl,
        image_url: `${baseUrl}/og-image.png`,
        language: "en",
        pubDate: new Date().toUTCString(),
        ttl: 60,
        managingEditor: "ismailseifeldin54@gmail.com (Seif Ismail)",
        webMaster: "ismailseifeldin54@gmail.com (Seif Ismail)",
        copyright: "Copyright 2025 Seif Ismail. All rights reserved.",
        categories: ["Software Development", "Web Development", "DevOps", "Self-Hosting"],
        generator: "Next.js",
    })

    posts.forEach((post) => {
        feed.item({
            title: post.title,
            description: post.excerpt,
            url: `${baseUrl}/blog/${post.slug}`,
            guid: `${baseUrl}/blog/${post.slug}`,
            date: post.date,
            categories: post.tags,
            author: "Seif Ismail",
        })
    })

    return new Response(feed.xml({ indent: true }), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    })
}
