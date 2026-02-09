"use client"

import {useState} from "react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Menu, X} from "lucide-react"

const navLinks = [
    {href: "/#projects", label: "Projects"},
    {href: "/#experience", label: "Experience"},
    {href: "/#blog", label: "Blog"},
]

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between px-4 max-w-4xl mx-auto">
                {/* Logo */}
                <Link 
                    href="/" 
                    className="font-bold text-lg tracking-tight hover:text-accent transition-colors duration-300"
                >
                    <span className="font-mono text-accent">&gt;</span> Seif-DX
                </Link>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-accent/5 transition-all duration-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-accent/5"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
                    <nav className="py-3 px-4 flex flex-col gap-1 max-w-4xl mx-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground hover:bg-accent/5 px-3 py-2 rounded-md transition-all duration-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
