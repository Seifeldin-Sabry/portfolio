"use client"

import {useState} from "react"
import Link from "next/link"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Rss, ArrowRight} from "lucide-react"
import type {BlogPost} from "@/lib/blogs"

const POSTS_PER_PAGE = 3

interface BlogSectionProps {
    posts: BlogPost[]
}

export default function BlogSection({posts}: BlogSectionProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const paginatedPosts = posts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE,
    )

    return (
        <section id="blog" className="py-16 px-4 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Writing</h2>
                        <p className="text-muted-foreground">
                            Thoughts on software engineering, tech, and lessons learned.
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                        asChild
                    >
                        <a href="/feed.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed">
                            <Rss size={16} className="text-accent" />
                        </a>
                    </Button>
                </div>

                {/* Blog Posts */}
                <div className="space-y-4">
                    {paginatedPosts.map((post, index) => (
                        <Link 
                            key={post.slug} 
                            href={`/blog/${post.slug}`} 
                            className="block group"
                        >
                            <Card className="border border-border bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.08)] hover:-translate-y-0.5">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Meta */}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-mono">
                                                <span>{post.date}</span>
                                                <span>·</span>
                                                <span>{post.timeToRead}</span>
                                            </div>
                                            
                                            {/* Title */}
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                                                {post.title}
                                            </h3>
                                            
                                            {/* Excerpt */}
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {post.excerpt}
                                            </p>
                                            
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {post.tags.slice(0, 4).map((tag) => (
                                                    <Badge 
                                                        key={tag} 
                                                        variant="secondary" 
                                                        className="text-xs font-mono bg-secondary/50"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Arrow */}
                                        <ArrowRight 
                                            size={18} 
                                            className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" 
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className={currentPage === page 
                                    ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                                    : "border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                                }
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}
