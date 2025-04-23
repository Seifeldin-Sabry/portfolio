import Image from "next/image"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {Calendar, Download} from "lucide-react"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden">
                    <Image src="/assets/images/seif-sun.png" alt="Profile" fill className="object-cover" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Software Engineer</h2>
                    <p className="mb-4">
                        Hello! I'm Seif, a software engineer who enjoys building web applications and working with AI.
                    </p>
                    <p className="mb-4">
                        I focus on creating solutions that are easy to use and solve real problems. I'm comfortable
                        working with
                        different technologies and adapting to what each project needs.
                    </p>
                    <p className="mb-4">
                        I've worked with both startups and companies like Atlas Copco, where I helped with their
                        development
                        projects.
                    </p>

                    <div className="flex gap-4 flex-wrap">
                        <Button asChild>
                            <Link href="/assets/resume/CV%20-%20Seif.pdf" className="flex items-center gap-2">
                                <Download size={16} /> Download Resume
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/contact" className="flex items-center gap-2">
                                <Calendar size={16} /> Contact Me
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-center">On the side</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6 border rounded-lg">
                        <h3 className="font-semibold text-xl mb-3">Travelling</h3>
                        <p>
                            I like exploring the world, rejuvenating and energising myself. Allowing myself to feel
                            better and more
                            productive. I love to travel and experience different cultures.
                        </p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                        <h3 className="font-semibold text-xl mb-3">Side projects</h3>
                        <p>
                            I enjoy working on side projects that allow me to learn new skills and technologies. I often
                            share
                            these
                            projects on my GitHub.
                        </p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                        <div>
                            <div className="flex gap-3 items-start justify-center">
                                <a href="http://www.ns2agi.com/" target="_blank"
                                   className="font-semibold text-xl mb-3 underline"
                                >North
                                 Star
                                 AGI</a>
                                <Image src="/assets/images/north-star.png" alt="North Star"
                                       className="object-cover"
                                       width={30}
                                       height={30}
                                />
                            </div>
                            <p>
                                Currently volunteering to shape the future of AI in Europe. I am part of a team that is
                                working on creating events, making connections, and building software, a community and a
                                platform
                                around AI.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-center">How I Work</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6 border rounded-lg">
                        <h3 className="font-semibold text-xl mb-3">Team Player</h3>
                        <p>
                            I work well with others and adapt to your team's way of doing things. I'm happy to use the
                            tools and
                            processes you already have in place.
                        </p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                        <h3 className="font-semibold text-xl mb-3">Problem Solver</h3>
                        <p>
                            I enjoy tackling technical challenges and finding practical solutions. I focus on writing
                            clean code
                            that's easy to maintain.
                        </p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                        <h3 className="font-semibold text-xl mb-3">Always Learning</h3>
                        <p>
                            I'm constantly learning new technologies and improving my skills. I bring this curiosity and
                            growth
                            mindset to every project.
                        </p>
                    </div>
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
