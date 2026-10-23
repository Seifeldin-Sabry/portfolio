import type {LucideIcon} from "lucide-react"
import {BookOpen, Bot, Briefcase, Calculator, FlaskConical, Gamepad2, Gauge, Handshake, LayoutGrid, Mail, StickyNote, SquareTerminal, User} from "lucide-react"
import type {Education, Experience, Project, Service} from "@/lib/content-types"
import type {BlogPost} from "@/lib/blogs"

export type AppId = "about" | "projects" | "experience" | "blog" | "assistant" | "lab" | "notes" | "terminal" | "calculator" | "games" | "services" | "tools" | "mail"

export interface ContentProps {
    projects: Project[]
    experiences: Experience[]
    education: Education[]
    posts: BlogPost[]
    services: Service[]
}

export interface AppMeta {
    id: AppId
    label: string
    icon: LucideIcon
    defaultSize: {w: number; h: number}
    /** app-icon background (dock, home screen) */
    tint: string
}

export const APP_META: Record<AppId, AppMeta> = {
    about: {id: "about", label: "About", icon: User, defaultSize: {w: 540, h: 660}, tint: "bg-gradient-to-b from-sky-400 to-blue-600"},
    projects: {id: "projects", label: "Projects", icon: LayoutGrid, defaultSize: {w: 620, h: 580}, tint: "bg-gradient-to-b from-violet-400 to-indigo-600"},
    experience: {id: "experience", label: "Experience", icon: Briefcase, defaultSize: {w: 560, h: 600}, tint: "bg-gradient-to-b from-amber-300 to-orange-500"},
    blog: {id: "blog", label: "Writing", icon: BookOpen, defaultSize: {w: 560, h: 560}, tint: "bg-gradient-to-b from-rose-300 to-rose-600"},
    assistant: {id: "assistant", label: "Assistant", icon: Bot, defaultSize: {w: 440, h: 620}, tint: "bg-gradient-to-b from-orange-300 to-amber-600"},
    lab: {id: "lab", label: "Lab", icon: FlaskConical, defaultSize: {w: 720, h: 620}, tint: "bg-gradient-to-b from-cyan-300 to-sky-700"},
    notes: {id: "notes", label: "Notes", icon: StickyNote, defaultSize: {w: 560, h: 420}, tint: "bg-gradient-to-b from-yellow-200 to-amber-400 text-amber-950"},
    terminal: {id: "terminal", label: "Terminal", icon: SquareTerminal, defaultSize: {w: 600, h: 380}, tint: "bg-gradient-to-b from-zinc-700 to-zinc-950"},
    calculator: {id: "calculator", label: "Calculator", icon: Calculator, defaultSize: {w: 340, h: 460}, tint: "bg-gradient-to-b from-zinc-500 to-zinc-800"},
    services: {id: "services", label: "Services", icon: Handshake, defaultSize: {w: 600, h: 640}, tint: "bg-gradient-to-b from-amber-200 to-yellow-600"},
    tools: {id: "tools", label: "Tools", icon: Gauge, defaultSize: {w: 600, h: 620}, tint: "bg-gradient-to-b from-indigo-400 to-violet-700"},
    mail: {id: "mail", label: "Mail", icon: Mail, defaultSize: {w: 520, h: 480}, tint: "bg-gradient-to-b from-sky-300 to-blue-600"},
    games: {id: "games", label: "Games", icon: Gamepad2, defaultSize: {w: 460, h: 520}, tint: "bg-gradient-to-b from-pink-400 to-fuchsia-600"},
}

export const DOCK_APPS: AppId[] = ["about", "services", "tools", "projects", "experience", "blog", "mail", "notes", "terminal", "calculator", "games", "assistant", "lab"]
