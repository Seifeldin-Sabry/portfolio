"use client"

import {motion, useReducedMotion} from "framer-motion"
import {Briefcase, Code2, ShieldCheck, Rocket, type LucideIcon} from "lucide-react"
import type {AppId} from "@/components/apps/registry"
import {useClock} from "@/components/desktop/menu-bar"
import {Z_INDEX} from "@/lib/constants"

export interface Persona {
    id: string
    label: string
    hint: string
    icon: LucideIcon
    tint: string
    /** windows to open, last one focused */
    apps: AppId[]
}

/**
 * macOS-style user picker shown once, on a visitor's first desktop visit.
 * It's segmentation dressed as an OS feature: each "user" lands on the
 * windows that matter to them, and the choice tells Seif who visits.
 */
export const PERSONAS: Persona[] = [
    {id: "mssp", label: "MSSP founder", hint: "I need pipeline", icon: ShieldCheck, tint: "from-amber-300 to-orange-600", apps: ["tools", "services"]},
    {id: "founder", label: "Founder / CTO", hint: "I need software or automation", icon: Rocket, tint: "from-violet-400 to-indigo-600", apps: ["lab", "services"]},
    {id: "recruiter", label: "Recruiter", hint: "I'm hiring", icon: Briefcase, tint: "from-sky-400 to-blue-600", apps: ["experience", "about"]},
    {id: "engineer", label: "Engineer", hint: "Show me the code", icon: Code2, tint: "from-zinc-500 to-zinc-800", apps: ["projects", "lab"]},
]

export default function LoginScreen({onChoose}: {onChoose: (persona: Persona | null) => void}) {
    const now = useClock()
    const reduce = useReducedMotion()

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0, scale: reduce ? 1 : 1.03}}
            transition={{duration: 0.35, ease: "easeOut"}}
            className="fixed inset-0 flex flex-col items-center bg-black/40 backdrop-blur-2xl [&_p]:mb-0"
            style={{zIndex: Z_INDEX.OVERLAY}}
            role="dialog"
            aria-label="Choose who you are"
        >
            <div className="mt-[9vh] text-center">
                <p className="text-lg font-medium text-foreground/80">
                    {now?.toLocaleDateString("en-GB", {weekday: "long", day: "numeric", month: "long"}) ?? " "}
                </p>
                <p className="text-[96px] font-semibold leading-none tracking-tight tabular-nums">
                    {now?.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"}) ?? " "}
                </p>
            </div>

            <div className="mt-auto mb-[14vh] flex flex-col items-center">
                <p className="mb-6 text-sm text-foreground/80">Who&apos;s visiting?</p>
                <div className="flex gap-10">
                    {PERSONAS.map((p, i) => (
                        <motion.button
                            key={p.id}
                            initial={reduce ? false : {opacity: 0, y: 12}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.1 + i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
                            onClick={() => onChoose(p)}
                            className="group flex w-28 flex-col items-center gap-2 outline-none"
                        >
                            <span className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b ${p.tint} text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] ring-0 ring-white/60 transition-all group-hover:scale-105 group-hover:ring-2 group-focus-visible:ring-2`}>
                                <p.icon size={32} strokeWidth={1.6}/>
                            </span>
                            <span className="text-sm font-medium">{p.label}</span>
                            <span className="text-[11px] text-foreground/60">{p.hint}</span>
                        </motion.button>
                    ))}
                </div>
                <button onClick={() => onChoose(null)} className="mt-8 text-xs text-foreground/60 underline-offset-4 hover:text-foreground hover:underline">
                    Just browsing
                </button>
            </div>
        </motion.div>
    )
}
