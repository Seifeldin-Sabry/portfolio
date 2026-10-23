"use client"

import {useState, type ReactNode} from "react"

/** Segmented tabs for apps that group several views in one window (Work, Assistant, Games). */
export default function Tabs<T extends string>({
    tabs,
    children,
}: {
    tabs: {id: T; label: string}[]
    children: (active: T) => ReactNode
}) {
    const [active, setActive] = useState<T>(tabs[0].id)
    return (
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 justify-center gap-1 border-b border-window-border p-2" role="tablist">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        role="tab"
                        aria-selected={active === t.id}
                        onClick={() => setActive(t.id)}
                        className={`rounded-md px-3 py-1 text-xs font-medium ${
                            active === t.id ? "bg-foreground/15 text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="relative min-h-0 flex-1">{children(active)}</div>
        </div>
    )
}
