"use client"

import {useEffect, useState} from "react"

type Op = "+" | "−" | "×" | "÷"

function apply(a: number, b: number, op: Op): number {
    switch (op) {
        case "+":
            return a + b
        case "−":
            return a - b
        case "×":
            return a * b
        case "÷":
            return b === 0 ? NaN : a / b
    }
}

/** Trims float noise (0.1 + 0.2) and keeps the display short. */
function format(n: number): string {
    if (!Number.isFinite(n)) return "Error"
    return String(Number.parseFloat(n.toPrecision(12)))
}

const KEYS: string[][] = [
    ["AC", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
]
const OPS = new Set(["+", "−", "×", "÷"])
const KEYBOARD: Record<string, string> = {"*": "×", "/": "÷", "-": "−", "+": "+", Enter: "=", "=": "=", Escape: "AC", Backspace: "AC", "%": "%", ".": "."}

export default function CalculatorApp() {
    const [display, setDisplay] = useState("0")
    const [stored, setStored] = useState<number | null>(null)
    const [op, setOp] = useState<Op | null>(null)
    const [fresh, setFresh] = useState(true)

    const press = (key: string) => {
        const current = Number.parseFloat(display)
        if (/^\d$/.test(key)) {
            setDisplay(fresh || display === "0" ? key : (display + key).slice(0, 14))
            setFresh(false)
        } else if (key === ".") {
            if (fresh) setDisplay("0.")
            else if (!display.includes(".")) setDisplay(display + ".")
            setFresh(false)
        } else if (key === "AC") {
            setDisplay("0")
            setStored(null)
            setOp(null)
            setFresh(true)
        } else if (key === "±") {
            setDisplay(format(-current))
        } else if (key === "%") {
            setDisplay(format(current / 100))
        } else if (OPS.has(key)) {
            // Chained ops evaluate left to right, like a pocket calculator.
            if (stored !== null && op && !fresh) {
                const result = apply(stored, current, op)
                setDisplay(format(result))
                setStored(result)
            } else setStored(current)
            setOp(key as Op)
            setFresh(true)
        } else if (key === "=" && stored !== null && op) {
            setDisplay(format(apply(stored, current, op)))
            setStored(null)
            setOp(null)
            setFresh(true)
        }
    }

    // Keyboard support only while this window holds focus.
    const [focused, setFocused] = useState(false)
    useEffect(() => {
        if (!focused) return
        const onKey = (e: KeyboardEvent) => {
            const key = /^\d$/.test(e.key) ? e.key : KEYBOARD[e.key]
            if (key) {
                e.preventDefault()
                press(key)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    })

    return (
        <div
            tabIndex={0}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex h-full flex-col bg-secondary/40 p-3 outline-none"
        >
            <div className="flex flex-1 flex-col items-end justify-end px-2 pb-3">
                <p className="h-4 font-mono text-[11px] text-muted-foreground">{stored !== null && op ? `${format(stored)} ${op}` : ""}</p>
                <p className="truncate text-5xl font-light tabular-nums" aria-live="polite">{display}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {KEYS.flat().map((key) => (
                    <button
                        key={key}
                        onClick={() => press(key)}
                        className={`h-12 rounded-full text-lg font-medium transition-colors active:brightness-125 ${
                            key === "0" ? "col-span-2" : ""
                        } ${
                            OPS.has(key) || key === "="
                                ? op === key && fresh
                                    ? "bg-foreground text-background"
                                    : "bg-accent text-accent-foreground hover:brightness-110"
                                : ["AC", "±", "%"].includes(key)
                                    ? "bg-foreground/20 hover:bg-foreground/30"
                                    : "bg-foreground/[0.08] hover:bg-foreground/15"
                        }`}
                    >
                        {key}
                    </button>
                ))}
            </div>
        </div>
    )
}
