import type {Metric} from "@/lib/content-types"
import {cn} from "@/lib/utils"

export default function MetricGrid({metrics, showSource = false, className}: {metrics: Metric[]; showSource?: boolean; className?: string}) {
    if (!metrics.length) return null
    return (
        <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3", className)}>
            {metrics.map((m) => (
                <div key={m.label} className="bg-card p-4">
                    <dt className="sr-only">{m.label}</dt>
                    <dd className="text-2xl font-semibold tracking-tight">{m.value}</dd>
                    <dd className="mt-1 text-sm text-muted-foreground">{m.label}</dd>
                    {showSource && m.source && <dd className="mt-1 text-xs text-muted-foreground/80">{m.source}</dd>}
                </div>
            ))}
        </dl>
    )
}
