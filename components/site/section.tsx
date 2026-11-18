import {cn} from "@/lib/utils"

export function Section({id, eyebrow, title, intro, children, className}: {id?: string; eyebrow?: string; title: string; intro?: React.ReactNode; children: React.ReactNode; className?: string}) {
    return (
        <section id={id} className={cn("mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20", className)}>
            <div className="mb-10 max-w-2xl">
                {eyebrow && <p className="mb-2 text-sm font-medium text-accent">{eyebrow}</p>}
                <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
                {intro && <div className="mt-3 text-muted-foreground">{intro}</div>}
            </div>
            {children}
        </section>
    )
}

export function Tag({children}: {children: React.ReactNode}) {
    return <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{children}</span>
}
