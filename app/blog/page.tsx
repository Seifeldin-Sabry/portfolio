import {getSortedBlogPosts} from "@/lib/blogs"
import BlogClient from "./client"
import type {Metadata} from "next"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Rss} from "lucide-react"

export const metadata: Metadata = {
    title: "Blog | Seif",
    description: "Technical articles and thoughts on software development, AI, and more.",
}

export default function BlogPage() {
    const allPosts = getSortedBlogPosts()

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center gap-3 mb-8">
                <h1 className="text-4xl font-bold">Blog</h1>
                <Button variant="outline" size="icon" asChild>
                    <Link
                        href="/feed.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Subscribe to RSS feed"
                    >
                        <Rss size={20} />
                    </Link>
                </Button>
            </div>

            <div className="max-w-3xl mx-auto mb-12">
                <p className="text-center text-lg">
                    Thoughts, tutorials, and insights on software development, AI, and technology.
                </p>
            </div>

            <BlogClient initialPosts={allPosts} />
        </div>
    )
}
