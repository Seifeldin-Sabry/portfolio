"use client"

import {createContext, useContext, useEffect, useReducer, type ReactNode} from "react"
import {APP_META, type AppId} from "@/components/apps/registry"

export interface WindowState {
    id: AppId
    x: number
    y: number
    w: number
    h: number
    z: number
    minimized: boolean
    maximized: boolean
    restoreRect: {x: number; y: number; w: number; h: number} | null
}

export interface WindowManagerState {
    windows: Partial<Record<AppId, WindowState>>
    topZ: number
    activeId: AppId | null
}

export type WindowAction =
    | {type: "open"; id: AppId}
    | {type: "launch"; id: AppId}
    | {type: "close"; id: AppId}
    | {type: "minimize"; id: AppId}
    | {type: "restore"; id: AppId}
    | {type: "toggle-maximize"; id: AppId}
    | {type: "focus"; id: AppId}
    | {type: "move"; id: AppId; x: number; y: number}
    | {type: "resize"; id: AppId; w: number; h: number}
    | {type: "close-all"}
    | {type: "fit-viewport"}

const MENU_BAR_H = 32
const DOCK_AREA_H = 96
const STORAGE_KEY = "seif-os-layout"
const PERSIST_DEBOUNCE_MS = 400
/** Widgets only show from this width (matches `min-[1400px]` in widgets.tsx). */
export const WIDGETS_MIN_VW = 1400
const WIDGET_COLUMN_W = 400

/** Default window sizes are tuned for ~1600px; grow them on big monitors. */
function sizeScale(vw: number): number {
    return Math.min(1.3, Math.max(1, vw / 1600))
}

function usableHeight(vh: number): number {
    return vh - MENU_BAR_H - DOCK_AREA_H - 24
}

export function clampX(x: number, w: number): number {
    return Math.min(Math.max(x, 12 - w + 120), window.innerWidth - 120)
}

export function clampY(y: number): number {
    return Math.min(Math.max(y, MENU_BAR_H + 8), window.innerHeight - 120)
}

function defaultRect(id: AppId, index: number): {x: number; y: number; w: number; h: number} {
    const {w, h} = APP_META[id].defaultSize
    const vw = window.innerWidth
    const vh = window.innerHeight
    const scale = sizeScale(vw)
    // Mirrors the widget column's CSS scale steps (2000px → 1.2, 2400px → 1.35).
    const widgetScale = vw >= 2400 ? 1.35 : vw >= 2000 ? 1.2 : 1
    const reserved = vw >= WIDGETS_MIN_VW ? WIDGET_COLUMN_W * widgetScale : 96
    const width = Math.round(Math.min(w * scale, vw - 48))
    const height = Math.round(Math.min(h * scale, usableHeight(vh)))
    // Asymmetric first impression: identity left, work right; later windows cascade.
    // Projects stops short of the widget column on the right (WIDGET_COLUMN_W).
    const anchorX = id === "about" ? 72 : id === "projects" ? vw - width - reserved : (vw - width) / 2 + index * 36
    const anchorY = id === "about" ? MENU_BAR_H + 40 : id === "projects" ? MENU_BAR_H + 88 : MENU_BAR_H + 56 + index * 28
    return {x: clampX(anchorX, width), y: clampY(anchorY), w: width, h: height}
}

function initState(): WindowManagerState {
    const windows: Partial<Record<AppId, WindowState>> = {}
    let topZ = 2
    let stored: Partial<Record<AppId, Partial<WindowState>>> | null = null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) stored = JSON.parse(raw)
    } catch {
        stored = null
    }
    for (const [i, id] of (["about", "projects"] as AppId[]).entries()) {
        const rect = defaultRect(id, i)
        const saved = stored?.[id]
        const base =
            saved && !saved.maximized && typeof saved.x === "number"
                ? {x: saved.x, y: saved.y!, w: saved.w!, h: saved.h!}
                : rect
        windows[id] = {
            id,
            ...base,
            z: topZ++,
            minimized: false,
            maximized: false,
            restoreRect: null,
        }
    }
    return {windows, topZ, activeId: "projects"}
}

function reducer(state: WindowManagerState, action: WindowAction): WindowManagerState {
    switch (action.type) {
        case "open": {
            const existing = state.windows[action.id]
            const topZ = state.topZ + 1
            if (existing) {
                return {
                    ...state,
                    topZ,
                    activeId: action.id,
                    windows: {...state.windows, [action.id]: {...existing, minimized: false, z: topZ}},
                }
            }
            const count = Object.keys(state.windows).length
            return {
                ...state,
                topZ,
                activeId: action.id,
                windows: {
                    ...state.windows,
                    [action.id]: {
                        id: action.id,
                        ...defaultRect(action.id, count),
                        z: topZ,
                        minimized: false,
                        maximized: false,
                        restoreRect: null,
                    },
                },
            }
        }
        case "close-all":
            return {...state, windows: {}, activeId: null}
        case "launch": {
            // Dock semantics: clicking the active app's icon minimizes it (macOS),
            // anything else opens or restores. Lives in the reducer so the dock
            // can hold a stable dispatch-only callback (no stale closures).
            const win = state.windows[action.id]
            if (win && !win.minimized && state.activeId === action.id) {
                return reducer(state, {type: "minimize", id: action.id})
            }
            return reducer(state, {type: "open", id: action.id})
        }
        case "fit-viewport": {
            // Browser resized: keep every window reachable and no larger than the screen.
            const vw = window.innerWidth
            const vh = window.innerHeight
            const windows: Partial<Record<AppId, WindowState>> = {}
            let changed = false
            for (const win of Object.values(state.windows)) {
                if (!win) continue
                let next: WindowState
                if (win.maximized) {
                    next = {...win, x: 0, y: MENU_BAR_H, w: vw, h: vh - MENU_BAR_H - DOCK_AREA_H}
                } else {
                    const w = Math.min(win.w, vw - 24)
                    const h = Math.min(win.h, usableHeight(vh))
                    next = {...win, w, h, x: clampX(Math.min(win.x, vw - w - 12), w), y: clampY(win.y)}
                }
                const same = next.x === win.x && next.y === win.y && next.w === win.w && next.h === win.h
                if (!same) changed = true
                windows[win.id] = same ? win : next
            }
            // Bail out with the same reference when nothing moved: a resize storm
            // (window drag, DevTools, mobile URL bar) must not re-render anything.
            return changed ? {...state, windows} : state
        }
        case "close": {
            const windows = {...state.windows}
            delete windows[action.id]
            const remaining = Object.values(windows).sort((a, b) => b!.z - a!.z)
            return {
                ...state,
                windows,
                activeId: state.activeId === action.id ? (remaining[0]?.id ?? null) : state.activeId,
            }
        }
        case "minimize": {
            const win = state.windows[action.id]
            if (!win) return state
            const remaining = Object.entries(state.windows)
                .filter(([id]) => id !== action.id && !state.windows[id as AppId]!.minimized)
                .map(([, w]) => w!)
                .sort((a, b) => b.z - a.z)
            return {
                ...state,
                activeId: remaining[0]?.id ?? null,
                windows: {...state.windows, [action.id]: {...win, minimized: true}},
            }
        }
        case "restore": {
            const win = state.windows[action.id]
            if (!win) return state
            const topZ = state.topZ + 1
            return {
                ...state,
                topZ,
                activeId: action.id,
                windows: {...state.windows, [action.id]: {...win, minimized: false, z: topZ}},
            }
        }
        case "toggle-maximize": {
            const win = state.windows[action.id]
            if (!win) return state
            const topZ = state.topZ + 1
            if (win.maximized && win.restoreRect) {
                return {
                    ...state,
                    topZ,
                    windows: {
                        ...state.windows,
                        [action.id]: {...win, ...win.restoreRect, maximized: false, restoreRect: null, z: topZ},
                    },
                }
            }
            return {
                ...state,
                topZ,
                windows: {
                    ...state.windows,
                    [action.id]: {
                        ...win,
                        restoreRect: {x: win.x, y: win.y, w: win.w, h: win.h},
                        x: 0,
                        y: MENU_BAR_H,
                        w: window.innerWidth,
                        h: window.innerHeight - MENU_BAR_H - DOCK_AREA_H,
                        maximized: true,
                        z: topZ,
                    },
                },
            }
        }
        case "focus": {
            const win = state.windows[action.id]
            if (!win || (state.activeId === action.id && win.z === state.topZ)) return state
            const topZ = state.topZ + 1
            return {
                ...state,
                topZ,
                activeId: action.id,
                windows: {...state.windows, [action.id]: {...win, z: topZ, minimized: false}},
            }
        }
        case "move": {
            const win = state.windows[action.id]
            if (!win) return state
            return {
                ...state,
                windows: {...state.windows, [action.id]: {...win, x: action.x, y: action.y, maximized: false, restoreRect: null}},
            }
        }
        case "resize": {
            const win = state.windows[action.id]
            if (!win) return state
            return {
                ...state,
                windows: {
                    ...state.windows,
                    [action.id]: {
                        ...win,
                        w: Math.max(340, action.w),
                        h: Math.max(260, action.h),
                        maximized: false,
                        restoreRect: null,
                    },
                },
            }
        }
    }
}

interface WindowManagerContextValue {
    state: WindowManagerState
    dispatch: React.Dispatch<WindowAction>
}

// Two contexts: components that only dispatch (windows with their own stable
// handlers) subscribe to the never-changing dispatch context and skip
// re-rendering whenever unrelated window state changes.
const WindowStateContext = createContext<WindowManagerState | null>(null)
const WindowDispatchContext = createContext<React.Dispatch<WindowAction> | null>(null)

export function WindowManagerProvider({children}: {children: ReactNode}) {
    const [state, dispatch] = useReducer(reducer, undefined, initState)

    useEffect(() => {
        // Debounced: browser resize fires continuously while dragging the window
        // edge (and when mobile toolbars show/hide). Fitting per event caused a
        // full re-render storm; trailing debounce settles it once.
        let id: ReturnType<typeof setTimeout> | null = null
        const fit = () => {
            if (id) clearTimeout(id)
            id = setTimeout(() => dispatch({type: "fit-viewport"}), 120)
        }
        dispatch({type: "fit-viewport"}) // saved layouts may come from a bigger screen
        window.addEventListener("resize", fit)
        return () => {
            if (id) clearTimeout(id)
            window.removeEventListener("resize", fit)
        }
    }, [])

    // Best-effort layout persistence, debounced so the synchronous localStorage
    // write never lands in the same frame as an open/focus animation.
    useEffect(() => {
        const id = setTimeout(() => {
            try {
                const persistable: Partial<Record<AppId, Partial<WindowState>>> = {}
                for (const win of Object.values(state.windows)) {
                    if (!win) continue
                    const rect = win.maximized && win.restoreRect ? win.restoreRect : {x: win.x, y: win.y, w: win.w, h: win.h}
                    persistable[win.id] = {...rect, maximized: win.maximized}
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
            } catch {
                /* noop */
            }
        }, PERSIST_DEBOUNCE_MS)
        return () => clearTimeout(id)
    }, [state.windows])

    return (
        <WindowDispatchContext.Provider value={dispatch}>
            <WindowStateContext.Provider value={state}>{children}</WindowStateContext.Provider>
        </WindowDispatchContext.Provider>
    )
}

export function useWindowState(): WindowManagerState {
    const state = useContext(WindowStateContext)
    if (!state) throw new Error("useWindowState must be used inside WindowManagerProvider")
    return state
}

export function useWindowDispatch(): React.Dispatch<WindowAction> {
    const dispatch = useContext(WindowDispatchContext)
    if (!dispatch) throw new Error("useWindowDispatch must be used inside WindowManagerProvider")
    return dispatch
}

export function useWindowManager(): WindowManagerContextValue {
    return {state: useWindowState(), dispatch: useWindowDispatch()}
}
