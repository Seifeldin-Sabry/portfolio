import type React from "react"
import type {Metadata} from "next"
import {Geist} from "next/font/google"
import {JetBrains_Mono} from "next/font/google"
import Script from "next/script"
import "./globals.css"
import {ThemeProvider} from "@/components/theme-provider"

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
    title: "Seif | Software Engineer & Founder",
    description: "Seifeldin Sabry | Software Engineer & Founder | SDX Studio",
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
