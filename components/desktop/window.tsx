"use client"

import {memo, useCallback, useEffect, useRef, type ReactNode} from "react"
import {motion, useMotionValue, useReducedMotion} from "framer-motion"
import {Minus, Square, X} from "lucide-react"
import type {AppId, ContentProps} from "@/components/apps/registry"
import {APP_META} from "@/components/apps/registry"
import AppHost from "@/components/apps/app-host"
import {clampX, clampY, useWindowDispatch, type WindowState} from "@/components/desktop/window-manager"
import {Z_INDEX} from "@/lib/constants"

interface AppWindowProps {
    win: WindowState
    active: boolean
    content: ContentProps
    onOpen: (id: AppId) => void
}

/**
 * Memoized on (win, active, content, onOpen): every prop is reference-stable
 * except this window's own state object, so focusing, moving or resizing one
 * window never re-renders the others (or their app bodies).
 */
function AppWindow({win, active, content, onOpen}: AppWindowProps) {
    const dispatch = useWindowDispatch()
    const reduce = useReducedMotion()
    const frameRef = useRef<HTMLDivElement>(null)
    const meta = APP_META[win.id as AppId]
    const Icon = meta.icon

    // Position lives in motion values, applied as a compositor transform:
    // dragging writes transforms only (no layout, no React render per pointer
    // move), and state is committed once on release. The sync effect below maps
    // state changes (restore, maximize, fit-viewport) back onto the values.
    const x = useMotionValue(win.x)
    const y = useMotionValue(win.y)
    useEffect(() => {
        x.set(win.x)
        y.set(win.y)
    }, [win.x, win.y, x, y])

    const focus = useCallback(() => dispatch({type: "focus", id: win.id}), [dispatch, win.id])
    const closeWin = useCallback(() => dispatch({type: "close", id: win.id}), [dispatch, win.id])
    const minimizeWin = useCallback(() => dispatch({type: "minimize", id: win.id}), [dispatch, win.id])
    const toggleMaximize = useCallback(() => dispatch({type: "toggle-maximize", id: win.id}), [dispatch, win.id])
    const commitMove = useCallback(
        (mx: number, my: number) => dispatch({type: "move", id: win.id, x: mx, y: my}),
        [dispatch, win.id],
    )
    const commitResize = useCallback(
        (w: number, h: number) => dispatch({type: "resize", id: win.id, w, h}),
        [dispatch, win.id],
    )

    const startDrag = (e: React.PointerEvent) => {
        if (e.button !== 0 || win.maximized) return
        focus()
        const startX = e.clientX
        const startY = e.clientY
        const originX = x.get()
        const originY = y.get()
        const onMove = (ev: PointerEvent) => {
            x.set(clampX(originX + ev.clientX - startX, win.w))
            y.set(clampY(originY + ev.clientY - startY))
        }
        const onUp = (ev: PointerEvent) => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
            // Commit the same position to state; the sync effect re-sets the
            // motion values to identical numbers, so there is no visible jump.
            commitMove(clampX(originX + ev.clientX - startX, win.w), clampY(originY + ev.clientY - startY))
        }
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)
    }

    const startResize = (e: React.PointerEvent) => {
        if (e.button !== 0 || win.maximized) return
        e.stopPropagation()
        focus()
        const el = frameRef.current
        if (!el) return
        const startX = e.clientX
        const startY = e.clientY
        const originW = win.w
        const originH = win.h
        const onMove = (ev: PointerEvent) => {
            el.style.width = `${Math.max(340, originW + ev.clientX - startX)}px`
            el.style.height = `${Math.max(260, originH + ev.clientY - startY)}px`
        }
        const onUp = (ev: PointerEvent) => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
            commitResize(Math.max(340, originW + ev.clientX - startX), Math.max(260, originH + ev.clientY - startY))
        }
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)
    }

    return (
        <motion.div
            ref={frameRef}
            initial={reduce ? {opacity: 0} : {opacity: 0, scale: 0.96}}
            animate={
                win.minimized
                    ? {opacity: 0, scale: 0.94}
                    : {opacity: 1, scale: 1}
            }
            // Opacity must tween: an underdamped spring overshoots past 0 and
            // briefly re-shows the window on close (visible as a blink).
            exit={reduce ? {opacity: 0, transition: {duration: 0.12}} : {opacity: 0, scale: 0.97, transition: {duration: 0.14, ease: "easeIn"}}}
            transition={{type: "spring", stiffness: 420, damping: 38, opacity: {duration: 0.16, ease: "easeOut"}}}
            onMouseDown={focus}
            className={`absolute flex flex-col overflow-hidden rounded-xl border bg-window-bg shadow-[0_24px_80px_rgba(0,0,0,0.5)] ${
                active ? "border-window-border" : "border-window-border/60"
            } ${win.minimized ? "pointer-events-none" : ""}`}
            style={{
                left: 0,
                top: 0,
                x,
                y,
                width: win.w,
                height: win.h,
                zIndex: Z_INDEX.WINDOW + win.z,
                willChange: "transform",
            }}
        >
            {/* Title bar */}
            <div
                onPointerDown={startDrag}
                onDoubleClick={toggleMaximize}
                className={`flex h-9 shrink-0 select-none items-center gap-2 border-b border-window-border bg-window-titlebar px-3 ${
                    win.maximized ? "" : "cursor-grab active:cursor-grabbing"
                }`}
            >
                <div className="group/traffic flex items-center gap-2">
                    <ControlButton label="Close" onClick={closeWin} color={active ? "bg-[#ff5f57]" : ""}>
                        <X size={8} strokeWidth={3}/>
                    </ControlButton>
                    <ControlButton label="Minimize" onClick={minimizeWin} color={active ? "bg-[#febc2e]" : ""}>
                        <Minus size={8} strokeWidth={3}/>
                    </ControlButton>
                    <ControlButton label="Maximize" onClick={toggleMaximize} color={active ? "bg-[#28c840]" : ""}>
                        <Square size={6} strokeWidth={3}/>
                    </ControlButton>
                </div>
                <div className={`flex flex-1 items-center justify-center gap-1.5 ${active ? "text-foreground" : "text-muted-foreground"}`}>
                    <Icon size={12}/>
                    <span className="text-[13px] font-semibold">{meta.label}</span>
                </div>
                <div className="w-12"/>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-hidden bg-window-bg">
                <AppHost id={win.id} content={content} onOpen={onOpen}/>
            </div>

            {/* Resize handles (right, bottom, corner) */}
            {!win.maximized && (
                <>
                    <div
                        onPointerDown={startResize}
                        className="absolute right-0 top-9 h-[calc(100%-2.25rem)] w-1.5 cursor-ew-resize"
                    />
                    <div
                        onPointerDown={startResize}
                        className="absolute bottom-0 left-0 h-1.5 w-full cursor-ns-resize"
                    />
                    <div
                        onPointerDown={startResize}
                        className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize"
                    />
                </>
            )}
        </motion.div>
    )
}

/** macOS traffic light: coloured on the active window, grey otherwise; glyphs on group hover. */
function ControlButton({
    label,
    onClick,
    color,
    children,
}: {
    label: string
    onClick: () => void
    color: string
    children: ReactNode
}) {
    return (
        <button
            aria-label={label}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClick}
            className={`flex h-3 w-3 items-center justify-center rounded-full text-transparent shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.3)] group-hover/traffic:text-black/60 ${
                color || "bg-foreground/20 group-hover/traffic:bg-foreground/30"
            }`}
        >
            {children}
        </button>
    )
}

export default memo(AppWindow)
