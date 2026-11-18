import {getAllBlogSlugs, getBlogPostBySlug} from "@/lib/blogs"
import {MDXRemote} from 'next-mdx-remote/rsc'
import {notFound} from "next/navigation"
import Link from "next/link"
import {ArrowLeft} from "lucide-react"
import type {Metadata} from "next"
import type {Options} from "rehype-pretty-code"
import rehypePrettyCode from "rehype-pretty-code";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import {CodeBlock} from "@/components/mdx/code-block";


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
        title: post.title,
        description: post.excerpt,
        alternates: {canonical: `/blog/${slug}`},
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
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
            <div>
                <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={14} aria-hidden/> All writing
                </Link>
                <div className="mb-10 mt-8">
                    <p className="text-sm text-muted-foreground">
                        <time dateTime={post.date}>{post.date}</time> · {post.timeToRead}
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <article className="prose max-w-none dark:prose-invert">
                    <MDXRemote source={post.content} options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [[rehypePrettyCode, options], rehypeMdxCodeProps],
                        },
                    }}
                    components={{
                        pre: CodeBlock,
                    }}
                    />
                </article>
            </div>
        </div>
    )
}
