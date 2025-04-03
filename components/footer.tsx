import Link from "next/link"
import {Mail} from "lucide-react"
import {GithubButton} from "@/components/github";
import {LinkedinButton} from "@/components/linkedin";
import {Button} from "@/components/ui/button";

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
                        <GithubButton size={20} />
                        <LinkedinButton size={20} />
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

