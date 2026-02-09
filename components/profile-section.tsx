import Image from "next/image"
import Link from "next/link"
import {Github, Linkedin, Mail, Calendar, MapPin, ArrowRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent} from "@/components/ui/card"
import {githubLink, linkedInLink, calendlyLink} from "@/lib/links"
import {SITE_CONFIG} from "@/lib/constants"
import {getSortedBlogPosts} from "@/lib/blogs"

export default function ProfileSection() {
    const posts = getSortedBlogPosts()
    const latestPost = posts[0]

    return (
        <section className="py-20 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                {/* Main Hero Card */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Profile Image - Small and to the side */}
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-border flex-shrink-0 group">
                            <Image
                                src="/assets/images/seif.jpg"
                                alt="Seif Ismail"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Name and Status */}
                            <div className="mb-3">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                                    Seif Ismail
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <Badge 
                                        variant="outline" 
                                        className="text-xs font-mono border-accent/30 text-accent"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse mr-1.5" />
                                        Currently building
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        Qfacts & Etoile
                                    </span>
                                </div>
                            </div>

                            {/* Personal Bio */}
                            <p className="text-muted-foreground mb-5 leading-relaxed max-w-2xl">
                                I build software that actually solves problems. After spending years watching 
                                companies struggle with bloated tools, I decided to create lean, efficient 
                                solutions. When I&apos;m not coding, you&apos;ll find me exploring new tech or 
                                optimizing my workflow for the 47th time.
                            </p>

                            {/* Location and Links */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin size={14} className="text-accent" />
                                    <span>Antwerp, Belgium</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-9 w-9 border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                                        asChild
                                    >
                                        <a href={githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                            <Github size={16} />
                                        </a>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon"
                                        className="h-9 w-9 border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                                        asChild
                                    >
                                        <a href={linkedInLink} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                            <Linkedin size={16} />
                                        </a>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon"
                                        className="h-9 w-9 border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                                        asChild
                                    >
                                        <a href={`mailto:${SITE_CONFIG.EMAIL}`} aria-label="Email">
                                            <Mail size={16} />
                                        </a>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon"
                                        className="h-9 w-9 border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                                        asChild
                                    >
                                        <a href={calendlyLink} target="_blank" rel="noopener noreferrer" aria-label="Calendly">
                                            <Calendar size={16} />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Blog Post Preview */}
                {latestPost && (
                    <Link href={`/blog/${latestPost.slug}`} className="block group">
                        <Card className="border border-border hover:border-accent/30 transition-all duration-300 card-hover bg-card/30 backdrop-blur-sm">
                            <CardContent className="p-4 md:p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-xs font-mono text-accent">Latest writing</span>
                                            <span className="text-muted-foreground">·</span>
                                            <span className="text-xs text-muted-foreground">{latestPost.date}</span>
                                        </div>
                                        <h3 className="text-base md:text-lg font-medium truncate group-hover:text-accent transition-colors">
                                            {latestPost.title}
                                        </h3>
                                    </div>
                                    <ArrowRight 
                                        size={18} 
                                        className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" 
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>
        </section>
    )
}
