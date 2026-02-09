import {getAllBlogSlugs, getBlogPostBySlug} from "@/lib/blogs"
import {MDXRemote} from 'next-mdx-remote/rsc'
import {notFound} from "next/navigation"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {ArrowLeft} from "lucide-react"
import type {Metadata} from "next"
import type {Options} from "rehype-pretty-code"
import rehypePrettyCode from "rehype-pretty-code";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";


const options: Options = {
    theme: "github-dark",
    defaultLang: 'txt',
};


interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({params}: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getBlogPostBySlug(slug)

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
    const { slug } = await params
    const post = await getBlogPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/#blog">
                    <Button variant="outline" className="mb-8 flex items-center gap-2">
                        <ArrowLeft size={16} /> Back
                    </Button>
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-500 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span key={tag} className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <time className="text-gray-500" dateTime={post.date}>{post.date}</time>
                </div>
                <article className="prose prose-invert max-w-none">
                    <MDXRemote source={post.content} options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [[rehypePrettyCode, options], rehypeMdxCodeProps],
                        },
                    }}
                    />
                </article>
            </div>
        </div>
    )
}
