import fs from "fs";
import path from "path";
import { parse } from "date-fns";
import { extractBlogMetadata } from "./blog-parser";
import { BLOG_CONFIG } from "./constants";

const blogsDirectory = path.join(process.cwd(), BLOG_CONFIG.DIRECTORY);
const fileExtension = BLOG_CONFIG.EXTENSION;

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  time: string;
  timeToRead: string;
  excerpt: string;
  content: string;
  tags: string[];
}

/**
 * Parses a blog file and extracts metadata
 * @param fileName - Name of the MDX file
 * @returns Parsed blog post
 */
function parseBlog(fileName: string): BlogPost {
  const slug = fileName.replace(/\.mdx$/, "");
  const fullPath = path.join(blogsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  return extractBlogMetadata(slug, fileContents);
}

/**
 * Gets all blog posts sorted by date (newest first)
 * @returns Array of sorted blog posts
 */
export function getSortedBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(blogsDirectory);
  const allBlogData = fileNames
    .filter((fileName) => fileName.endsWith(fileExtension))
    .map(parseBlog);

  return allBlogData.sort((a, b) => {
    const getDateTime = (post: BlogPost) => {
      const date = post.date;
      const time = post.time ?? BLOG_CONFIG.DEFAULT_TIME;
      return parse(
        `${date} ${time}`,
        BLOG_CONFIG.DATE_TIME_FORMAT,
        new Date()
      ).getTime();
    };

    // Sort descending (newest first)
    return getDateTime(b) - getDateTime(a);
  });
}

/**
 * Gets all blog slugs for static generation
 * @returns Array of slug objects in App Router format
 */
export function getAllBlogSlugs(): { slug: string }[] {
  const fileNames = fs.readdirSync(blogsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(fileExtension))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ""),
    }));
}

/**
 * Gets a single blog post by its slug
 * @param slug - The blog post slug
 * @returns Blog post or null if not found
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}${fileExtension}`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    return extractBlogMetadata(slug, fileContents);
  } catch (error) {
    console.error(`Error getting blog post for slug ${slug}:`, error);
    return null;
  }
}
