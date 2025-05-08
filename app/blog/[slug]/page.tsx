import {getAllBlogSlugs, getBlogPostBySlug} from "@/lib/blog"
import {notFound} from "next/navigation"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {ArrowLeft} from "lucide-react"
import {formatDate} from "@/lib/utils"
import {BlogContent} from "@/components/blog-content"
import type {Metadata} from "next"
import "../blog.css"

interface BlogPostPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({params}: BlogPostPageProps): Promise<Metadata> {
    const post = await getBlogPostBySlug(params.slug)

    if (!post) {
        return {
            title: "Blog Post Not Found",
        }
    }

    return {
        title: `${post.title} | Seif's Blog`,
        description: post.excerpt,
    }
}

export async function generateStaticParams() {
    const paths = getAllBlogSlugs()
    return paths
}

export default async function BlogPostPage({params}: BlogPostPageProps) {
    const post = await getBlogPostBySlug(params.slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/blog">
                    <Button variant="outline" className="mb-8 flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Blog
                    </Button>
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-500 mb-6">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span key={tag} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <article>
                    <BlogContent content={post.content} />
                </article>
            </div>
        </div>
    )
}
