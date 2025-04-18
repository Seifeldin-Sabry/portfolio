export interface Skill {
    id: string
    name: string
    category: string
    icon: string
    whiteBg?: boolean
}

export const skills: Skill[] = [
    // Frontend
    {
        id: "react",
        name: "React",
        category: "Frontend",
        icon: "/assets/icons/react_icon.svg",
    },
    {
        id: "nextjs",
        name: "Next.js",
        category: "Frontend",
        whiteBg: true,
        icon: "/assets/icons/nextjs_icon.svg",
    },
    {
        id: "angular",
        name: "Angular",
        category: "Frontend",
        icon: "/assets/icons/angular_icon.svg",
    },
    {
        id: "astro",
        name: "Astro",
        category: "Frontend",
        whiteBg: true,
        icon: "/assets/icons/astro_icon.svg",
    },
    {
        id: "typescript",
        name: "TypeScript",
        category: "Frontend",
        whiteBg: true,
        icon: "/assets/icons/typescript_icon.svg",
    },
    {
        id: "tailwind",
        name: "Tailwind CSS",
        category: "Frontend",
        icon: "/assets/icons/tailwind_icon.svg",
    },

    // Backend
    {
        id: "nodejs",
        name: "Node.js",
        category: "Backend",
        icon: "/assets/icons/nodejs_icon.svg",
    },
    {
        id: "python",
        name: "Python",
        category: "Backend",
        whiteBg: true,
        icon: "/assets/icons/python_icon.svg",
    },
    {
        id: "fast-api",
        name: "FastAPI",
        category: "Backend",
        whiteBg: true,
        icon: "/assets/icons/fastapi_icon.svg",
    },
    {
        id: "java-spring",
        name: "Java Spring",
        category: "Backend",
        icon: "/assets/icons/spring_boot_icon.svg",
    },
    {
        id: "azure",
        name: "Azure",
        category: "Backend",
        icon: "/assets/icons/azure_icon.svg",
    },
    {
        id: "mongodb",
        name: "MongoDB",
        category: "Backend",
        icon: "/assets/icons/mongodb_icon.svg",
    },
    {
        id: "postgresql",
        name: "PostgreSQL",
        category: "Backend",
        icon: "/assets/icons/postgresql_icon.svg",
    },
    {
        id: "redis",
        name: "Redis",
        category: "Backend",
        icon: "/assets/icons/redis_icon.svg",
    },
    {
        id: "gcp",
        name: "GCP",
        category: "Backend",
        icon: "/assets/icons/google_cloud_icon.svg",
    },

    // AI & Machine Learning
    {
        id: "huggingface",
        name: "Hugging Face Transformers",
        category: "AI & Machine Learning",
        icon: "/assets/icons/hf_icon.svg",
    },
    {
        id: "pandas",
        name: "Pandas",
        category: "AI & Machine Learning",
        whiteBg: true,
        icon: "/assets/icons/pandas_icon.svg",
    },
    {
        id: "nlp",
        name: "Natural Language Processing",
        category: "AI & Machine Learning",
        whiteBg: true,
        icon: "/assets/icons/nlp_icon.png",
    },
    {
        id: "gen-ai",
        name: "Generative AI",
        category: "AI & Machine Learning",
        icon: "/assets/icons/genai_icon.png",
    },

    // DevOps & Tools
    {
        id: "docker",
        name: "Docker",
        category: "DevOps & Tools",
        icon: "/assets/icons/docker_icon.svg",
    },
    {
        id: "ci-cd",
        name: "CI/CD",
        category: "DevOps & Tools",
        icon: "/assets/icons/github_actions_icon.png",
    },
    {
        id: "bash",
        name: "Bash Scripting",
        category: "DevOps & Tools",
        icon: "/assets/icons/bash_icon.svg",
    },

    // Developer Tools
    {
        id: "postman",
        name: "Postman",
        category: "Developer Tools",
        icon: "/assets/icons/postman_icon.svg",
    },
    {
        id: "vscode",
        name: "VS Code",
        whiteBg: true,
        category: "Developer Tools",
        icon: "/assets/icons/vscode_icon.svg",
    },
    {
        id: "figma",
        name: "Figma",
        category: "Developer Tools",
        icon: "/assets/icons/figma_icon.svg",
    },
    {
        id: "jira",
        name: "Jira",
        category: "Developer Tools",
        icon: "/assets/icons/jira_icon.svg",
    },
    {
        id: "notion",
        name: "Notion",
        category: "Developer Tools",
        whiteBg: true,
        icon: "/assets/icons/notion_icon.svg",
    },
    {
        id: "git",
        name: "Git",
        category: "Developer Tools",
        icon: "/assets/icons/git_icon.svg",
    },
    {
        id: "jetbrains",
        name: "Jetbrains",
        category: "Developer Tools",
        whiteBg: true,
        icon: "/assets/icons/jetbrains_icon.svg",
    },
    {
        id: "linear",
        name: "Linear",
        category: "Developer Tools",
        whiteBg: true,
        icon: "/assets/icons/linear_icon.svg",
    },
]

export const homePageSkills: Skill[] = [
    {
        id: "nextjs",
        name: "Next.js",
        category: "Frontend",
        whiteBg: true,
        icon: "/assets/icons/nextjs_icon.svg",
    },
    {
        id: "python",
        name: "Python",
        category: "Backend",
        whiteBg: true,
        icon: "/assets/icons/python_icon.svg",
    },
    {
        id: "redis",
        name: "Redis",
        category: "Backend",
        icon: "/assets/icons/redis_icon.svg",
    },
    {
        id: "huggingface",
        name: "Hugging Face Transformers",
        category: "AI & Machine Learning",
        icon: "/assets/icons/hf_icon.svg",
    },
]
