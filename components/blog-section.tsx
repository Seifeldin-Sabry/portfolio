"use client"

import Link from "next/link"
import {ArrowRight} from "lucide-react"
import type {BlogPost} from "@/lib/blogs"

interface BlogSectionProps {
    posts: BlogPost[]
}

export default function BlogSection({posts}: BlogSectionProps) {
    return (
        <section id="blog" className="py-6 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold">Writing</h2>
                    <span className="text-xs font-mono bg-secondary/50 px-2 py-0.5 rounded-full">{posts.length}</span>
                </div>

                {/* Compact Post List */}
                <div className="space-y-1">
                    {posts.map((post) => (
                        <Link 
                            key={post.slug} 
                            href={`/blog/${post.slug}`}
                            className="group flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-secondary/20 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                                    {post.date.split(' ')[0]} {post.date.split(' ')[1]}
                                </span>
                                <h3 className="text-sm font-medium truncate group-hover:text-accent transition-colors duration-300">
                                    {post.title}
                                </h3>
                            </div>
                            <ArrowRight 
                                size={14} 
                                className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" 
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
