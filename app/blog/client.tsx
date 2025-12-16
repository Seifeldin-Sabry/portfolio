"use client"

import {useState, useMemo} from "react"
import Link from "next/link"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {BlogSearch} from "@/components/blog-search"
import {BlogFilters} from "@/components/blog-filters"
import {AnimatedCard} from "@/components/animated-card"
import type {BlogPost} from "@/lib/blogs"
import {parse, formatDistanceToNow} from "date-fns"
import {motion} from "framer-motion"
import {staggerContainer, fadeIn} from "@/lib/animations"
import {BLOG_CONFIG} from "@/lib/constants"
import {parseBlogDate} from "@/lib/date-utils"

interface BlogClientProps {
    initialPosts: BlogPost[]
}

const POSTS_PER_PAGE = BLOG_CONFIG.POSTS_PER_PAGE

export default function BlogClient({initialPosts}: BlogClientProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedDateRange, setSelectedDateRange] = useState<{ from: string; to: string } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    // Extract all unique tags from posts
    const availableTags = useMemo(() => {
        const tags = new Set<string>()
        initialPosts.forEach((post) => {
            post.tags.forEach((tag) => tags.add(tag))
        })
        return Array.from(tags).sort()
    }, [initialPosts])

    // Apply all filters (search + tags + date)
    const filteredPosts = useMemo(() => {
        let results = initialPosts

        // Apply search filter
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase()
            results = results.filter((post) => {
                const titleMatch = post.title.toLowerCase().includes(lowerCaseQuery)
                const contentMatch = post.content.toLowerCase().includes(lowerCaseQuery)
                const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
                const excerptMatch = post.excerpt.toLowerCase().includes(lowerCaseQuery)

                return titleMatch || contentMatch || tagsMatch || excerptMatch
            })
        }

        // Apply tag filter
        if (selectedTags.length > 0) {
            results = results.filter((post) =>
                selectedTags.some((tag) => post.tags.includes(tag))
            )
        }

        // Apply date range filter
        if (selectedDateRange) {
            results = results.filter((post) => {
                const postDate = parseBlogDate(post.date, post.time)
                const fromDate = selectedDateRange.from ? new Date(selectedDateRange.from) : null
                const toDate = selectedDateRange.to ? new Date(selectedDateRange.to) : null

                if (fromDate && toDate) {
                    return postDate >= fromDate && postDate <= toDate
                } else if (fromDate) {
                    return postDate >= fromDate
                } else if (toDate) {
                    return postDate <= toDate
                }
                return true
            })
        }

        return results
    }, [initialPosts, searchQuery, selectedTags, selectedDateRange])

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleClearFilters = () => {
        setSelectedTags([])
        setSelectedDateRange(null)
        setSearchQuery("")
        setCurrentPage(1)
    }

    return (
        <>
            <div className="flex gap-2 w-full max-w-4xl mx-auto mb-8 items-start">
                <div className="flex-1">
                    <BlogSearch onSearch={handleSearch} />
                </div>
                <BlogFilters
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                    selectedDateRange={selectedDateRange}
                    onDateRangeChange={setSelectedDateRange}
                    onClearFilters={handleClearFilters}
                />
            </div>

            {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No matching blog posts found</h3>
                    <p className="text-white">Try a different search term</p>
                </div>
            ) : (
                <>
                    <motion.div
                        variants={staggerContainer()}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-8 max-w-4xl mx-auto"
                    >
                        {paginatedPosts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                variants={fadeIn('up', index * 0.1)}
                            >
                                <AnimatedCard>
                                    <Link href={`/blog/${post.slug}`} className="block cursor-pointer">
                                        <Card
                                            className="group relative overflow-hidden border border-white/10 hover:border-white/20 bg-card transition-all duration-200 hover:shadow-lg hover:shadow-white/5"
                                        >
                                            <CardContent className="p-8">
                                                <div className="text-sm text-muted-foreground mb-3 font-medium">
                                                    {formatDistanceToNow(
                                                        parseBlogDate(post.date, post.time),
                                                        { addSuffix: true }
                                                    )}
                                                    <span className="mx-2">•</span>
                                                    {post.timeToRead}
                                                </div>
                                                <h2 className="text-xl md:text-3xl font-bold mb-4 leading-tight group-hover:text-white transition-colors">
                                                    {post.title}
                                                </h2>
                                                <p className="text-base text-foreground/90 mb-6 leading-relaxed line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {post.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="bg-white/10 text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </motion.div>

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
