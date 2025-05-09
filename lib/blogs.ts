import fs from "fs"
import path from "path"
import matter from "gray-matter"
import {formatDate} from "date-fns";

const blogsDirectory = path.join(process.cwd(), "data/blogs")
const fileExtension = ".mdx"

export interface BlogPost {
    slug: string
    title: string
    date: string
    excerpt: string
    content: string
    tags: string[]
}

function parseBlog(fileName: string) {
    const slug = fileName.replace(/\.mdx$/, "")

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

    const date = formatDate(matterResult.data.date || new Date().toISOString(), "yyyy-dd-MM")

    // Combine the data with the slug
    return {
        slug,
        title: matterResult.data.title || "Untitled",
        date,
        excerpt: matterResult.data.excerpt || "",
        content: matterResult.content,
        tags
    }
}

export function getSortedBlogPosts(): BlogPost[] {
    // Get file names under /data/blog
    const fileNames = fs.readdirSync(blogsDirectory)
    const allBlogData = fileNames
        .filter((fileName) => fileName.endsWith(fileExtension))
        .map(parseBlog)

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
                slug: fileName.replace(/\.mdx$/, ""),
            },
        }
    })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const fullPath = path.join(blogsDirectory, `${slug}${fileExtension}`)
        const fileContents = fs.readFileSync(fullPath, "utf8")

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Ensure tags is an array
        const tags = Array.isArray(matterResult.data.tags)
            ? matterResult.data.tags
            : matterResult.data.tags
                ? [matterResult.data.tags]
                : []

        const date = formatDate(matterResult.data.date || new Date().toISOString(), "yyyy-dd-MM")

        // Combine the data with the slug and contentHtml
        return {
            slug,
            title: matterResult.data.title || "Untitled",
            date,
            excerpt: matterResult.data.excerpt || "",
            content: matterResult.content,
            tags
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
