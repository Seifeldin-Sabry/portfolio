"use client"

import {memo, useEffect, useState, type ReactNode} from "react"
import {motion, useReducedMotion} from "framer-motion"
import {Coffee, FileText} from "lucide-react"
import type {AppId} from "@/components/apps/registry"
import {useClock} from "@/components/desktop/menu-bar"
import {LINKS, Z_INDEX} from "@/lib/constants"

const CV_URL = "/assets/documents/seifeldin-sabry-cv.pdf"
const COFFEE_KEY = "seif-os-coffees"

export const SHIPPED = [
    {title: "Ollie AI assistant", detail: "RAG over customer documents, human review"},
    {title: "Mobile companion", detail: "checklists from the shop floor"},
    {title: "Marketing site & CMS", detail: "off Wix · Next.js · Strapi"},
    {title: "Stripe billing", detail: "trials · tiered seats · dunning"},
]

/** Desktop widgets: sit on the wallpaper, under every window. Memoized: window changes don't touch them. */
export default memo(function Widgets({onOpen}: {onOpen: (id: AppId) => void}) {
    const reduce = useReducedMotion()

    return (
        // Outer div owns the big-screen scale; framer owns the inner transform.
        <div
            className="absolute right-5 top-12 hidden origin-top-right min-[1400px]:block min-[2000px]:scale-[1.2] min-[2400px]:scale-[1.35]"
            style={{zIndex: Z_INDEX.WIDGETS}}
        >
            <motion.aside
                initial={reduce ? false : {opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2}}
                className="grid w-[344px] grid-cols-2 gap-4 [&_p]:mb-0"
                aria-label="Desktop widgets"
            >
                <ClockWidget/>
                <CalendarWidget/>

                <Widget wide onClick={() => onOpen("experience")} label="Open Experience">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Recently shipped</p>
                    <ul className="mt-2 space-y-1.5">
                        {SHIPPED.map((item) => (
                            <li key={item.title}>
                                <p className="mb-0 text-[13px] font-medium leading-tight">{item.title}</p>
                                <p className="mb-0 text-[11px] leading-tight text-muted-foreground">{item.detail}</p>
                            </li>
                        ))}
                    </ul>
                </Widget>

                <Widget>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"/>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"/>
                        </span>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Available</p>
                    </div>
                    <p className="mt-2 text-[13px] font-medium leading-snug">Open to opportunities</p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                        Engineer @ Qfacts
                        <br/>
                        Founder @{" "}
                    <a href={LINKS.SDX_STUDIO} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent">
                        SDX Studio
                    </a>
                    </p>
                </Widget>

                <CoffeeWidget/>

                <button
                    onClick={() => onOpen("notes")}
                    className="col-span-2 -rotate-1 rounded-sm [@media(max-height:900px)]:hidden bg-[#f3dfa2] px-4 py-3 text-left text-[#3b3016] shadow-[0_14px_30px_rgba(0,0,0,0.45)] transition-transform hover:rotate-0"
                >
                    <p className="font-mono text-[10px] uppercase tracking-wider opacity-60">note to self</p>
                    <p className="mt-1 text-[13px] leading-snug">
                        drag windows around ✦ play minesweeper ✦ ask the assistant anything about my work
                    </p>
                </button>

                <div className="col-span-2 flex justify-end gap-5 px-1 [@media(max-height:1000px)]:hidden">
                    <DesktopFile label="CV.pdf" href={CV_URL}/>
                    <DesktopFile label="Notes" onClick={() => onOpen("notes")}/>
                </div>
            </motion.aside>
        </div>
    )
})

function Widget({children, wide, onClick, label}: {children: ReactNode; wide?: boolean; onClick?: () => void; label?: string}) {
    const className = `${wide ? "col-span-2" : "aspect-square"} rounded-[22px] border border-foreground/[0.08] bg-window-chrome/55 p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl`
    return onClick ? (
        <button onClick={onClick} aria-label={label} className={`${className} transition-transform hover:scale-[1.01]`}>
            {children}
        </button>
    ) : (
        <div className={className}>{children}</div>
    )
}

function ClockWidget() {
    const now = useClock()
    const h = now ? now.getHours() % 12 : 10
    const m = now ? now.getMinutes() : 10
    const hand = (deg: number, length: string, width: string, color: string) => (
        <span
            className={`absolute bottom-1/2 left-1/2 origin-bottom rounded-full ${color}`}
            style={{height: length, width, transform: `translateX(-50%) rotate(${deg}deg)`}}
        />
    )
    return (
        <Widget>
            <div className="relative mx-auto h-full w-full rounded-full bg-foreground/[0.92]">
                {Array.from({length: 12}, (_, i) => (
                    <span
                        key={i}
                        className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top"
                        style={{transform: `rotate(${i * 30 + 180}deg)`}}
                    >
                        <span className={`absolute bottom-[6%] left-0 w-px bg-background/70 ${i % 3 === 0 ? "h-2.5" : "h-1.5"}`}/>
                    </span>
                ))}
                {hand(h * 30 + m / 2, "26%", "3px", "bg-background")}
                {hand(m * 6, "38%", "2px", "bg-background")}
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"/>
                <span className="absolute inset-x-0 bottom-[22%] text-center text-[9px] font-semibold uppercase tracking-wider text-background/60">
                    Antwerp
                </span>
            </div>
        </Widget>
    )
}

function CalendarWidget() {
    const now = useClock()
    const today = now ?? new Date(2026, 0, 1)
    const year = today.getFullYear()
    const month = today.getMonth()
    // Monday-first grid, like a Belgian calendar.
    const offset = (new Date(year, month, 1).getDay() + 6) % 7
    const days = new Date(year, month + 1, 0).getDate()
    const cells = [...Array<null>(offset).fill(null), ...Array.from({length: days}, (_, i) => i + 1)]
    return (
        <Widget>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                {today.toLocaleDateString("en-GB", {month: "long"})}
            </p>
            <div className="mt-1.5 grid grid-cols-7 gap-y-0.5 text-center text-[9px] tabular-nums">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="font-semibold text-muted-foreground">{d}</span>
                ))}
                {cells.map((d, i) => (
                    <span
                        key={i}
                        className={`mx-auto flex h-[15px] w-[15px] items-center justify-center rounded-full ${
                            now && d === today.getDate() ? "bg-accent font-semibold text-accent-foreground" : ""
                        }`}
                    >
                        {d ?? ""}
                    </span>
                ))}
            </div>
        </Widget>
    )
}

/** Virtual coffee counter (per browser) + a link to buy a real one. */
function CoffeeWidget() {
    const [count, setCount] = useState(0)
    const [bump, setBump] = useState(0)
    useEffect(() => {
        try {
            setCount(Number(localStorage.getItem(COFFEE_KEY) ?? 0))
        } catch {
            /* private mode */
        }
    }, [])
    const add = () => {
        const next = count + 1
        setCount(next)
        setBump((b) => b + 1)
        try {
            localStorage.setItem(COFFEE_KEY, String(next))
        } catch {
            /* private mode */
        }
    }
    return (
        <Widget>
            <div className="flex h-full flex-col">
                <div className="flex items-baseline justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Coffee</p>
                    <button onClick={add} aria-label="Add a virtual coffee" className="flex items-baseline gap-1 text-muted-foreground hover:text-foreground">
                        <motion.span key={bump} initial={{scale: 1.4}} animate={{scale: 1}} className="text-[13px] font-semibold tabular-nums">
                            {count}
                        </motion.span>
                        <span className="text-[10px]">+☕</span>
                    </button>
                </div>
                <p className="mt-1 text-[12px] leading-snug text-muted-foreground">Enjoyed poking around? Fuel the next build.</p>
                <a
                    href={LINKS.BUY_ME_A_COFFEE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-full bg-[#ffdd00] py-1.5 text-[12px] font-semibold text-black hover:brightness-105 active:scale-95"
                >
                    <Coffee size={13}/> Buy me a coffee
                </a>
            </div>
        </Widget>
    )
}

function DesktopFile({label, href, onClick}: {label: string; href?: string; onClick?: () => void}) {
    const body = (
        <>
            <span className="flex h-12 w-10 items-center justify-center rounded-md border border-foreground/15 bg-foreground/[0.06] text-muted-foreground transition-colors group-hover:text-foreground">
                <FileText size={18} strokeWidth={1.5}/>
            </span>
            <span className="rounded px-1 text-[11px] text-foreground/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] group-hover:bg-accent/30">{label}</span>
        </>
    )
    const className = "group flex flex-col items-center gap-1"
    return href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {body}
        </a>
    ) : (
        <button onClick={onClick} className={className}>
            {body}
        </button>
    )
}
