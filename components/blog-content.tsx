"use client"

import {cn} from "@/lib/utils"

interface BlogContentProps {
    content: string
    className?: string
}

export function BlogContent({content, className}: BlogContentProps) {
    return <div className={cn("blog-content", className)} dangerouslySetInnerHTML={{__html: content}} />
}