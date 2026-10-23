"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {ChevronLeft} from "lucide-react"
import {APP_META, DOCK_APPS, type AppId, type ContentProps} from "@/components/apps/registry"
import AppHost from "@/components/apps/app-host"
import NotificationCenter, {BootToast} from "@/components/desktop/notification-center"
import Widgets from "@/components/desktop/widgets"
import AppWindow from "@/components/desktop/window"
import Dock from "@/components/desktop/dock"
import MenuBar from "@/components/desktop/menu-bar"
import {useWindowManager, WindowManagerProvider} from "@/components/desktop/window-manager"
import LoginScreen, {type Persona} from "@/components/desktop/login-screen"
import {PERSONA_KEY} from "@/lib/constants"
import BootScreen from "@/components/shell/boot-screen"
import {useDesktopOS} from "@/components/shell/device"

// Warm, low-key wallpaper: two soft glows over the graphite base.
const WALLPAPER =
    "radial-gradient(ellipse 70% 55% at 18% 12%, hsl(28 45% 22% / 0.55), transparent 70%), radial-gradient(ellipse 60% 60% at 85% 90%, hsl(15 35% 18% / 0.6), transparent 70%)"

/**
 * Mirrors the focused app into the URL (/apps/<id>), so the address bar is
 * always a shareable link to what you're looking at. Only reacts to changes:
 * landing on "/" shouldn't rewrite the URL before the visitor does anything.
 */
function useSyncAppUrl(activeId: AppId | null) {
    // Compare with the last value rather than a "first run" flag: React's dev
    // StrictMode runs effects twice, which would defeat a flag.
    const previous = useRef(activeId)
    useEffect(() => {
        if (previous.current === activeId) return
        previous.current = activeId
        const path = activeId ? `/apps/${activeId}` : "/"
        if (window.location.pathname !== path) window.history.replaceState(window.history.state, "", path)
    }, [activeId])
}

export default function Desktop({initialApp, ...content}: ContentProps & {initialApp?: AppId}) {
    const isDesktop = useDesktopOS()
    const [booted, setBooted] = useState(false)
    const finishBoot = useCallback(() => setBooted(true), [])

    return (
        <div className="fixed inset-0 overflow-hidden bg-wallpaper text-foreground" style={{backgroundImage: WALLPAPER}}>
            {isDesktop === true && (
                <WindowManagerProvider>
                    <DesktopSurface content={content} initialApp={initialApp}/>
                </WindowManagerProvider>
            )}
            {isDesktop === false && <MobileSurface content={content} initialApp={initialApp}/>}
            <AnimatePresence>
                {(!booted || isDesktop === null) && (
                    <BootScreen key="boot" mode={isDesktop === false ? "mobile" : "desktop"} onDone={finishBoot}/>
                )}
            </AnimatePresence>
        </div>
    )
}

function DesktopSurface({content, initialApp}: {content: ContentProps; initialApp?: AppId}) {
    const {state, dispatch} = useWindowManager()
    useEffect(() => {
        if (initialApp) dispatch({type: "open", id: initialApp})
    }, [initialApp, dispatch])
    useSyncAppUrl(state.activeId)

    // First desktop visit without a deep link: ask who's visiting.
    const [showLogin, setShowLogin] = useState(false)
    useEffect(() => {
        try {
            if (!initialApp && !localStorage.getItem(PERSONA_KEY)) setShowLogin(true)
        } catch {
            /* private mode: skip the picker */
        }
    }, [initialApp])
    const choosePersona = useCallback(
        (persona: Persona | null) => {
            setShowLogin(false)
            try {
                localStorage.setItem(PERSONA_KEY, persona?.id ?? "browsing")
            } catch {
                /* private mode */
            }
            // Umami (already on the site) records who visits, no extra tracker.
            ;(window as {umami?: {track: (event: string, data: object) => void}}).umami?.track("persona", {id: persona?.id ?? "browsing"})
            if (!persona) return
            dispatch({type: "close-all"})
            for (const id of persona.apps) dispatch({type: "open", id})
        },
        [dispatch],
    )
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const windows = Object.values(state.windows).filter((w) => w !== undefined)
    const open = useCallback((id: AppId) => dispatch({type: "open", id}), [dispatch])
    const launch = useCallback((id: AppId) => dispatch({type: "launch", id}), [dispatch])
    const closeAll = useCallback(() => dispatch({type: "close-all"}), [dispatch])
    const toggleNotifications = useCallback(() => setNotificationsOpen((o) => !o), [])

    return (
        <>
            <Widgets onOpen={open}/>
            <MenuBar onToggleNotifications={toggleNotifications}/>
            <AnimatePresence>
                {windows.map((win) => (
                    <AppWindow key={win.id} win={win} active={state.activeId === win.id} content={content} onOpen={open}/>
                ))}
            </AnimatePresence>
            <Dock
                openIds={windows.map((w) => w.id)}
                activeId={state.activeId}
                minimizedIds={windows.filter((w) => w.minimized).map((w) => w.id)}
                onLaunch={launch}
                onCloseAll={closeAll}
            />
            <AnimatePresence>{showLogin && <LoginScreen key="login" onChoose={choosePersona}/>}</AnimatePresence>
            {!showLogin && <BootToast onOpen={open}/>}
            <NotificationCenter open={notificationsOpen} onClose={() => setNotificationsOpen(false)} onOpen={open}/>
        </>
    )
}

/** Touch / small screens: home-screen grid, each app opens full-screen. */
function MobileSurface({content, initialApp}: {content: ContentProps; initialApp?: AppId}) {
    const [openId, setOpenId] = useState<AppId | null>(initialApp ?? null)
    useSyncAppUrl(openId)

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
                        initial={{opacity: 0, y: 16}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 16}}
                        transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
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
                        <div className="relative flex-1 overflow-hidden">
                            <AppHost id={openId} content={content} onOpen={setOpenId}/>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
