import type {LucideIcon} from "lucide-react"
import {BookOpen, Bot, Briefcase, Gamepad2, Handshake, User} from "lucide-react"
import type {CaseStudy, Education, Experience, Project, Service} from "@/lib/content-types"
import type {BlogPost} from "@/lib/blogs"

export type AppId = "about" | "work" | "services" | "blog" | "assistant" | "games"

export interface ContentProps {
    projects: Project[]
    experiences: Experience[]
    education: Education[]
    posts: BlogPost[]
    services: Service[]
    caseStudies: CaseStudy[]
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
    work: {id: "work", label: "Work", icon: Briefcase, defaultSize: {w: 760, h: 620}, tint: "bg-gradient-to-b from-amber-300 to-orange-500"},
    services: {id: "services", label: "Services", icon: Handshake, defaultSize: {w: 640, h: 660}, tint: "bg-gradient-to-b from-amber-200 to-yellow-600"},
    blog: {id: "blog", label: "Writing", icon: BookOpen, defaultSize: {w: 560, h: 560}, tint: "bg-gradient-to-b from-rose-300 to-rose-600"},
    assistant: {id: "assistant", label: "Assistant", icon: Bot, defaultSize: {w: 560, h: 640}, tint: "bg-gradient-to-b from-orange-300 to-amber-600"},
    games: {id: "games", label: "Games", icon: Gamepad2, defaultSize: {w: 460, h: 520}, tint: "bg-gradient-to-b from-pink-400 to-fuchsia-600"},
}

export const DOCK_APPS: AppId[] = ["about", "work", "services", "blog", "assistant", "games"]
