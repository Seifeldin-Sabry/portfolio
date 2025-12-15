import { parse, format as formatDate } from "date-fns";
import { BLOG_CONFIG } from "./constants";

/**
 * Parses a blog post date and time into a Date object
 * @param date - Date string in format "dd-MM-yyyy" or "do LLL yyyy"
 * @param time - Optional time string in format "HH:mm"
 * @returns Date object
 */
export function parseBlogDate(date: string, time?: string): Date {
  const timeValue = time || BLOG_CONFIG.DEFAULT_TIME;
  const dateTimeString = `${date} ${timeValue}`;

  try {
    // Try parsing with the display format first (for already formatted dates)
    return parse(dateTimeString, BLOG_CONFIG.DATE_TIME_FORMAT, new Date());
  } catch (error) {
    console.error(`Failed to parse date: ${dateTimeString}`, error);
    return new Date();
  }
}

/**
 * Formats a date string from frontmatter format to display format
 * @param dateString - Date string in format "dd-MM-yyyy" from frontmatter
 * @returns Formatted date string in "do LLL yyyy" format
 */
export function formatBlogDate(dateString: string): string {
  try {
    // Parse from frontmatter format (dd-MM-yyyy)
    const date = parse(dateString, "dd-MM-yyyy", new Date());
    // Format to display format (do LLL yyyy)
    return formatDate(date, BLOG_CONFIG.DATE_FORMAT);
  } catch (error) {
    console.error(`Failed to format date: ${dateString}`, error);
    return dateString; // Return original if parsing fails
  }
}

/**
 * Formats a Date object to full date-time format
 * @param date - Date object
 * @returns Formatted date-time string
 */
export function formatBlogDateTime(date: Date): string {
  return formatDate(date, BLOG_CONFIG.DATE_TIME_FORMAT);
}
