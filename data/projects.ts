export interface Project {
    id: string
    title: string
    description: string
    technologies: string[]
    github?: string
    liveDemo?: string
    challenges?: string[]
    solutions?: string[]
    features?: string[]
    results?: string[]
    status?: "In Production" | "Live" | "Coming Soon"
}

export const projects: Project[] = [
    {
        id: "etoile-events",
        title: "etoile.events",
        description:
            "The operating system for tech events—AI-native platform combining event discovery, organizer tools, and venue marketplace. Optimized for attendees to find events worth their time, not just another ticket-selling marketplace.",
        technologies: [
            "FastAPI",
            "Python",
            "Neon",
            "PostgreSQL",
            "Novu",
            "Clerk",
            "PostHog",
            "CI/CD",
            "Docker",
        ],
        liveDemo: "https://etoile.events",
        status: "Live",
        features: [
            "AI-native event discovery and curation",
            "FastAPI backend architecture with real-time processing",
            "Multi-channel notification system via Novu",
            "Calendar integration (iCal, Google Calendar)",
            "Event legitimacy verification with AI guardrails",
            "Clerk authentication with SSO support",
            "PostHog analytics for product insights",
            "Automated CI/CD pipeline with GitHub Actions",
            "Neon serverless PostgreSQL with automated backups",
        ],
        results: [
            "Central database for tech events across Europe",
            "Reduced event discovery friction for communities",
            "Operating system infrastructure for event organizers",
            "Built by organizers, for organizers (10+ events/year experience)",
        ],
    },
    {
        id: "portfolio",
        title: "Personal Portfolio & Blog",
        description:
            "Modern portfolio website showcasing projects and technical writing. Built with cutting-edge web technologies and optimized for performance.",
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "MDX",
            "Framer Motion",
            "shadcn/ui",
            "Zod",
        ],
        github: "https://github.com/Seifeldin-Sabry/portfolio",
        status: "Live",
        features: [
            "Blog system with MDX support for rich content",
            "Advanced search and filtering for blog posts",
            "Responsive design with smooth animations",
            "Type-safe data validation with Zod",
            "Coming soon: AI chat interface for interactive conversations",
            "Coming soon: Built-in markdown editor for content creation",
        ],
        results: [
            "Fast, SEO-optimized static site with perfect Lighthouse scores",
            "Comprehensive blog with technical articles and project documentation",
            "Clean, maintainable codebase following best practices",
        ],
    },
    {
        id: "stackbase",
        title: "Stackbase - Resource Sharing Platform",
        description:
            "Organization-based resource sharing and management system designed for team collaboration and efficient resource allocation. Features in-app document rendering for Google and Microsoft suites.",
        technologies: [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Drizzle ORM",
            "TanStack Query",
        ],
        status: "Coming Soon",
        features: [
            "Per-organization resource management with departmental collections",
            "In-app Google Suite document rendering (Docs, Sheets, Slides)",
            "In-app Microsoft Office rendering (Word, Excel, PowerPoint)",
            "Advanced markdown viewing and preview",
            "Fine-grained access control and permissions",
            "Admin dashboard for members and resource management",
            "Resource sharing across teams and departments",
            "Collection-based organization for different departments",
            "Real-time collaboration features",
        ],
    },
]

