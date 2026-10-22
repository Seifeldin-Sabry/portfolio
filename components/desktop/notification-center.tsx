"use client"

import {useEffect, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {X} from "lucide-react"
import {APP_META, type AppId} from "@/components/apps/registry"
import {SHIPPED} from "@/components/desktop/widgets"
import {Z_INDEX} from "@/lib/constants"

interface Notice {
    id: string
    app: AppId
    title: string
    body: string
    time: string
}

const NOTICES: Notice[] = [
    {id: "assistant", app: "assistant", title: "Assistant", body: "Ask me anything about Seif's work, e.g. “What did he build at QFacts?”", time: "now"},
    {id: "games", app: "games", title: "Games", body: "Minesweeper, Snake and Tic-tac-toe are installed. Beat the clock.", time: "now"},
    {id: "lab", app: "lab", title: "Lab", body: "Live eval scores from CI: knowledge, guardrail and agentic gates.", time: "today"},
]

const TOAST_DELAY_MS = 2500
const TOAST_VISIBLE_MS = 7000

/** One macOS-style banner shortly after boot; also listed in the centre. */
export function BootToast({onOpen}: {onOpen: (id: AppId) => void}) {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const show = setTimeout(() => setVisible(true), TOAST_DELAY_MS)
        const hide = setTimeout(() => setVisible(false), TOAST_DELAY_MS + TOAST_VISIBLE_MS)
        return () => (clearTimeout(show), clearTimeout(hide))
    }, [])
    const notice = NOTICES[0]
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{opacity: 0, x: 40}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 40}}
                    transition={{type: "spring", stiffness: 380, damping: 34}}
                    className="fixed right-3 top-10 w-[344px]"
                    style={{zIndex: Z_INDEX.OVERLAY}}
                >
                    <NoticeCard
                        notice={notice}
                        onOpen={() => (setVisible(false), onOpen(notice.app))}
                        onDismiss={() => setVisible(false)}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function NotificationCenter({open, onClose, onOpen}: {open: boolean; onClose: () => void; onOpen: (id: AppId) => void}) {
    const [dismissed, setDismissed] = useState<string[]>([])
    const notices = NOTICES.filter((n) => !dismissed.includes(n.id))

    return (
        <AnimatePresence>
            {open && (
                <>
                    <div className="fixed inset-0" style={{zIndex: Z_INDEX.OVERLAY - 1}} onPointerDown={onClose}/>
                    <motion.aside
                        initial={{opacity: 0, x: 24}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 24}}
                        transition={{type: "spring", stiffness: 380, damping: 36}}
                        className="fixed bottom-24 right-3 top-10 flex w-[372px] flex-col gap-2 overflow-y-auto rounded-[24px] border border-foreground/[0.08] bg-black/45 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-3xl [&_p]:mb-0"
                        style={{zIndex: Z_INDEX.OVERLAY}}
                        aria-label="Notification centre"
                    >
                        <div className="flex items-center justify-between px-2 pt-1">
                            <p className="text-[13px] font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">Notifications</p>
                            {notices.length > 0 && (
                                <button onClick={() => setDismissed(NOTICES.map((n) => n.id))} className="text-[11px] text-muted-foreground hover:text-foreground">
                                    Clear all
                                </button>
                            )}
                        </div>
                        {notices.map((n) => (
                            <NoticeCard
                                key={n.id}
                                notice={n}
                                onOpen={() => (onClose(), onOpen(n.app))}
                                onDismiss={() => setDismissed((d) => [...d, n.id])}
                            />
                        ))}
                        {notices.length === 0 && <p className="px-2 text-[12px] text-muted-foreground">No new notifications</p>}

                        <p className="mt-3 px-2 text-[13px] font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">Today</p>
                        <div className="rounded-[18px] border border-foreground/[0.08] bg-window-chrome/95 p-4 backdrop-blur-2xl">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Shipping at Qfacts</p>
                            <ul className="mt-2 space-y-2">
                                {SHIPPED.map((item) => (
                                    <li key={item.title}>
                                        <p className="text-[13px] font-medium">{item.title}</p>
                                        <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}

function NoticeCard({notice, onOpen, onDismiss}: {notice: Notice; onOpen: () => void; onDismiss: () => void}) {
    const Icon = APP_META[notice.app].icon
    return (
        <div className="group relative rounded-[18px] border border-foreground/[0.08] bg-window-chrome/95 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            <button onClick={onOpen} className="flex w-full items-start gap-3 p-3 text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent/15 text-accent">
                    <Icon size={18} strokeWidth={1.7}/>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between">
                        <span className="text-[13px] font-semibold">{notice.title}</span>
                        <span className="text-[11px] text-muted-foreground">{notice.time}</span>
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-foreground/80">{notice.body}</span>
                </span>
            </button>
            <button
                onClick={onDismiss}
                aria-label="Dismiss notification"
                className="absolute -left-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full border border-foreground/15 bg-window-chrome text-muted-foreground hover:text-foreground group-hover:flex"
            >
                <X size={10} strokeWidth={2.5}/>
            </button>
        </div>
    )
}
