import { z } from "zod";

/**
 * Schema for validating blog post frontmatter
 */
export const BlogFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().regex(/^\d{1,2}-\d{1,2}-\d{4}$/, "Date must be in format dd-MM-yyyy or d-M-yyyy"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in format HH:mm")
    .optional(),
  excerpt: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]).transform((val) => {
    // Handle both string and array formats
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }),
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

/**
 * Validates and parses blog frontmatter
 * @param data - Raw frontmatter data
 * @returns Validated frontmatter or throws error
 */
export function validateBlogFrontmatter(data: unknown): BlogFrontmatter {
  return BlogFrontmatterSchema.parse(data);
}

/**
 * Safely validates blog frontmatter, returning default values on error
 * @param data - Raw frontmatter data
 * @returns Validated frontmatter or default values
 */
export function safeParseBlogFrontmatter(data: unknown): BlogFrontmatter {
  const result = BlogFrontmatterSchema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  console.error("Frontmatter validation failed:", result.error.flatten());

  // Return safe defaults
  return {
    title: "Untitled",
    date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    tags: [],
  };
}
