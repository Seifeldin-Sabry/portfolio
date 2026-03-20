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
        id: "arkive",
        title: "Arkive",
        description:
            "Your reading list, actually organized. Save articles from anywhere, intelligent tagging, and distraction-free reading. A cleaner alternative to Pocket, built for serious readers.",
        technologies: [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Drizzle ORM",
            "TanStack Query",
            "ElysiaJS",
        ],
        status: "Coming Soon",
        generalFeatures: [
            "Save articles from any source with one click",
            "Intelligent auto-tagging and categorization",
            "Distraction-free reading mode",
            "Full-text search across saved content",
        ],
        myContributions: [
            "Architected full-stack application with Next.js and ElysiaJS",
            "Built intelligent tagging system with auto-categorization",
            "Designed clean, distraction-free reading experience",
            "Implemented article parsing and content extraction pipeline",
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
]

