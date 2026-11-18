"use client"

import {Sparkles} from "lucide-react"

import {useAssistant} from "@/components/assistant/assistant-provider"
import {cn} from "@/lib/utils"

/** Opens the assistant, optionally asking a question right away. */
export default function AskButton({question, children, className}: {question?: string; children: React.ReactNode; className?: string}) {
    const {ask, open} = useAssistant()
    return (
        <button onClick={() => (question ? ask(question) : open())} className={cn("inline-flex items-center gap-2", className)}>
            <Sparkles size={15} aria-hidden/>
            {children}
        </button>
    )
}
