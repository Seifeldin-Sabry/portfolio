import type React from "react"
import type {Metadata} from "next"
import {Geist} from "next/font/google"
import {JetBrains_Mono} from "next/font/google"
import Script from "next/script"
import "./globals.css"
import {ThemeProvider} from "@/components/theme-provider"
import {LINKS, SITE_CONFIG, SITE_URL} from "@/lib/constants"

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
})

const DESCRIPTION =
    "Seifeldin Sabry: software engineer in Antwerp. Owns the Qfacts platform end to end (TypeScript, GCP, Stripe, AI). Founder of SDX Studio."

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "Seif | Software Engineer & Founder",
    description: DESCRIPTION,
    alternates: {canonical: "/"},
    openGraph: {
        type: "website",
        siteName: "Seif",
        title: "Seif | Software Engineer & Founder",
        description: DESCRIPTION,
        url: "/",
        locale: "en_BE",
    },
    twitter: {card: "summary_large_image", title: "Seif | Software Engineer & Founder", description: DESCRIPTION},
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
            jobTitle: "Software Engineer",
            worksFor: {"@type": "Organization", name: "Qfacts", url: "https://qfacts.be"},
            founder: {"@id": `${SITE_URL}/#sdx-studio`},
            alumniOf: {"@type": "CollegeOrUniversity", name: "Karel de Grote Hogeschool"},
            address: {"@type": "PostalAddress", addressLocality: "Antwerp", addressCountry: "BE"},
            knowsAbout: ["TypeScript", "Python", "NestJS", "Next.js", "Google Cloud Platform", "Pulumi", "Stripe billing", "AI agents", "LLM evaluation", "GTM engineering"],
            sameAs: [LINKS.GITHUB, LINKS.LINKEDIN, LINKS.SDX_STUDIO],
        },
        {
            "@type": "ProfessionalService",
            "@id": `${SITE_URL}/#sdx-studio`,
            name: "SDX Studio",
            url: LINKS.SDX_STUDIO,
            description: "GTM engineering: a done-for-you outbound agency for MSSPs (managed security service providers).",
            founder: {"@id": `${SITE_URL}/#person`},
            areaServed: "Europe",
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
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
