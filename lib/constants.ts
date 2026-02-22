// Blog Configuration
export const BLOG_CONFIG = {
  DIRECTORY: "data/blogs",
  EXTENSION: ".mdx",
  DATE_FORMAT: "do LLL yyyy",
  DATE_TIME_FORMAT: "do LLL yyyy HH:mm",
  READING_SPEED_WPM: 150,
  POSTS_PER_PAGE: 3,
  MAX_VISIBLE_TAGS: 5,
  DEFAULT_TIME: "00:00",
  DEFAULT_TITLE: "Untitled",
} as const;

// Site Configuration
export const SITE_CONFIG = {
  EMAIL: "seif-dx@proton.me",
  BASE_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || "https://seif-dx.com",
  AUTHOR: "Seif-DX",
  TITLE: "Seif-DX Portfolio",
} as const;

// External Links
export const LINKS = {
  GITHUB: "https://github.com/Seifeldin-Sabry",
  LINKEDIN: "https://www.linkedin.com/in/seif-sabry-b8a542202/",
  CALENDLY: "https://calendly.com/ismailseifeldin54/45min",
} as const;
