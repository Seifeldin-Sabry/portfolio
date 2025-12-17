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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface BlogSearchFilterProps {
    availableTags: string[]
    selectedTags: string[]
    onTagsChange: (tags: string[]) => void
    selectedDateRange: { from: string; to: string } | null
    onDateRangeChange: (range: { from: string; to: string } | null) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    onClearAll: () => void
}

export function BlogSearchFilter({
    availableTags,
    selectedTags,
    onTagsChange,
    selectedDateRange,
    onDateRangeChange,
    searchQuery,
    onSearchChange,
    onClearAll,
}: BlogSearchFilterProps) {
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [tagSearch, setTagSearch] = useState("")

    const activeFilterCount =
        selectedTags.length + (selectedDateRange ? 1 : 0) + (searchQuery ? 1 : 0)

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
        onClearAll()
        setFromDate("")
        setToDate("")
        setTagSearch("")
    }

    useEffect(() => {
        if (!selectedDateRange) {
            setFromDate("")
            setToDate("")
        }
    }, [selectedDateRange])

    // Filter content component (reusable for both mobile and desktop)
    const FilterContent = () => (
        <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Search Posts</label>
                </div>
                <div className="relative">
                    <Input
                        placeholder="Search by title, content, or tags..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pr-10"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <Separator />

            {/* Tags Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Filter by Tags</label>
                    {selectedTags.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                            {selectedTags.length}
                        </Badge>
                    )}
                </div>

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

            <Separator />

            {/* Date Range Section */}
            <div className="space-y-3">
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

            {/* Clear All Section */}
            {activeFilterCount > 0 && (
                <>
                    <Separator />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="w-full"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                    </Button>
                </>
            )}
        </div>
    )

    return (
        <div className="space-y-3">
            {/* Mobile View: Sheet (slides from bottom) */}
            <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full gap-2 relative transition-all duration-200 hover:border-primary"
                        >
                            <Search className="h-4 w-4" />
                            <span>Search & Filter</span>
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
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                        <SheetHeader className="text-left">
                            <SheetTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Search & Filter Posts
                            </SheetTitle>
                            <SheetDescription>
                                Search and filter blog posts by keywords, tags, and date range
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop View: Popover */}
            <div className="hidden md:block">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="gap-2 relative transition-all duration-200 hover:border-primary"
                        >
                            <Search className="h-4 w-4" />
                            <span>Search & Filter</span>
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
                        className="w-96 p-0"
                        align="start"
                        sideOffset={8}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">Search & Filter</h3>
                                </div>
                            </div>
                            <FilterContent />
                        </motion.div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Active Filters Display */}
            <AnimatePresence>
                {activeFilterCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2 items-center"
                    >
                        <span className="text-xs text-muted-foreground">Active filters:</span>
                        {searchQuery && (
                            <Badge
                                variant="secondary"
                                className="gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                                onClick={() => onSearchChange("")}
                            >
                                <Search className="h-3 w-3" />
                                {searchQuery.length > 20 ? searchQuery.slice(0, 20) + "..." : searchQuery}
                                <X className="h-3 w-3" />
                            </Badge>
                        )}
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
