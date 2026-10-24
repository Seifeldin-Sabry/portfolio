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
  BASE_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  AUTHOR: "Seif-DX",
  TITLE: "Seif-DX Portfolio",
} as const;

// External Links
export const LINKS = {
  GITHUB: "https://github.com/Seifeldin-Sabry",
  LINKEDIN: "https://www.linkedin.com/in/seifeldin-sabry-b8a542202/",
  CALENDLY: "https://calendly.com/seif-sdxstudio/quick-chat",
  SDX_STUDIO: "https://sdxstudio.co",
  SDX_DISCOVERY: "https://calendly.com/seif-sdxstudio/discovery",
  BUY_ME_A_COFFEE: "https://buymeacoffee.com/seifdx",
} as const;

/**
 * Canonical origin for metadata/OG/sitemap. The env var wins when it's a real
 * URL; locally it can still be dotenvx-encrypted ("encrypted:…"), so fall back.
 */
const envUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
export const SITE_URL = envUrl?.startsWith("http") ? envUrl.replace(/\/$/, "") : "https://seif-dx.com";

/**
 * Calendly link tagged with where the click came from, so Calendly's
 * UTM report shows which surface of the site actually produces calls.
 */
export function bookingUrl(source: string): string {
  return `${LINKS.CALENDLY}?utm_source=portfolio&utm_medium=${encodeURIComponent(source)}`;
}

// UI system constants (single source of truth for the shell layers)
// Windows stack from WINDOW upward (z grows on every focus), so shell layers sit far above.
export const Z_INDEX = {
  WIDGETS: 1,
  WINDOW: 10,
  MENUBAR: 100_000,
  DOCK: 100_000,
  OVERLAY: 100_010,
  BOOT: 200_000,
} as const;

// Shape lock: windows/cards 12px, controls pill, inputs 8px
export const SHAPE = {
  WINDOW: "rounded-xl",
  CONTROL: "rounded-full",
  INPUT: "rounded-lg",
} as const;
