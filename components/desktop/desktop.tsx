"use client"

import {useCallback, useState, type ReactNode} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {ChevronLeft} from "lucide-react"
import {APP_META, DOCK_APPS, type AppId, type ContentProps} from "@/components/apps/registry"
import AboutApp from "@/components/apps/about-app"
import ProjectsApp from "@/components/apps/projects-app"
import HomelabApp from "@/components/apps/homelab-app"
import ExperienceApp from "@/components/apps/experience-app"
import BlogApp from "@/components/apps/blog-app"
import AssistantApp from "@/components/apps/assistant-app"
import LabApp from "@/components/apps/lab-app"
import NotesApp from "@/components/apps/notes-app"
import TerminalApp from "@/components/apps/terminal-app"
import CalculatorApp from "@/components/apps/calculator-app"
import GamesApp from "@/components/apps/games-app"
import NotificationCenter, {BootToast} from "@/components/desktop/notification-center"
import Widgets from "@/components/desktop/widgets"
import AppWindow from "@/components/desktop/window"
import Dock from "@/components/desktop/dock"
import MenuBar from "@/components/desktop/menu-bar"
import {useWindowManager, WindowManagerProvider} from "@/components/desktop/window-manager"
import BootScreen from "@/components/shell/boot-screen"
import {useDesktopOS} from "@/components/shell/device"

function renderApp(id: AppId, content: ContentProps, onOpen: (id: AppId) => void): ReactNode {
    switch (id) {
        case "about":
            return <AboutApp/>
        case "projects":
            return <ProjectsApp projects={content.projects}/>
        case "homelab":
            return <HomelabApp homelabServices={content.homelabServices}/>
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
    }
}

// Warm, low-key wallpaper: two soft glows over the graphite base.
const WALLPAPER =
    "radial-gradient(ellipse 70% 55% at 18% 12%, hsl(28 45% 22% / 0.55), transparent 70%), radial-gradient(ellipse 60% 60% at 85% 90%, hsl(15 35% 18% / 0.6), transparent 70%)"

export default function Desktop(content: ContentProps) {
    const isDesktop = useDesktopOS()
    const [booted, setBooted] = useState(false)
    const finishBoot = useCallback(() => setBooted(true), [])

    return (
        <div className="fixed inset-0 overflow-hidden bg-wallpaper text-foreground" style={{backgroundImage: WALLPAPER}}>
            {isDesktop === true && (
                <WindowManagerProvider>
                    <DesktopSurface content={content}/>
                </WindowManagerProvider>
            )}
            {isDesktop === false && <MobileSurface content={content}/>}
            <AnimatePresence>
                {(!booted || isDesktop === null) && (
                    <BootScreen key="boot" mode={isDesktop === false ? "mobile" : "desktop"} onDone={finishBoot}/>
                )}
            </AnimatePresence>
        </div>
    )
}

function DesktopSurface({content}: {content: ContentProps}) {
    const {state, dispatch} = useWindowManager()
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const windows = Object.values(state.windows).filter((w) => w !== undefined)
    const open = useCallback((id: AppId) => dispatch({type: "open", id}), [dispatch])

    return (
        <>
            <Widgets onOpen={open}/>
            <MenuBar onToggleNotifications={() => setNotificationsOpen((o) => !o)}/>
            <AnimatePresence>
                {windows.map((win) => (
                    <AppWindow
                        key={win.id}
                        state={win}
                        active={state.activeId === win.id}
                        onFocus={() => dispatch({type: "focus", id: win.id})}
                        onClose={() => dispatch({type: "close", id: win.id})}
                        onMinimize={() => dispatch({type: "minimize", id: win.id})}
                        onToggleMaximize={() => dispatch({type: "toggle-maximize", id: win.id})}
                        onMove={(x, y) => dispatch({type: "move", id: win.id, x, y})}
                        onResize={(w, h) => dispatch({type: "resize", id: win.id, w, h})}
                    >
                        {renderApp(win.id, content, open)}
                    </AppWindow>
                ))}
            </AnimatePresence>
            <Dock
                openIds={windows.map((w) => w.id)}
                activeId={state.activeId}
                minimizedIds={windows.filter((w) => w.minimized).map((w) => w.id)}
                onLaunch={(id) => {
                    const win = state.windows[id]
                    // Clicking the active app's dock icon minimizes it, like macOS.
                    if (win && !win.minimized && state.activeId === id) dispatch({type: "minimize", id})
                    else open(id)
                }}
                onCloseAll={() => dispatch({type: "close-all"})}
            />
            <BootToast onOpen={open}/>
            <NotificationCenter open={notificationsOpen} onClose={() => setNotificationsOpen(false)} onOpen={open}/>
        </>
    )
}

/** Touch / small screens: home-screen grid, each app opens full-screen. */
function MobileSurface({content}: {content: ContentProps}) {
    const [openId, setOpenId] = useState<AppId | null>(null)

    return (
        <>
            <div className="flex h-full flex-col px-6 pt-16">
                <p className="text-2xl font-semibold tracking-tight">Seif</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    software engineer &amp; founder
                </p>
                <div className="mt-10 grid grid-cols-4 gap-x-4 gap-y-6">
                    {DOCK_APPS.map((id) => {
                        const Icon = APP_META[id].icon
                        return (
                            <button key={id} onClick={() => setOpenId(id)} className="flex flex-col items-center gap-1.5">
                                <span className={`flex h-14 w-14 items-center justify-center rounded-[22%] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ${APP_META[id].tint}`}>
                                    <Icon size={24} strokeWidth={1.6}/>
                                </span>
                                <span className="text-[11px] text-muted-foreground">{APP_META[id].label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
            <AnimatePresence>
                {openId && (
                    <motion.div
                        key={openId}
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 24}}
                        transition={{type: "spring", stiffness: 320, damping: 32}}
                        className="fixed inset-0 flex flex-col bg-window-bg"
                    >
                        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-window-border bg-window-titlebar px-2">
                            <button
                                onClick={() => setOpenId(null)}
                                aria-label="Back to home"
                                className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft size={16}/> Home
                            </button>
                            <span className="ml-auto mr-3 font-mono text-xs">{APP_META[openId].label}</span>
                        </div>
                        <div className="relative flex-1 overflow-hidden">{renderApp(openId, content, setOpenId)}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
