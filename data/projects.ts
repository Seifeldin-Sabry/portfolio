export interface Project {
    id: string
    title: string
    description: string
    technologies: string[]
    github?: string
    liveDemo?: string
    challenges?: string[]
    solutions?: string[]
    generalFeatures?: string[]
    myContributions?: string[]
    results?: string[]
    status?: "In Production" | "Live" | "Coming Soon"
}

export const projects: Project[] = [
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
        generalFeatures: [
            "Blog system with MDX support for rich content",
            "Advanced search and filtering for blog posts",
            "Responsive design with smooth animations",
            "Type-safe data validation with Zod",
        ],
        myContributions: [
            "Built from scratch with Next.js 16 and TypeScript",
            "Implemented glowing border effects and glass morphism design",
            "Created centralized blog parsing system with Zod validation",
            "Optimized for performance with perfect Lighthouse scores",
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
        generalFeatures: [
            "Per-organization resource management with departmental collections",
            "In-app Google Suite document rendering (Docs, Sheets, Slides)",
            "In-app Microsoft Office rendering (Word, Excel, PowerPoint)",
            "Advanced markdown viewing and preview",
            "Fine-grained access control and permissions",
            "Resource sharing across teams and departments",
            "Real-time collaboration features",
        ],
        myContributions: [
            "Architected full-stack application with Next.js and Drizzle ORM",
            "Implemented Google Suite and Microsoft Office in-app rendering",
            "Built admin dashboard for members and resource management",
            "Designed collection-based organization system for departments",
            "Developed fine-grained permission and access control system",
        ],
    },
    {
        id: "qfacts",
        title: "Qfacts.be",
        description:
            "Cloud-based Electronic Quality Management System (eQMS) designed for small and medium-sized pharmaceutical and biotech companies across Europe. GAMP 5 validated platform offering comprehensive quality management capabilities with affordable, transparent pricing tailored for SMEs in highly regulated industries.",
        technologies: [
            "React",
            "TypeScript",
            "Node.js",
            "Express",
            "Google Cloud Platform",
            "GAMP 5 Validation",
            "Rich Text Editors",
        ],
        liveDemo: "https://qfacts.be",
        status: "Live",
        generalFeatures: [
            "Cloud-based eQMS for pharmaceutical & biotech SMEs",
            "Document management with version control and approval workflows",
            "Quality event and complaint reporting system",
            "Investigation management and CAPA (Corrective and Preventive Actions)",
            "Change control management for regulatory compliance",
            "Training management and completion tracking",
            "Role-based access control (Admin, Action Owners, QA Users, Operators)",
            "GAMP 5 validated for global regulatory compliance",
        ],
        myContributions: [
            "Internal onboarding system for streamlined employee integration",
            "Rich text editing capabilities for document creation",
            "Modern UI/UX refresh for improved platform usability",
            "Advanced document export functionality",
            "Coming soon: AI-powered workflow optimizations",
        ],
        results: [
            "Accessible quality management for European pharmaceutical SMEs",
            "Regulatory-compliant platform built on modern technology stack",
            "Streamlined quality processes without compromising compliance",
        ],
    },
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
        generalFeatures: [
            "AI-native event discovery and curation",
            "Event legitimacy verification with AI guardrails",
            "Calendar integration (iCal, Google Calendar)",
            "Multi-channel notification system",
            "Clerk authentication with SSO support",
            "PostHog analytics for product insights",
        ],
        myContributions: [
            "Architected and built FastAPI backend with real-time processing",
            "Set up Neon serverless PostgreSQL with automated backups",
            "Integrated multi-channel notification system via Novu",
            "Implemented Clerk authentication with SSO support",
            "Configured PostHog analytics for product insights",
            "Established automated CI/CD pipeline with GitHub Actions and Docker",
        ],
        results: [
            "Central database for tech events across Europe",
            "Reduced event discovery friction for communities",
            "Operating system infrastructure for event organizers",
            "Built by organizers, for organizers (10+ events/year experience)",
        ],
    },
]

