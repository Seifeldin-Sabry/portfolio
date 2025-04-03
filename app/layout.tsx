import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {ThemeProvider} from "@/components/theme-provider"
import './globals.css'

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Portfolio | Fullstack Engineer & AI Specialist",
    description: "Portfolio of a Fullstack Engineer with expertise in AI technologies",
    generator: 'v0.dev'
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
        </ThemeProvider>
        </body>
        </html>
    )
}


