import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import Footer from "@/components/footer"
import {ThemeProvider} from "@/components/theme-provider"
const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Seif | Software Engineer",
    description: "Seifeldin Sabry | Software Engineer | Portfolio",
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
            <link rel="alternate" type="application/rss+xml" title="Seif Ismail's Blog RSS Feed" href="/feed.xml" />
            <script defer src="https://cloud.umami.is/script.js" data-website-id="58ea0ecd-d768-4e47-b26e-374a65a6d005"></script>
        </head>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                <div className="flex flex-col min-h-screen bg-background">
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </div>
        </ThemeProvider>
        </body>
        </html>
    );
}



