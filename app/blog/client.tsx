"use client"

import {useState} from "react"
import Link from "next/link"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {BlogSearch} from "@/components/blog-search"
import {AnimatedCard} from "@/components/animated-card"
import type {BlogPost} from "@/lib/blogs"

interface BlogClientProps {
    initialPosts: BlogPost[]
}

const POSTS_PER_PAGE = 6

export default function BlogClient({initialPosts}: BlogClientProps) {
    const [searchResults, setSearchResults] = useState<BlogPost[]>(initialPosts)
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(searchResults.length / POSTS_PER_PAGE)
    const paginatedPosts = searchResults.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

    const handleSearch = (query: string) => {
        if (!query) {
            setSearchResults(initialPosts)
        } else {
            const lowerCaseQuery = query.toLowerCase()
            const filtered = initialPosts.filter((post) => {
                const titleMatch = post.title.toLowerCase().includes(lowerCaseQuery)
                const contentMatch = post.content.toLowerCase().includes(lowerCaseQuery)
                const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
                const excerptMatch = post.excerpt.toLowerCase().includes(lowerCaseQuery)

                return titleMatch || contentMatch || tagsMatch || excerptMatch
            })
            setSearchResults(filtered)
        }
        setCurrentPage(1)
    }

    return (
        <>
            <BlogSearch onSearch={handleSearch} />

            {searchResults.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No matching blog posts found</h3>
                    <p className="text-white">Try a different search term</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 max-w-4xl mx-auto">
                        {paginatedPosts.map((post) => (
                            <AnimatedCard>
                                <Link href={`/blog/${post.slug}`}>
                                    <Card
                                        className="hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-800 hover:border-gray-600"
                                    >
                                        <CardContent className="p-6">
                                            <div className="text-sm text-gray-500 mb-2"
                                            >{post.date} - {post.timeToRead}</div>
                                            <h2 className="text-xl font-bold mb-2 transition-colors duration-300 hover:text-primary">
                                                {post.title}
                                            </h2>
                                            <p className="text-white mb-4">{post.excerpt}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map((tag) => (
                                                    <span key={tag}
                                                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                                                    >
                            {tag}
                          </span>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </AnimatedCard>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>

                                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    )
}
