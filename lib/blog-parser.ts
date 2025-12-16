import matter from "gray-matter";
import readingTime from "reading-time";
import { safeParseBlogFrontmatter } from "./blog-schema";
import { formatBlogDate } from "./date-utils";
import { BLOG_CONFIG } from "./constants";
import type { BlogPost } from "./blogs";

/**
 * Extracts and validates blog metadata from MDX frontmatter
 * @param slug - The blog post slug
 * @param fileContents - Raw MDX file contents
 * @returns Parsed and validated blog post object
 */
export function extractBlogMetadata(
  slug: string,
  fileContents: string
): BlogPost {
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Validate frontmatter with Zod schema
  const frontmatter = safeParseBlogFrontmatter(matterResult.data);

  // Format date using centralized utility
  const formattedDate = formatBlogDate(frontmatter.date);

  // Calculate reading time automatically (150 WPM for technical content)
  const stats = readingTime(matterResult.content, {
    wordsPerMinute: BLOG_CONFIG.READING_SPEED_WPM,
  });
  const autoTimeToRead = `${Math.ceil(stats.minutes)} min read`;

  // Use manual timeToRead from frontmatter if provided, otherwise use calculated
  const timeToRead =
    (matterResult.data.timeToRead as string | undefined) || autoTimeToRead;

  // Return standardized blog post object
  return {
    slug,
    title: frontmatter.title,
    date: formattedDate,
    time: frontmatter.time || BLOG_CONFIG.DEFAULT_TIME,
    timeToRead,
    excerpt: frontmatter.excerpt || "",
    content: matterResult.content,
    tags: frontmatter.tags,
  };
}
