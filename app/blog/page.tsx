import type {Metadata} from "next"
import Link from "next/link"

import {getSortedBlogPosts} from "@/lib/blogs"

export const metadata: Metadata = {
    title: "Writing",
    description: "Notes on AI engineering, evals, platform work and self-hosting.",
    alternates: {canonical: "/blog"},
}

export default function BlogIndex() {
    const posts = getSortedBlogPosts()
    return (
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6">
            <h1 className="text-3xl font-semibold">Writing</h1>
            <p className="mt-3 text-muted-foreground">Notes from the work: AI engineering, evals, platform and self-hosting.</p>
            <div className="mt-10 border-b">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block border-t py-6">
                        <p className="text-sm text-muted-foreground">
                            {post.date} · {post.timeToRead}
                        </p>
                        <h2 className="mt-1 text-lg font-medium group-hover:underline group-hover:underline-offset-4">{post.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
