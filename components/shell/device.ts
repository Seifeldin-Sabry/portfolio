"use client"

import {useSyncExternalStore} from "react"

const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)"

function subscribe(onChange: () => void) {
    const mql = window.matchMedia(DESKTOP_QUERY)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
}

function getSnapshot(): boolean {
    return window.matchMedia(DESKTOP_QUERY).matches
}

/** null on the server and during first hydration pass: shell stays on the boot screen until resolved. */
function getServerSnapshot(): boolean | null {
    return null
}

export function useDesktopOS(): boolean | null {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
