import {Rss} from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t border-border/50 py-8 mt-10">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
                <p className="font-mono">
                    <span className="text-accent">&copy;</span> {new Date().getFullYear()} Seif Ismail
                </p>
                <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-accent transition-colors duration-300"
                >
                    <Rss size={14} className="text-accent" /> 
                    <span className="font-mono">RSS</span>
                </a>
            </div>
        </footer>
    )
}
