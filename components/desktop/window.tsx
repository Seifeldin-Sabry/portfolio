"use client"

import {useRef, type ReactNode} from "react"
import {motion, useReducedMotion} from "framer-motion"
import {Minus, Square, X} from "lucide-react"
import type {AppId} from "@/components/apps/registry"
import {APP_META} from "@/components/apps/registry"
import {clampX, clampY, type WindowState} from "@/components/desktop/window-manager"
import {Z_INDEX} from "@/lib/constants"

interface AppWindowProps {
    state: WindowState
    active: boolean
    onFocus: () => void
    onClose: () => void
    onMinimize: () => void
    onToggleMaximize: () => void
    onMove: (x: number, y: number) => void
    onResize: (w: number, h: number) => void
    children: ReactNode
}

const TITLEBAR_H = 36

export default function AppWindow({
    state,
    active,
    onFocus,
    onClose,
    onMinimize,
    onToggleMaximize,
    onMove,
    onResize,
    children,
}: AppWindowProps) {
    const reduce = useReducedMotion()
    const frameRef = useRef<HTMLDivElement>(null)
    const meta = APP_META[state.id as AppId]
    const Icon = meta.icon

    // Direct-DOM drag during pointer move (no React re-render per frame); state
    // is committed once on release so the layout persists.
    const startDrag = (e: React.PointerEvent) => {
        if (e.button !== 0 || state.maximized) return
        onFocus()
        const el = frameRef.current
        if (!el) return
        const startX = e.clientX
        const startY = e.clientY
        const originX = state.x
        const originY = state.y
        const move = (ev: PointerEvent) => {
            el.style.left = `${clampX(originX + ev.clientX - startX, state.w)}px`
            el.style.top = `${clampY(originY + ev.clientY - startY)}px`
        }
        const up = (ev: PointerEvent) => {
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", up)
            onMove(clampX(originX + ev.clientX - startX, state.w), clampY(originY + ev.clientY - startY))
        }
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerup", up)
    }

    const startResize = (e: React.PointerEvent) => {
        if (e.button !== 0 || state.maximized) return
        e.stopPropagation()
        onFocus()
        const el = frameRef.current
        if (!el) return
        const startX = e.clientX
        const startY = e.clientY
        const originW = state.w
        const originH = state.h
        const move = (ev: PointerEvent) => {
            el.style.width = `${Math.max(340, originW + ev.clientX - startX)}px`
            el.style.height = `${Math.max(260, originH + ev.clientY - startY)}px`
        }
        const up = (ev: PointerEvent) => {
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", up)
            onResize(Math.max(340, originW + ev.clientX - startX), Math.max(260, originH + ev.clientY - startY))
        }
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerup", up)
    }

    return (
        <motion.div
            ref={frameRef}
            initial={reduce ? {opacity: 0} : {opacity: 0, scale: 0.96, y: 10}}
            animate={
                state.minimized
                    ? {opacity: 0, scale: 0.94}
                    : {opacity: 1, scale: 1, y: 0}
            }
            // Opacity must tween: an underdamped spring overshoots past 0 and
            // briefly re-shows the window on close (visible as a blink).
            exit={reduce ? {opacity: 0, transition: {duration: 0.12}} : {opacity: 0, scale: 0.97, transition: {duration: 0.14, ease: "easeIn"}}}
            transition={{type: "spring", stiffness: 420, damping: 38, opacity: {duration: 0.16, ease: "easeOut"}}}
            onMouseDown={onFocus}
            className={`absolute flex flex-col overflow-hidden rounded-xl border bg-window-bg shadow-[0_24px_80px_rgba(0,0,0,0.5)] ${
                active ? "border-window-border" : "border-window-border/60"
            } ${state.minimized ? "pointer-events-none" : ""}`}
            style={{
                left: state.x,
                top: state.y,
                width: state.w,
                height: state.h,
                zIndex: Z_INDEX.WINDOW + state.z,
            }}
        >
            {/* Title bar */}
            <div
                onPointerDown={startDrag}
                onDoubleClick={onToggleMaximize}
                className={`flex h-9 shrink-0 select-none items-center gap-2 border-b border-window-border bg-window-titlebar px-3 ${
                    state.maximized ? "" : "cursor-grab active:cursor-grabbing"
                }`}
            >
                <div className="group/traffic flex items-center gap-2">
                    <ControlButton label="Close" onClick={onClose} color={active ? "bg-[#ff5f57]" : ""}>
                        <X size={8} strokeWidth={3}/>
                    </ControlButton>
                    <ControlButton label="Minimize" onClick={onMinimize} color={active ? "bg-[#febc2e]" : ""}>
                        <Minus size={8} strokeWidth={3}/>
                    </ControlButton>
                    <ControlButton label="Maximize" onClick={onToggleMaximize} color={active ? "bg-[#28c840]" : ""}>
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
                {children}
            </div>

            {/* Resize handles (right, bottom, corner) */}
            {!state.maximized && (
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
