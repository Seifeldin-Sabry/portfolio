"use client"

import {useEffect, useState} from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

export default function ThemeToggle() {
    const {resolvedTheme, setTheme} = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const dark = mounted && resolvedTheme === "dark"
    return (
        <button
            onClick={() => setTheme(dark ? "light" : "dark")}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        >
            {dark ? <Sun size={16}/> : <Moon size={16}/>}
        </button>
    )
}
