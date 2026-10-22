"use client"

import {useEffect, useRef, useState} from "react"
import Image from "next/image"
import {BatteryMedium, Search, SlidersHorizontal, Wifi} from "lucide-react"
import {APP_META, DOCK_APPS, type AppId} from "@/components/apps/registry"
import {useWindowManager} from "@/components/desktop/window-manager"
import {LINKS, SITE_CONFIG, Z_INDEX} from "@/lib/constants"

const CV_URL = "/assets/documents/seifeldin-sabry-cv.pdf"
const LAYOUT_KEY = "seif-os-layout"

type MenuItem =
    | {label: string; action: () => void; shortcut?: string; disabled?: boolean; checked?: boolean}
    | {separator: true}

interface Menu {
    id: string
    label: React.ReactNode
    bold?: boolean
    items: MenuItem[]
}

const openUrl = (url: string) => window.open(url, url.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer")

export default function MenuBar({onToggleNotifications}: {onToggleNotifications: () => void}) {
    const {state, dispatch} = useWindowManager()
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const barRef = useRef<HTMLElement>(null)
    const now = useClock()

    const active = state.activeId
    const openWindows = Object.values(state.windows).filter((w) => w !== undefined).sort((a, b) => a.z - b.z)
    const open = (id: AppId) => dispatch({type: "open", id})

    useEffect(() => {
        if (!openMenu) return
        const close = (e: Event) => {
            if (e instanceof KeyboardEvent && e.key !== "Escape") return
            if (e instanceof PointerEvent && barRef.current?.contains(e.target as Node)) return
            setOpenMenu(null)
        }
        window.addEventListener("pointerdown", close)
        window.addEventListener("keydown", close)
        return () => {
            window.removeEventListener("pointerdown", close)
            window.removeEventListener("keydown", close)
        }
    }, [openMenu])

    const menus: Menu[] = [
        {
            id: "brand",
            label: <Image src="/assets/logos/brand-mark.svg" alt="Seif OS menu" width={15} height={15}/>,
            items: [
                {label: "About This Site", action: () => open("about")},
                {label: "How the Assistant Works…", action: () => open("lab")},
                {separator: true},
                {label: "Download CV", action: () => openUrl(CV_URL)},
                {label: "Book a Call…", action: () => openUrl(LINKS.CALENDLY)},
                {label: "Buy Me a Coffee…", action: () => openUrl(LINKS.BUY_ME_A_COFFEE)},
                {separator: true},
                {
                    label: "Reset Window Layout",
                    action: () => {
                        try {
                            localStorage.removeItem(LAYOUT_KEY)
                        } catch {
                            /* private mode */
                        }
                        window.location.reload()
                    },
                },
            ],
        },
        {
            id: "app",
            bold: true,
            label: active ? APP_META[active].label : "Finder",
            items: [
                {label: `About ${active ? APP_META[active].label : "Finder"}`, action: () => open("about")},
                {separator: true},
                {label: "Hide", shortcut: "⌘H", disabled: !active, action: () => active && dispatch({type: "minimize", id: active})},
                {label: "Quit", shortcut: "⌘Q", disabled: !active, action: () => active && dispatch({type: "close", id: active})},
            ],
        },
        {
            id: "file",
            label: "File",
            items: [
                {label: "New Note", shortcut: "⌘N", action: () => open("notes")},
                {label: "New Terminal", action: () => open("terminal")},
                {separator: true},
                {label: "Close Window", shortcut: "⌘W", disabled: !active, action: () => active && dispatch({type: "close", id: active})},
            ],
        },
        {
            id: "view",
            label: "View",
            items: [
                {label: "Enter Full Screen", disabled: !active, action: () => active && dispatch({type: "toggle-maximize", id: active})},
                {label: "Minimize", shortcut: "⌘M", disabled: !active, action: () => active && dispatch({type: "minimize", id: active})},
            ],
        },
        {
            id: "go",
            label: "Go",
            items: DOCK_APPS.map((id) => ({label: APP_META[id].label, action: () => open(id)})),
        },
        {
            id: "window",
            label: "Window",
            items: openWindows.length
                ? openWindows.map((w) => ({label: APP_META[w.id].label, checked: w.id === active, action: () => open(w.id)}))
                : [{label: "No Open Windows", disabled: true, action: () => undefined}],
        },
        {
            id: "help",
            label: "Help",
            items: [
                {label: "Ask the Assistant", action: () => open("assistant")},
                {label: "Terminal Commands", action: () => open("terminal")},
                {separator: true},
                {label: "Email Seif", action: () => openUrl(`mailto:${SITE_CONFIG.EMAIL}`)},
                {label: "SDX Studio", action: () => openUrl(LINKS.SDX_STUDIO)},
                {label: "GitHub", action: () => openUrl(LINKS.GITHUB)},
                {label: "LinkedIn", action: () => openUrl(LINKS.LINKEDIN)},
            ],
        },
    ]

    return (
        <header
            ref={barRef}
            className="fixed inset-x-0 top-0 flex h-8 select-none items-center bg-black/35 px-2 text-[13px] text-foreground/90 shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
            style={{zIndex: Z_INDEX.MENUBAR}}
        >
            <nav className="flex h-full items-center" aria-label="Menu bar">
                {menus.map((menu) => (
                    <div key={menu.id} className="relative h-full">
                        <button
                            onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
                            // macOS: once a menu is open, hovering moves between menus.
                            onPointerEnter={() => openMenu && setOpenMenu(menu.id)}
                            aria-haspopup="menu"
                            aria-expanded={openMenu === menu.id}
                            className={`flex h-full items-center rounded-md px-2.5 ${menu.bold ? "font-semibold" : ""} ${
                                openMenu === menu.id ? "bg-foreground/15" : ""
                            }`}
                        >
                            {menu.label}
                        </button>
                        {openMenu === menu.id && (
                            <div
                                role="menu"
                                className="absolute left-0 top-[30px] min-w-[220px] rounded-lg border border-foreground/10 bg-popover/85 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                            >
                                {menu.items.map((item, i) =>
                                    "separator" in item ? (
                                        <div key={i} className="mx-2 my-1 h-px bg-foreground/10"/>
                                    ) : (
                                        <button
                                            key={i}
                                            role="menuitem"
                                            disabled={item.disabled}
                                            onClick={() => {
                                                setOpenMenu(null)
                                                item.action()
                                            }}
                                            className="flex w-full items-center gap-2 rounded px-2 py-[3px] text-left text-[13px] enabled:hover:bg-accent enabled:hover:text-accent-foreground disabled:opacity-40"
                                        >
                                            <span className="w-3 text-[11px]">{item.checked ? "✓" : ""}</span>
                                            <span className="flex-1">{item.label}</span>
                                            {item.shortcut && <span className="text-[12px] opacity-50">{item.shortcut}</span>}
                                        </button>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            <div className="ml-auto flex h-full items-center gap-0.5 text-foreground/85">
                <StatusIcon label="Battery"><BatteryMedium size={17} strokeWidth={1.6}/></StatusIcon>
                <StatusIcon label="Wi-Fi"><Wifi size={14} strokeWidth={2}/></StatusIcon>
                <StatusIcon label="Search" onClick={() => open("terminal")}><Search size={13} strokeWidth={2.2}/></StatusIcon>
                <StatusIcon label="Control Centre" onClick={onToggleNotifications}><SlidersHorizontal size={13} strokeWidth={2.2}/></StatusIcon>
                <button
                    onClick={onToggleNotifications}
                    className="flex h-6 items-center rounded-md px-2 tabular-nums hover:bg-foreground/10"
                    aria-label="Open notification centre"
                >
                    {now
                        ? `${now.toLocaleDateString("en-GB", {weekday: "short", day: "numeric", month: "short"})}  ${now.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"})}`
                        : ""}
                </button>
            </div>
        </header>
    )
}

function StatusIcon({label, onClick, children}: {label: string; onClick?: () => void; children: React.ReactNode}) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            title={label}
            tabIndex={onClick ? 0 : -1}
            className={`flex h-6 w-7 items-center justify-center rounded-md ${onClick ? "hover:bg-foreground/10" : "cursor-default"}`}
        >
            {children}
        </button>
    )
}

/** Current time, ticking each minute boundary; null until mounted to avoid hydration mismatch. */
export function useClock(): Date | null {
    const [now, setNow] = useState<Date | null>(null)
    useEffect(() => {
        setNow(new Date())
        const id = setInterval(() => setNow(new Date()), 15_000)
        return () => clearInterval(id)
    }, [])
    return now
}
