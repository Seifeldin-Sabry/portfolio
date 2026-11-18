import type {Pillar} from "@/lib/content-types"

/**
 * Positioning copy for the site. Content that the assistant should also know
 * lives in content/*.md; this file only holds short UI labels.
 */
export const PROFILE = {
    name: "Seifeldin Sabry",
    shortName: "Seif",
    role: "Product engineer & GTM engineer",
    location: "Antwerp, Belgium",
    headline: "I build the product, the website that gets it found, and the outbound that fills the pipeline.",
    intro:
        "Software engineer at QFacts, where I own a GAMP 5 validated SaaS platform end to end, and founder of SDX Studio, a GTM engineering agency. I work in TypeScript and Python, and I use AI where it saves real hours.",
    /** Shown as a small status line in the hero. Set to null to hide it. */
    availability: null as string | null,
} as const

export const PILLARS: Record<Pillar, {label: string; title: string; blurb: string; anchor: string}> = {
    product: {
        label: "Product engineering",
        title: "I ship product end to end",
        blurb: "Features from the problem to production in TypeScript and Python: APIs, frontends, billing, infrastructure and AI that is safe to ship.",
        anchor: "product",
    },
    web: {
        label: "Websites, SEO & AEO",
        title: "I make websites that get found",
        blurb: "Migrations off Wix and site builders without losing rankings, technical SEO, and structured content that Google and AI assistants can quote.",
        anchor: "websites",
    },
    gtm: {
        label: "GTM engineering",
        title: "I build outbound that compounds",
        blurb: "Email infrastructure, LinkedIn, a content engine and good volume aimed by buyer signals. One playbook, pointed at any B2B niche.",
        anchor: "gtm",
    },
}

export const PILLAR_ORDER: Pillar[] = ["product", "web", "gtm"]

export const NAV = [
    {href: "/#work", label: "Work"},
    {href: "/#services", label: "Services"},
    {href: "/#experience", label: "Experience"},
    {href: "/blog", label: "Writing"},
    {href: "/#contact", label: "Contact"},
] as const

/** Starter questions for the assistant, grouped by who is asking. */
export const ASSISTANT_STARTERS: {audience: string; questions: string[]}[] = [
    {
        audience: "Hiring",
        questions: [
            "What has Seif built at QFacts?",
            "What has Seif built as a GTM engineer?",
            "What is his TypeScript and Python experience?",
        ],
    },
    {
        audience: "Business owner",
        questions: [
            "Can Seif make my business show up on Google and ChatGPT?",
            "Will I own my website and be able to edit it myself?",
            "How did the QFacts website migration go?",
        ],
    },
    {
        audience: "B2B team",
        questions: [
            "How does Seif's outbound playbook work?",
            "What is SDX Studio?",
            "Book a call with Seif",
        ],
    },
]
