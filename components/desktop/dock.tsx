"use client"

import {memo, useLayoutEffect, useRef, useState, type ReactNode} from "react"
import {motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue} from "framer-motion"
import {FileText, Trash2} from "lucide-react"
import {DOCK_APPS, type AppId, APP_META} from "@/components/apps/registry"
import {Z_INDEX} from "@/lib/constants"

interface DockProps {
    openIds: AppId[]
    activeId: AppId | null
    minimizedIds: AppId[]
    onLaunch: (id: AppId) => void
    onCloseAll: () => void
}

const CV_URL = "/assets/documents/seifeldin-sabry-cv.pdf"
/** Magnification reach in px either side of the pointer, like macOS. */
const DOCK_RADIUS = 150
/** Scale-only magnification: slots keep their layout, icons grow over the gap. */
const MAGNIFY = 1.3

/** Base icon size follows the viewport so the dock fits laptops and large monitors alike. */
function useBaseSize(): number {
    const [size, setSize] = useState(50)
    useLayoutEffect(() => {
        let id: ReturnType<typeof setTimeout> | null = null
        const fit = () => {
            if (id) clearTimeout(id)
            // Debounced: resize fires continuously while dragging the window edge.
            id = setTimeout(
                () => setSize(Math.round(Math.min(58, Math.max(40, window.innerHeight * 0.055, window.innerWidth * 0.028)))),
                120,
            )
        }
        setSize(Math.round(Math.min(58, Math.max(40, window.innerHeight * 0.055, window.innerWidth * 0.028))))
        window.addEventListener("resize", fit)
        return () => {
            if (id) clearTimeout(id)
            window.removeEventListener("resize", fit)
        }
    }, [])
    return size
}

function Dock({openIds, activeId, minimizedIds, onLaunch, onCloseAll}: DockProps) {
    const mouseX = useMotionValue(Infinity)
    const reduce = useReducedMotion()
    const base = useBaseSize()

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 flex justify-center pb-2" style={{zIndex: Z_INDEX.DOCK}}>
            <div
                onPointerMove={(e) => !reduce && mouseX.set(e.clientX)}
                onPointerLeave={() => mouseX.set(Infinity)}
                className="pointer-events-auto flex items-end gap-2 rounded-[22px] border border-foreground/15 bg-foreground/[0.07] px-2 pb-1.5 pt-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
                role="toolbar"
                aria-label="Dock"
            >
                {DOCK_APPS.map((id) => (
                    <DockItem
                        key={id}
                        mouseX={mouseX}
                        base={base}
                        label={APP_META[id].label}
                        running={openIds.includes(id) && !minimizedIds.includes(id)}
                        launching={!openIds.includes(id)}
                        onClick={() => onLaunch(id)}
                        active={activeId === id}
                    >
                        <AppIcon id={id}/>
                    </DockItem>
                ))}

                <div className="mx-1 w-px self-stretch bg-foreground/20" aria-hidden/>

                <DockItem mouseX={mouseX} base={base} label="CV.pdf" onClick={() => window.open(CV_URL, "_blank", "noopener,noreferrer")}>
                    <span className="flex h-full w-full items-center justify-center rounded-[22%] bg-gradient-to-b from-stone-100 to-stone-300 text-stone-600 shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]">
                        <FileText className="h-1/2 w-1/2" strokeWidth={1.6}/>
                    </span>
                </DockItem>
                <DockItem mouseX={mouseX} base={base} label="Trash · close all windows" onClick={onCloseAll}>
                    <span className="flex h-full w-full items-center justify-center rounded-[22%] bg-foreground/10 text-foreground/80">
                        <Trash2 className="h-1/2 w-1/2" strokeWidth={1.5}/>
                    </span>
                </DockItem>
            </div>
        </div>
    )
}

export default memo(Dock, dockEqual)

/** Window state churn (focus, move, resize) must not re-render the dock. */
function dockEqual(prev: DockProps, next: DockProps): boolean {
    return (
        prev.activeId === next.activeId &&
        prev.onLaunch === next.onLaunch &&
        prev.onCloseAll === next.onCloseAll &&
        sameMembers(prev.openIds, next.openIds) &&
        sameMembers(prev.minimizedIds, next.minimizedIds)
    )
}

function sameMembers(a: AppId[], b: AppId[]): boolean {
    return a.length === b.length && a.every((id, i) => id === b[i])
}

function AppIcon({id}: {id: AppId}) {
    const Icon = APP_META[id].icon
    return (
        <span
            className={`flex h-full w-full items-center justify-center rounded-[22%] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(0,0,0,0.18)] ${APP_META[id].tint}`}
        >
            <Icon className="h-[52%] w-[52%]" strokeWidth={1.8}/>
        </span>
    )
}

function DockItem({
    mouseX,
    base,
    label,
    running,
    launching,
    active,
    onClick,
    children,
}: {
    mouseX: MotionValue<number>
    base: number
    label: string
    running?: boolean
    launching?: boolean
    active?: boolean
    onClick: () => void
    children: ReactNode
}) {
    const ref = useRef<HTMLButtonElement>(null)
    const reduce = useReducedMotion()
    const bounce = useAnimationControls()
    const [center, setCenter] = useState<number | null>(null)

    // Icon centres are static (magnification scales around "bottom center", so
    // the horizontal centre is scale-invariant): measure once per size change,
    // never inside the pointer-move transform (that forced a reflow per event).
    useLayoutEffect(() => {
        const rect = ref.current?.getBoundingClientRect()
        if (rect) setCenter(rect.left + rect.width / 2)
    }, [base])

    const distance = useTransform(mouseX, (x) => (center === null ? Infinity : x - center))
    const rawScale = useTransform(distance, [-DOCK_RADIUS, 0, DOCK_RADIUS], [1, MAGNIFY, 1], {clamp: true})
    const scale = useSpring(rawScale, {stiffness: 320, damping: 24, mass: 0.3})

    const click = () => {
        if (launching && !reduce) void bounce.start({y: [0, -base * 0.45, 0, -base * 0.2, 0], transition: {duration: 0.7, ease: "easeOut"}})
        onClick()
    }

    return (
        <button ref={ref} onClick={click} aria-label={label} className="group relative flex flex-col items-center outline-none">
            <span className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md border border-foreground/10 bg-popover/90 px-2.5 py-1 text-[12px] text-foreground opacity-0 shadow-lg backdrop-blur-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {label}
            </span>
            <motion.span
                animate={bounce}
                style={
                    reduce
                        ? {width: base, height: base}
                        : {width: base, height: base, scale, transformOrigin: "bottom center", willChange: "transform"}
                }
                className={`block ${active ? "ring-2 ring-accent/50 ring-offset-0 rounded-[22%]" : ""}`}
            >
                {children}
            </motion.span>
            <span className={`mt-1 h-1 w-1 rounded-full transition-opacity ${running ? (active ? "bg-accent opacity-100" : "bg-foreground/80 opacity-100") : "opacity-0"}`}/>
        </button>
    )
}
