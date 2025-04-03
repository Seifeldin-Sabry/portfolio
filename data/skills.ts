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
    id: "express",
    name: "Express.js",
    category: "Backend",
    whiteBg: true,
    icon: "/assets/icons/expressjs_icon.svg",
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
    id: "express",
    name: "Express.js",
    category: "Backend",
    whiteBg: true,
    icon: "/assets/icons/expressjs_icon.svg",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Backend",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Backend",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "aws",
    name: "AWS",
    category: "Backend",
    icon: "/placeholder.svg?height=64&width=64",
  },

  // AI & Machine Learning
  {
    id: "python",
    name: "Python",
    category: "AI & Machine Learning",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    category: "AI & Machine Learning",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "pytorch",
    name: "PyTorch",
    category: "AI & Machine Learning",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "nlp",
    name: "Natural Language Processing",
    category: "AI & Machine Learning",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "cv",
    name: "Computer Vision",
    category: "AI & Machine Learning",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "ml",
    name: "Machine Learning",
    category: "AI & Machine Learning",
    icon: "/placeholder.svg?height=64&width=64",
  },

  // DevOps & Tools
  {
    id: "git",
    name: "Git",
    category: "DevOps & Tools",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "docker",
    name: "Docker",
    category: "DevOps & Tools",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "ci-cd",
    name: "CI/CD",
    category: "DevOps & Tools",
    icon: "/placeholder.svg?height=64&width=64",
  },
]

