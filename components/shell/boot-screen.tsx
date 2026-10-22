"use client"

import {useEffect, useState} from "react"
import Image from "next/image"
import {motion, useReducedMotion} from "framer-motion"
import {Z_INDEX} from "@/lib/constants"

const BOOT_LINES = [
    "kernel: portfolio-core ... ok",
    "mounting projects ... ok",
    "starting assistant ... ok",
    "ready",
]

const LINE_INTERVAL_MS = 320
const MOBILE_SPLASH_MS = 900

export default function BootScreen({mode, onDone}: {mode: "desktop" | "mobile"; onDone: () => void}) {
    const reduce = useReducedMotion()
    const [visibleLines, setVisibleLines] = useState(0)

    useEffect(() => {
        if (mode === "mobile" || reduce) {
            const t = setTimeout(onDone, reduce ? 250 : MOBILE_SPLASH_MS)
            return () => clearTimeout(t)
        }
        if (visibleLines >= BOOT_LINES.length) {
            const t = setTimeout(onDone, 350)
            return () => clearTimeout(t)
        }
        const t = setTimeout(() => setVisibleLines((n) => n + 1), LINE_INTERVAL_MS)
        return () => clearTimeout(t)
    }, [mode, reduce, visibleLines, onDone])

    return (
        <motion.div
            initial={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.45, ease: "easeOut"}}
            className="fixed inset-0 flex flex-col items-center justify-center bg-wallpaper"
            style={{zIndex: Z_INDEX.BOOT}}
        >
            <motion.div
                initial={reduce ? false : {opacity: 0, scale: 0.92}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
                className="flex flex-col items-center"
            >
                <Image
                    src="/assets/logos/brand-mark.svg"
                    alt=""
                    width={56}
                    height={56}
                    className="mb-4 opacity-90"
                />
                <p className="text-sm font-medium tracking-tight">Seif</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {mode === "desktop" ? "seif-os" : "software engineer & founder"}
                </p>
            </motion.div>

            {mode === "desktop" && (
                <div className="mt-8 h-16 w-[min(20rem,70vw)]">
                    {BOOT_LINES.map((line, i) => (
                        <p
                            key={line}
                            className="font-mono text-[10px] text-muted-foreground transition-opacity duration-300"
                            style={{opacity: i < visibleLines ? 1 : 0}}
                        >
                            {line}
                        </p>
                    ))}
                </div>
            )}
        </motion.div>
    )
}
