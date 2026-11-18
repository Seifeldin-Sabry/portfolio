"use client"

import {useState} from "react"
import Link from "next/link"
import {Menu, X} from "lucide-react"

import ThemeToggle from "@/components/site/theme-toggle"
import {NAV, PROFILE} from "@/lib/site"

export default function Header() {
    const [open, setOpen] = useState(false)
    return (
        <header className="sticky top-0 z-30 border-b border-transparent bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="text-sm font-semibold tracking-tight" onClick={() => setOpen(false)}>
                    {PROFILE.name}
                </Link>
                <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
                    {NAV.map((item) => (
                        <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                            {item.label}
                        </Link>
                    ))}
                    <ThemeToggle/>
                </nav>
                <div className="flex items-center gap-1 md:hidden">
                    <ThemeToggle/>
                    <button onClick={() => setOpen((v) => !v)} className="rounded-md p-2" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}>
                        {open ? <X size={18}/> : <Menu size={18}/>}
                    </button>
                </div>
            </div>
            {open && (
                <nav id="mobile-nav" className="border-b bg-background px-4 pb-3 md:hidden" aria-label="Main">
                    {NAV.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-border/60 py-3 text-base last:border-0">
                            {item.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}
