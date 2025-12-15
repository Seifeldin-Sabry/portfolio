"use client"

import type React from "react"
import {useState} from "react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Search, X} from "lucide-react"

interface BlogSearchProps {
    onSearch: (query: string) => void
}

export function BlogSearch({onSearch}: BlogSearchProps) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    const handleClear = () => {
        setQuery("")
        onSearch("")
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <div className="relative flex-grow">
                <Input
                    type="text"
                    placeholder="Search blog posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-10"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            <Button type="submit">
                <Search size={18} className="mr-2" /> Search
            </Button>
        </form>
    )
}
