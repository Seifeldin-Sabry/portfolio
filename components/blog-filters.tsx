"use client"

import { useState, useEffect, useMemo } from "react"
import { Filter, X, Calendar, Tag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface BlogFiltersProps {
    availableTags: string[]
    selectedTags: string[]
    onTagsChange: (tags: string[]) => void
    selectedDateRange: { from: string; to: string } | null
    onDateRangeChange: (range: { from: string; to: string } | null) => void
    onClearFilters: () => void
}

export function BlogFilters({
    availableTags,
    selectedTags,
    onTagsChange,
    selectedDateRange,
    onDateRangeChange,
    onClearFilters,
}: BlogFiltersProps) {
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [tagSearch, setTagSearch] = useState("")

    const activeFilterCount =
        selectedTags.length + (selectedDateRange ? 1 : 0)

    // Filter tags based on search
    const filteredTags = useMemo(() => {
        if (!tagSearch) return availableTags
        return availableTags.filter(tag =>
            tag.toLowerCase().includes(tagSearch.toLowerCase())
        )
    }, [availableTags, tagSearch])

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter((t) => t !== tag))
        } else {
            onTagsChange([...selectedTags, tag])
        }
    }

    const applyDateFilter = () => {
        if (fromDate || toDate) {
            onDateRangeChange({
                from: fromDate || "",
                to: toDate || "",
            })
        } else {
            onDateRangeChange(null)
        }
    }

    const handleClearAll = () => {
        onClearFilters()
        setFromDate("")
        setToDate("")
    }

    useEffect(() => {
        if (!selectedDateRange) {
            setFromDate("")
            setToDate("")
        }
    }, [selectedDateRange])

    return (
        <div className="mb-6">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="gap-2 relative transition-all duration-200 hover:border-primary"
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filters</span>
                        <AnimatePresence>
                            {activeFilterCount > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                                >
                                    {activeFilterCount}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[calc(100vw-2rem)] sm:w-96 p-0"
                    align="start"
                    sideOffset={8}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 space-y-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold">Filter Posts</h3>
                            </div>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="h-8 text-xs"
                                >
                                    Clear all
                                </Button>
                            )}
                        </div>

                        {/* Tags Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <label className="text-sm font-medium">Tags</label>
                                {selectedTags.length > 0 && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {selectedTags.length}
                                    </Badge>
                                )}
                            </div>

                            {/* Search and multi-select dropdown for all tags */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search tags..."
                                        value={tagSearch}
                                        onChange={(e) => setTagSearch(e.target.value)}
                                        className="pl-9 h-9"
                                    />
                                </div>
                                <ScrollArea className="h-[200px] rounded-md border p-3">
                                    <div className="space-y-2">
                                        {filteredTags.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                No tags found
                                            </p>
                                        ) : (
                                            filteredTags.map((tag) => (
                                                <div
                                                    key={tag}
                                                    className="flex items-center space-x-2 hover:bg-accent p-2 rounded-md cursor-pointer transition-colors"
                                                    onClick={() => toggleTag(tag)}
                                                >
                                                    <Checkbox
                                                        id={`tag-${tag}`}
                                                        checked={selectedTags.includes(tag)}
                                                        onCheckedChange={() => toggleTag(tag)}
                                                    />
                                                    <label
                                                        htmlFor={`tag-${tag}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                                    >
                                                        {tag}
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>

                        {/* Date Range Section */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <label className="text-sm font-medium">Date Range</label>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-muted-foreground">From</label>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-muted-foreground">To</label>
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={applyDateFilter}
                                        className="flex-1"
                                    >
                                        Apply Date Filter
                                    </Button>
                                    {selectedDateRange && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                onDateRangeChange(null)
                                                setFromDate("")
                                                setToDate("")
                                            }}
                                            className="px-3"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </PopoverContent>
            </Popover>

            {/* Active Filters Display */}
            <AnimatePresence>
                {activeFilterCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex flex-wrap gap-2 items-center"
                    >
                        <span className="text-xs text-muted-foreground">Active filters:</span>
                        {selectedTags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                                onClick={() => toggleTag(tag)}
                            >
                                {tag}
                                <X className="h-3 w-3" />
                            </Badge>
                        ))}
                        {selectedDateRange && (
                            <Badge
                                variant="secondary"
                                className="gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                                onClick={() => onDateRangeChange(null)}
                            >
                                <Calendar className="h-3 w-3" />
                                Date filter
                                <X className="h-3 w-3" />
                            </Badge>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
