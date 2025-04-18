import {Code, Cpu, Database, GitBranch, Layout, LineChart, Server, Users} from "lucide-react"

export interface Service {
    id: string
    title: string
    description: string
    icon: any
    features: string[]
}

export const services: Service[] = [
    {
        id: "web-development",
        title: "Web Development",
        description: "Building websites and web applications that look great and work well.",
        icon: Layout,
        features: [
            "Responsive design for all devices",
            "Modern and user-friendly interfaces",
            "SEO optimization",
            "Performance optimization",
            "Content management systems",
        ],
    },
    {
        id: "app-development",
        title: "Application Development",
        description: "Creating full-stack applications with good user experiences.",
        icon: Code,
        features: [
            "Custom web applications",
            "Progressive Web Apps (PWAs)",
            "Single Page Applications (SPAs)",
            "Cross-platform compatibility",
            "API integration",
        ],
    },
    {
        id: "database-design",
        title: "Database Design",
        description: "Setting up databases that store and retrieve data efficiently.",
        icon: Database,
        features: ["Database schema design", "Data migration", "Query optimization", "Data security", "Backup solutions"],
    },
    {
        id: "api-development",
        title: "API Development",
        description: "Building APIs that connect your services and applications.",
        icon: Server,
        features: [
            "RESTful API design",
            "GraphQL API development",
            "API documentation",
            "Authentication and authorization",
            "Security implementation",
        ],
    },
    {
        id: "ai-solutions",
        title: "AI & Machine Learning",
        description: "Adding AI capabilities to your applications.",
        icon: Cpu,
        features: [
            "Natural Language Processing (NLP)",
            "Data analysis",
            "Predictive features",
            "ML model integration",
            "AI-powered tools",
        ],
    },
    {
        id: "data-analytics",
        title: "Data Analytics",
        description: "Turning your data into useful insights.",
        icon: LineChart,
        features: [
            "Data visualization",
            "Reporting dashboards",
            "Data processing",
            "Trend analysis",
            "Real-time analytics",
        ],
    },
    {
        id: "team-collaboration",
        title: "Team Collaboration",
        description: "Working with your development team on projects.",
        icon: Users,
        features: [
            "Adapting to your workflows",
            "Using your preferred tools",
            "Clear communication",
            "Regular updates",
            "Knowledge sharing",
        ],
    },
    {
        id: "code-quality",
        title: "Code Quality",
        description: "Writing clean, maintainable code for your projects.",
        icon: GitBranch,
        features: ["Code organization", "Testing implementation", "Performance improvements", "Bug fixing", "Code reviews"],
    },
]
