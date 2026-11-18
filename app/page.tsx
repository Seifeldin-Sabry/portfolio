import Image from "next/image"
import Link from "next/link"
import {ArrowRight, Check, KeyRound, PencilLine} from "lucide-react"

import AskButton from "@/components/site/ask-button"
import {CaseStudyRow, FeaturedCaseStudy} from "@/components/site/case-study-card"
import ContactForm from "@/components/site/contact-form"
import {Section, Tag} from "@/components/site/section"
import {getSortedBlogPosts} from "@/lib/blogs"
import {getCaseStudies, getEducation, getExperiences, getServices} from "@/lib/content"
import {LINKS, SITE_CONFIG, bookingUrl} from "@/lib/constants"
import {PILLARS, PILLAR_ORDER, PROFILE} from "@/lib/site"

const FEATURED_ORDER = ["qfacts-website", "sdx-outbound", "ai-assistant"]

export default function Home() {
    const studies = getCaseStudies()
    const featured = FEATURED_ORDER.map((id) => studies.find((s) => s.id === id)).filter((s) => s !== undefined)
    const more = studies.filter((s) => !FEATURED_ORDER.includes(s.id))
    const services = getServices()
    const experiences = getExperiences()
    const education = getEducation()
    const posts = getSortedBlogPosts().slice(0, 3)

    return (
        <>
            {/* Hero */}
            <section className="mx-auto max-w-5xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-24">
                <div className="flex items-center gap-4">
                    <Image src="/assets/images/seif.jpg" alt="Seifeldin Sabry" width={56} height={56} className="h-14 w-14 rounded-full object-cover" priority/>
                    <div>
                        <p className="font-medium">{PROFILE.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {PROFILE.role} · {PROFILE.location}
                        </p>
                    </div>
                </div>
                <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-5xl">{PROFILE.headline}</h1>
                <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{PROFILE.intro}</p>
                {PROFILE.availability && (
                    <p className="mt-5 inline-flex items-start gap-2 rounded-full border px-3 py-1 text-sm">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden/>
                        {PROFILE.availability}
                    </p>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                    <AskButton className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Ask my AI about me</AskButton>
                    <a href={bookingUrl("hero")} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-secondary">
                        Book a 15-minute call
                    </a>
                    <a href="/assets/documents/seifeldin-sabry-cv.pdf" className="rounded-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
                        Download CV
                    </a>
                </div>
            </section>

            {/* Three pillars */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6" aria-label="What I do">
                <div className="grid gap-4 md:grid-cols-3">
                    {PILLAR_ORDER.map((p) => (
                        <a key={p} href={`#${PILLARS[p].anchor}`} className="group rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/30">
                            <p className="text-sm font-medium text-accent">{PILLARS[p].label}</p>
                            <h2 className="mt-2 text-lg font-semibold">{PILLARS[p].title}</h2>
                            <p className="mt-2 text-sm text-muted-foreground">{PILLARS[p].blurb}</p>
                            <span className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
                                How I do it <ArrowRight size={14} aria-hidden/>
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Work */}
            <Section id="work" eyebrow="Selected work" title="Case studies with real numbers" intro="Each one links to the full story: the problem, what I did and what changed.">
                <div className="space-y-4">
                    {featured.map((s) => (
                        <FeaturedCaseStudy key={s.id} study={s}/>
                    ))}
                </div>
                <div className="mt-10 border-b">
                    {more.map((s) => (
                        <CaseStudyRow key={s.id} study={s}/>
                    ))}
                </div>
            </Section>

            {/* Services */}
            <Section id="services" eyebrow="Services" title="Three ways to work with me" intro="Project work for teams and businesses, from a one-off website to a long-running build.">
                <div className="space-y-6">
                    {PILLAR_ORDER.map((p) => {
                        const service = services.find((s) => s.pillar === p)
                        if (!service) return null
                        return (
                            <article key={service.id} id={PILLARS[p].anchor} className="scroll-mt-24 rounded-2xl border bg-card p-5 sm:p-7">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h3 className="text-xl font-semibold">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground">For {service.audience.toLowerCase()}</p>
                                </div>
                                <p className="mt-3 max-w-3xl text-muted-foreground">{service.description}</p>
                                {p === "web" && <OwnershipCallout/>}
                                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                                    {service.includes.map((item) => (
                                        <li key={item} className="flex gap-2 text-sm">
                                            <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden/>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                                    <a href={bookingUrl(`service-${service.id}`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-foreground px-4 py-2 font-medium text-background">
                                        Talk about a project
                                    </a>
                                    {service.link && (
                                        <a href={service.link} target="_blank" rel="noopener noreferrer" className="rounded-full border px-4 py-2 hover:bg-secondary">
                                            Visit SDX Studio
                                        </a>
                                    )}
                                    <AskButton question={`Tell me more about Seif's ${service.title.toLowerCase()} work`} className="px-2 py-2 text-muted-foreground hover:text-foreground">
                                        Ask the AI
                                    </AskButton>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </Section>

            {/* Experience */}
            <Section id="experience" eyebrow="Experience" title="Where I have worked">
                <ol className="border-b">
                    {experiences.map((exp) => (
                        <li key={exp.id} className="border-t py-5">
                            <details className="group">
                                <summary className="flex cursor-pointer list-none flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6 [&::-webkit-details-marker]:hidden">
                                    <span className="w-40 shrink-0 text-sm text-muted-foreground">{exp.period}</span>
                                    <span className="flex-1">
                                        <span className="font-medium">{exp.role}</span>
                                        <span className="text-muted-foreground"> · {exp.company}</span>
                                        <span className="mt-1 block text-sm text-muted-foreground">{firstSentence(exp.description)}</span>
                                    </span>
                                    <span className="text-sm text-muted-foreground group-open:hidden">Details +</span>
                                    <span className="hidden text-sm text-muted-foreground group-open:inline">Hide −</span>
                                </summary>
                                <div className="mt-4 sm:pl-[184px]">
                                    {exp.achievements && (
                                        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-border">
                                            {exp.achievements.map((a) => (
                                                <li key={a}>{a}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {exp.technologies && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {exp.technologies.map((t) => (
                                                <Tag key={t}>{t}</Tag>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </details>
                        </li>
                    ))}
                    {education.map((ed) => (
                        <li key={ed.id} className="flex flex-col gap-1 border-t py-5 sm:flex-row sm:items-baseline sm:gap-6">
                            <span className="w-40 shrink-0 text-sm text-muted-foreground">
                                {ed.start} – {ed.end}
                            </span>
                            <span>
                                <span className="font-medium">{ed.degree}</span>
                                <span className="text-muted-foreground"> · {ed.school}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            </Section>

            {/* Writing */}
            {posts.length > 0 && (
                <Section id="writing" eyebrow="Writing" title="Notes from the work">
                    <div className="border-b">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-1 border-t py-5 sm:flex-row sm:items-baseline sm:gap-6">
                                <span className="w-40 shrink-0 text-sm text-muted-foreground">{post.date}</span>
                                <span className="flex-1">
                                    <span className="font-medium group-hover:underline group-hover:underline-offset-4">{post.title}</span>
                                    <span className="mt-1 block text-sm text-muted-foreground">{post.excerpt}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                    <Link href="/blog" className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        All posts <ArrowRight size={14} aria-hidden/>
                    </Link>
                </Section>
            )}

            {/* Contact */}
            <Section id="contact" eyebrow="Contact" title="Let's talk" intro="Hiring, a website, or a pipeline that needs filling. Send a message, book a call, or ask my AI first.">
                <div className="grid gap-10 md:grid-cols-[1fr_260px]">
                    <ContactForm source="contact"/>
                    <div className="space-y-3 text-sm">
                        <a href={bookingUrl("contact")} target="_blank" rel="noopener noreferrer" className="block rounded-xl border p-4 hover:bg-secondary">
                            <span className="font-medium">Book a call</span>
                            <span className="block text-muted-foreground">15 minutes on Calendly</span>
                        </a>
                        <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="block rounded-xl border p-4 hover:bg-secondary">
                            <span className="font-medium">Email</span>
                            <span className="block break-all text-muted-foreground">{SITE_CONFIG.EMAIL}</span>
                        </a>
                        <a href={LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" className="block rounded-xl border p-4 hover:bg-secondary">
                            <span className="font-medium">LinkedIn</span>
                            <span className="block text-muted-foreground">Connect or message</span>
                        </a>
                    </div>
                </div>
            </Section>
        </>
    )
}

function OwnershipCallout() {
    return (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl bg-secondary p-4">
                <KeyRound size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden/>
                <p className="text-sm">
                    <span className="font-medium">You own all of it.</span> At handoff you get the code, the domain, the hosting account and the analytics in your name. No lock-in.
                </p>
            </div>
            <div className="flex gap-3 rounded-xl bg-secondary p-4">
                <PencilLine size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden/>
                <p className="text-sm">
                    <span className="font-medium">You edit it yourself.</span> An easy editor lets you change text, photos, prices, opening hours and posts whenever you need, without a developer.
                </p>
            </div>
        </div>
    )
}

function firstSentence(text: string): string {
    const match = text.match(/^.*?[.!?](\s|$)/)
    return (match ? match[0] : text).trim()
}
