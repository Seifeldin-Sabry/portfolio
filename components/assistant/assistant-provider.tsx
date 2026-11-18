"use client"

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react"
import {useChat} from "@ai-sdk/react"
import {DefaultChatTransport} from "ai"

import {AGENT_URL} from "@/lib/agent"
import AssistantPanel from "@/components/assistant/assistant-panel"

type Chat = ReturnType<typeof useChat>

interface AssistantContextValue {
    chat: Chat
    isOpen: boolean
    open: () => void
    close: () => void
    /** Opens the panel and sends the question straight away. */
    ask: (question: string) => void
    reset: () => void
}

const AssistantContext = createContext<AssistantContextValue | null>(null)

export function useAssistant() {
    const value = useContext(AssistantContext)
    if (!value) throw new Error("useAssistant must be used inside AssistantProvider")
    return value
}

/**
 * Holds one conversation for the whole visit, so it survives navigating
 * between pages, and renders the floating panel on every page.
 */
export default function AssistantProvider({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(false)
    const transport = useMemo(() => new DefaultChatTransport({api: `${AGENT_URL}/chat`}), [])
    const chat = useChat({transport})

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])

    const ask = useCallback(
        (question: string) => {
            const text = question.trim()
            setIsOpen(true)
            if (!text || chat.status === "submitted" || chat.status === "streaming") return
            void chat.sendMessage({text})
        },
        [chat],
    )

    const reset = useCallback(() => {
        void chat.stop()
        chat.clearError()
        chat.setMessages([])
    }, [chat])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null
            const typing = target?.closest("input, textarea, [contenteditable=true]")
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
                e.preventDefault()
                setIsOpen((v) => !v || e.key === "/")
            } else if (e.key === "Escape") {
                setIsOpen(false)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    const value = useMemo(() => ({chat, isOpen, open, close, ask, reset}), [chat, isOpen, open, close, ask, reset])

    return (
        <AssistantContext.Provider value={value}>
            {children}
            <AssistantPanel/>
        </AssistantContext.Provider>
    )
}
