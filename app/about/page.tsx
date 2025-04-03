import Image from "next/image"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {Download} from "lucide-react"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden">
                    <Image src="/assets/images/seif-sun.png" alt="Profile" fill className="object-cover" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Software Engineer & AI developer</h2>
                    <p className="mb-4">
                        Hello! My name is Seif and I'm a passionate software with expertise in artificial intelligence.
                    </p>
                    <p className="mb-4">
                        My journey in technology began with a degree in Computer Science, and I've since expanded my
                        skills to
                        include modern web frameworks, cloud technologies, and machine learning.
                    </p>
                    <p className="mb-4">
                        In my free time I'm usually trying to get a side project going. Spending time with my loved ones
                        and/or travelling the world.
                    </p>

                    <Button asChild>
                        <Link href="/assets/resume/CV%20-%20Seif.pdf" className="flex items-center gap-2">
                            <Download size={16} /> Download Resume
                        </Link>
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Personal Interests</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="text-center">
                        <h3 className="font-semibold">Continuous Learning</h3>
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold">Technical Writing</h3>
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold">Sports and Travelling</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

