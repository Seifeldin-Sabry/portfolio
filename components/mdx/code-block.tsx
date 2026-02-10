"use client"

import {useState, useRef, useEffect, type ComponentProps} from "react"
import {Check, Copy} from "lucide-react"

export function CodeBlock({children, ...props}: ComponentProps<"pre">) {
    const preRef = useRef<HTMLPreElement>(null)
    const [copied, setCopied] = useState(false)
    const [language, setLanguage] = useState("")
    const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

    useEffect(() => {
        const code = preRef.current?.querySelector("code")
        if (code) {
            setLanguage(code.getAttribute("data-language") || "")
        }
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
        }
    }, [])

    const copyCode = () => {
        const code = preRef.current?.textContent || ""
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true)
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
            copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
        }).catch(() => {
            setCopied(false)
        })
    }

    return (
        <div className="relative group my-4 rounded-lg overflow-hidden border border-border">
            {/* Header bar with language and copy button */}
            <div className="flex items-center justify-between px-4 py-2 bg-[hsl(0,0%,8%)] border-b border-border">
                {language ? (
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        {language}
                    </span>
                ) : (
                    <span />
                )}
                <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-accent"/>
                            <span className="text-accent">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14}/>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            {/* Code content */}
            <pre ref={preRef} {...props} className="!mt-0 !rounded-t-none !border-0">
                {children}
            </pre>
        </div>
    )
}
