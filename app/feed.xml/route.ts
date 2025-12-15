import RSS from "rss"
import { getSortedBlogPosts } from "@/lib/blogs"

export async function GET() {
    const posts = getSortedBlogPosts()

    const feed = new RSS({
        title: "Seif Ismail's Blog",
        description: "Blog posts about web development, technology, and software engineering",
        feed_url: "https://seifismail.com/feed.xml",
        site_url: "https://seifismail.com",
        image_url: "https://seifismail.com/og-image.png",
        language: "en",
        pubDate: new Date().toUTCString(),
        ttl: 60,
    })

    posts.forEach((post) => {
        feed.item({
            title: post.title,
            description: post.excerpt,
            url: `https://seifismail.com/blog/${post.slug}`,
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
