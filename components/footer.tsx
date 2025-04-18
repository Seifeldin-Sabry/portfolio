import Link from "next/link"
import {Github, Linkedin, Mail} from "lucide-react"
import {SocialButton} from "@/components/social-button";
import {Button} from "@/components/ui/button";
import {githubLink, linkedInLink} from "@/lib/links";
import type React from "react";

export default function Footer() {
    return (
        <footer className="border-t py-4 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">© {new Date().getFullYear()} Seif-DX Portfolio. All rights
                                                             reserved.</p>
                    </div>
                    <div className="flex gap-4">
                        <SocialButton icon={<Github size={20} />} link={githubLink} />
                        <SocialButton icon={<Linkedin size={20} />} link={linkedInLink} />
                        <Button variant="default" size="icon" asChild>
                            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                                <Mail size={20} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

