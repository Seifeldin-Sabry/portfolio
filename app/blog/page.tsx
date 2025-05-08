import {getSortedBlogPosts} from "@/lib/blog"
import BlogClient from "./client"
import type {Metadata} from "next"

export const metadata: Metadata = {
    title: "Blog | Seif",
    description: "Technical articles and thoughts on software development, AI, and more.",
}

export default function BlogPage() {
    const allPosts = getSortedBlogPosts()

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>

            <div className="max-w-3xl mx-auto mb-12">
                <p className="text-center text-lg">
                    Thoughts, tutorials, and insights on my software development, AI, and technology journey.
                </p>
            </div>

            <BlogClient initialPosts={allPosts} />
        </div>
    )
}
