"use client"

import Link from "next/link"
import {Github, Linkedin, Mail} from "lucide-react"
import {SocialButton} from "@/components/social-button";
import {Button} from "@/components/ui/button";
import {githubLink, linkedInLink} from "@/lib/links";
import type React from "react";
import {motion} from "framer-motion";

export default function Footer() {
    return (
        <motion.footer
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="relative border-t border-white/10 bg-background/80 backdrop-blur-lg py-8 mt-20"
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        whileInView={{opacity: 1, x: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="text-center md:text-left"
                    >
                        <p className="text-sm text-muted-foreground mb-1">
                            © {new Date().getFullYear()} Seif-DX
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Crafted with passion and precision
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        whileInView={{opacity: 1, x: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="flex gap-4"
                    >
                        <SocialButton icon={<Github size={20} />} link={githubLink} />
                        <SocialButton icon={<Linkedin size={20} />} link={linkedInLink} />
                        <Button variant="default" size="icon" asChild>
                            <a href="mailto:ismailseifeldin54@gmail.com" className="hover:scale-110 transition-transform">
                                <Mail size={20} />
                            </a>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.footer>
    )
}

