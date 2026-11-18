---
id: "qfacts-website"
title: "From Wix to a site that search engines and AI assistants can read"
company: "QFacts"
pillar: "web"
featured: true
period: "March 2026 – present"
summary: "Moved qfacts.be off Wix to Next.js with a CMS the marketing team runs, fixed the SEO foundations, and opened the site to AI assistants."
link: "https://qfacts.be"
stack: ["Next.js", "Strapi", "Cloud Run", "Pulumi", "PostHog", "Ahrefs", "Search Console"]
---
# From Wix to a site that search engines and AI assistants can read

## Problem

QFacts sells an eQMS to pharma and biotech SMEs, and its website lived on Wix. To grow inbound, the company needed multi-language landing pages, comparison pages and a blog that marketing could publish without engineers, plus tracking of which visits turned into trials. The search audit after the move also found what the old site had left behind: old URLs that had ranked (one on position 1.9) returning 404, and the same site answering on www, qfacts.io and qfacts.eu.

## What I did

- Proposed the migration myself and built the new site in Next.js on Cloud Run, with the infrastructure written as Pulumi code.
- Added a self-hosted Strapi CMS, so the marketing team writes and schedules articles without engineers.
- Redirected every legacy URL with a 301 and consolidated www, qfacts.io and qfacts.eu onto one host, so rankings carry over.
- Built the technical SEO base: per-language canonicals and hreflang in five languages, sitemap, real 404s, and Organization, SoftwareApplication, Breadcrumb and BlogPosting structured data.
- Opened the site to AI search (AEO): an llms.txt and a robots.txt that names 17 search and AI crawlers, from Googlebot to GPTBot, ClaudeBot and PerplexityBot.
- Wired PostHog for traffic, sign-up clicks and newsletter sign-ups, and Ahrefs plus Search Console for rankings, then built a 12-week SEO plan on keyword and competitor data.
- Shipped the content engine: industry pages, competitor comparison pages, free templates and search-targeted articles.

## Outcome

- Marketing publishes on its own; engineers are out of the loop for content.
- Search traffic is growing: visitors arriving from search engines went from 20 in October to 68 in the first 18 days of November 2026.
- AI assistants have started sending visitors (ChatGPT in September, Gemini in November), and the site is now built to be cited by them.

## Numbers

- 133 | pages in the sitemap | live sitemap, 18 Nov 2026
- 5 | languages with hreflang | live site
- 3.4× | search visitors, October vs 1–18 November | PostHog
- 17 | search and AI crawlers named in robots.txt | live site
- 12 | blog articles live, written in the CMS | live sitemap
- 89 | Lighthouse mobile score, home page | lab test, Oct 2026
