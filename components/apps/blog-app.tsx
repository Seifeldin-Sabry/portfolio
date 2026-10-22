"use client"

import Link from "next/link"
import {ArrowRight} from "lucide-react"
import type {BlogPost} from "@/lib/blogs"

export default function BlogApp({posts}: {posts: BlogPost[]}) {
    return (
        <div className="h-full overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-window-border px-4 py-2.5">
                <h2 className="text-sm font-semibold">Writing</h2>
                <span className="rounded-full bg-secondary/50 px-2 py-0.5 font-mono text-xs">{posts.length}</span>
            </div>

            <div className="space-y-1 px-4 py-3">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group -mx-3 flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-300 hover:bg-secondary/20"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="flex-shrink-0 font-mono text-xs text-muted-foreground">
                                {post.date.split(" ")[0]} {post.date.split(" ")[1]}
                            </span>
                            <h3 className="truncate text-sm font-medium transition-colors duration-300 group-hover:text-accent">
                                {post.title}
                            </h3>
                        </div>
                        <ArrowRight
                            size={14}
                            className="ml-2 flex-shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                        />
                    </Link>
                ))}
                {posts.length === 0 && (
                    <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                        No posts yet. Drafts land here once published.
                    </p>
                )}
            </div>
        </div>
    )
}
