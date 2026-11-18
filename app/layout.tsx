import type React from "react"
import type {Metadata} from "next"
import {Geist} from "next/font/google"
import {JetBrains_Mono} from "next/font/google"
import Script from "next/script"
import "./globals.css"
import {ThemeProvider} from "@/components/theme-provider"
import AssistantProvider from "@/components/assistant/assistant-provider"
import Header from "@/components/site/header"
import Footer from "@/components/site/footer"
import {LINKS, SITE_CONFIG, SITE_URL} from "@/lib/constants"

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
})

const TITLE = "Seifeldin Sabry | Product engineer & GTM engineer"
const DESCRIPTION =
    "Seif builds the product (TypeScript, Python), the website that gets it found (migrations, SEO and AEO) and the outbound that fills the pipeline (AI-driven GTM). Software engineer at QFacts, founder of SDX Studio."

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {default: TITLE, template: "%s · Seif"},
    description: DESCRIPTION,
    alternates: {canonical: "/"},
    openGraph: {
        type: "website",
        siteName: "Seif",
        title: TITLE,
        description: DESCRIPTION,
        url: "/",
        locale: "en_BE",
    },
    twitter: {card: "summary_large_image", title: TITLE, description: DESCRIPTION},
}

/** Structured data so search engines know who this is and what he offers. */
const JSON_LD = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: "Seifeldin Sabry",
            alternateName: "Seif",
            url: SITE_URL,
            email: `mailto:${SITE_CONFIG.EMAIL}`,
            jobTitle: ["Software Engineer", "Product Engineer", "GTM Engineer"],
            worksFor: {"@type": "Organization", name: "Qfacts", url: "https://qfacts.be"},
            founder: {"@id": `${SITE_URL}/#sdx-studio`},
            alumniOf: {"@type": "CollegeOrUniversity", name: "Karel de Grote Hogeschool"},
            address: {"@type": "PostalAddress", addressLocality: "Antwerp", addressCountry: "BE"},
            knowsAbout: ["TypeScript", "Python", "NestJS", "Next.js", "React", "Google Cloud Platform", "Pulumi", "Stripe billing", "AI agents", "LLM evaluation", "GTM engineering", "Outbound sales automation", "Search engine optimization", "Answer engine optimization", "Website migration"],
            sameAs: [LINKS.GITHUB, LINKS.LINKEDIN, LINKS.SDX_STUDIO],
        },
        {
            "@type": "ProfessionalService",
            "@id": `${SITE_URL}/#sdx-studio`,
            name: "SDX Studio",
            url: LINKS.SDX_STUDIO,
            description: "GTM engineering agency running done-for-you outbound. First niche: MSSPs (managed security service providers), 6 qualified meetings with security buyers in 90 days, or SDX keeps working free until they are held.",
            founder: {"@id": `${SITE_URL}/#person`},
            areaServed: ["United States", "United Kingdom", "Europe", "Asia-Pacific"],
        },
    ],
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="scroll-smooth">
        <head>
            <link rel="icon" href="/assets/icons/favico.png" sizes="any" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(JSON_LD)}}/>
            <link rel="alternate" type="application/rss+xml" title="Seifeldin Sabry's Blog RSS Feed" href="/feed.xml" />
            <Script defer src="https://cloud.umami.is/script.js" data-website-id="58ea0ecd-d768-4e47-b26e-374a65a6d005" strategy="afterInteractive" />
        </head>
        <body className={`${geistSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AssistantProvider>
                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background">Skip to content</a>
                <Header/>
                <main id="main">{children}</main>
                <Footer/>
            </AssistantProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
