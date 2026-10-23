"use client"

import {memo, startTransition, useEffect, useState, type ReactNode} from "react"
import type {AppId, ContentProps} from "@/components/apps/registry"
import AboutApp from "@/components/apps/about-app"
import ProjectsApp from "@/components/apps/projects-app"
import ExperienceApp from "@/components/apps/experience-app"
import BlogApp from "@/components/apps/blog-app"
import AssistantApp from "@/components/apps/assistant-app"
import LabApp from "@/components/apps/lab-app"
import NotesApp from "@/components/apps/notes-app"
import TerminalApp from "@/components/apps/terminal-app"
import CalculatorApp from "@/components/apps/calculator-app"
import GamesApp from "@/components/apps/games-app"
import ServicesApp from "@/components/apps/services-app"
import ToolsApp from "@/components/apps/tools-app"
import MailApp from "@/components/apps/mail-app"

export function renderApp(id: AppId, content: ContentProps, onOpen: (id: AppId) => void): ReactNode {
    switch (id) {
        case "about":
            return <AboutApp/>
        case "projects":
            return <ProjectsApp projects={content.projects}/>
        case "experience":
            return <ExperienceApp experiences={content.experiences} education={content.education}/>
        case "blog":
            return <BlogApp posts={content.posts}/>
        case "assistant":
            return <AssistantApp/>
        case "lab":
            return <LabApp/>
        case "notes":
            return <NotesApp/>
        case "terminal":
            return <TerminalApp onOpen={onOpen}/>
        case "calculator":
            return <CalculatorApp/>
        case "games":
            return <GamesApp/>
        case "services":
            return <ServicesApp services={content.services} onOpen={onOpen}/>
        case "tools":
            return <ToolsApp/>
        case "mail":
            return <MailApp/>
    }
}

/**
 * App bodies only depend on (id, content, onOpen), all stable across window
 * manager state changes, so memo keeps every open app from re-rendering when
 * another window opens, focuses or moves.
 *
 * The body mounts in a transition: the surrounding chrome (window frame, app
 * view) paints and starts its open animation immediately, while React renders
 * the body in interruptible slices instead of one long commit that drops frames.
 */
const AppHost = memo(function AppHost({
    id,
    content,
    onOpen,
}: {
    id: AppId
    content: ContentProps
    onOpen: (id: AppId) => void
}) {
    const [ready, setReady] = useState(false)
    useEffect(() => startTransition(() => setReady(true)), [])
    return ready ? renderApp(id, content, onOpen) : null
})

export default AppHost
