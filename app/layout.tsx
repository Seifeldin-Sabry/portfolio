import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {ThemeProvider} from "@/components/theme-provider"
import ConditionalGalaxy from "@/components/conditional-galaxy"
import MotionWrapper from "@/components/motion-wrapper"


const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Seif | Software Engineer",
    description: "Seifeldin Sabry | Software Engineer | Portfolio",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="icon" href="/assets/icons/favico.png" sizes="any" />
        </head>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <MotionWrapper>
                <ConditionalGalaxy />
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </div>
            </MotionWrapper>
        </ThemeProvider>
        </body>
        </html>
    );
}



