import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {ThemeProvider} from "@/components/theme-provider"
import './globals.css'
import {Analytics} from "@vercel/analytics/vue";


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
        <html lang="en">
        <head>
            <link rel="icon" href="/assets/icons/favico.ico" sizes="any" />
        </head>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Analytics debug={true}} />;
                <Footer />
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}



