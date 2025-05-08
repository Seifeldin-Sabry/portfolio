import fs from "fs"
import path from "path"
import matter from "gray-matter"
import {remark} from "remark"
import html from "remark-html"

const blogsDirectory = path.join(process.cwd(), "data/blog")

export interface BlogPost {
    slug: string
    title: string
    date: string
    excerpt: string
    content: string
    tags: string[]
    coverImage?: string
}

export function getSortedBlogPosts(): BlogPost[] {
    // Get file names under /data/blog
    const fileNames = fs.readdirSync(blogsDirectory)
    const allBlogData = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            // Remove ".md" from file name to get slug
            const slug = fileName.replace(/\.md$/, "")

            // Read markdown file as string
            const fullPath = path.join(blogsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, "utf8")

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents)

            // Ensure tags is an array
            const tags = Array.isArray(matterResult.data.tags)
                ? matterResult.data.tags
                : matterResult.data.tags
                    ? [matterResult.data.tags]
                    : []

            // Combine the data with the slug
            return {
                slug,
                title: matterResult.data.title || "Untitled",
                date: matterResult.data.date || new Date().toISOString(),
                excerpt: matterResult.data.excerpt || "",
                content: matterResult.content,
                tags,
                coverImage: matterResult.data.coverImage || undefined,
            }
        })

    // Sort posts by date
    return allBlogData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllBlogSlugs() {
    const fileNames = fs.readdirSync(blogsDirectory)
    return fileNames.map((fileName) => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, ""),
            },
        }
    })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const fullPath = path.join(blogsDirectory, `${slug}.md`)
        const fileContents = fs.readFileSync(fullPath, "utf8")

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Ensure tags is an array
        const tags = Array.isArray(matterResult.data.tags)
            ? matterResult.data.tags
            : matterResult.data.tags
                ? [matterResult.data.tags]
                : []

        // Use remark to convert markdown into HTML string
        const processedContent = await remark().use(html).process(matterResult.content)
        const contentHtml = processedContent.toString()

        // Combine the data with the slug and contentHtml
        return {
            slug,
            title: matterResult.data.title || "Untitled",
            date: matterResult.data.date || new Date().toISOString(),
            excerpt: matterResult.data.excerpt || "",
            content: contentHtml,
            tags,
            coverImage: matterResult.data.coverImage || undefined,
        }
    } catch (error) {
        console.error(`Error getting blog post for slug ${slug}:`, error)
        return null
    }
}

export function searchBlogPosts(query: string): BlogPost[] {
    const allPosts = getSortedBlogPosts()

    if (!query) return allPosts

    const lowerCaseQuery = query.toLowerCase()

    return allPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(lowerCaseQuery)
        const contentMatch = post.content.toLowerCase().includes(lowerCaseQuery)
        const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
        const excerptMatch = post.excerpt.toLowerCase().includes(lowerCaseQuery)

        return titleMatch || contentMatch || tagsMatch || excerptMatch
    })
}
