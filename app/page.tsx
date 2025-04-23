import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {ArrowRight, Calendar, Mail} from "lucide-react"
import {homePageSkills} from "@/data/skills"
import {projects} from "@/data/projects"
import {experiences} from "@/data/experiences"
import {Skill} from "@/components/skill"
import {calendlyLink} from "@/lib/links";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="py-20 text-white">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <p className="text-xl md:text-2xl font-bold mb-4">Hi, I'm Seif!</p>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Software Engineer</h1>
                        <p className="text-xl mb-8 text-gray-300">
                            I help teams build web applications and implement AI solutions.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <Button asChild>
                                <Link href="/services">My Services</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/contact" className="flex items-center gap-2">
                                    <Calendar size={16} /> Contact Me
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div
                            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white"
                        >
                            <Image src="/assets/images/seif.jpg" alt="Profile" fill className="object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Preview */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center text-black">Skills</h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {homePageSkills.map((skill) => (
                            <Skill skill={skill} />
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" asChild>
                            <Link href="/skills" className="flex items-center gap-2">
                                View All Skills <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Projects Preview */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.slice(0, 2).map((project) => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                                    <p className="text-white mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech) => (
                                            <span key={tech}
                                                  className="bg-gray-100 px-3 py-1 rounded-full text-sm text-black"
                                            >
                        {tech}
                      </span>
                                        ))}
                                    </div>
                                    <Button asChild>
                                        <Link href={`/projects/${project.id}`}>View Project</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" asChild>
                            <Link href="/projects" className="flex items-center gap-2">
                                View All Projects <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Experience Preview */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center text-black">Work Experience</h2>
                    <div className="max-w-3xl mx-auto">
                        {experiences.slice(0, 2).map((experience) => (
                            <div key={experience.id} className="mb-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="md:w-1/4 flex justify-center md:justify-start">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                                    <Image
                                                        src={experience.companyLogo || "/placeholder.svg?height=64&width=64"}
                                                        alt={experience.company}
                                                        fill
                                                        className="object-contain bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:w-3/4">
                                                <h3 className="text-xl font-bold text-foreground">{experience.role}</h3>
                                                <h4 className="text-lg text-gray-300 mb-1">{experience.company}</h4>
                                                <p className="text-gray-300 mb-2">{experience.period}</p>
                                                <p className="text-white">{experience.description.substring(0, 150)}...</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" asChild>
                            <Link href="/experience" className="flex items-center gap-2">
                                View Full Experience <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Contact Preview */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
                    <p className="mb-8 max-w-2xl mx-auto">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                        vision.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Button asChild className="rounded-full">
                            <Link href="/contact" className="flex items-center gap-2">
                                <Mail size={18} /> Contact Me
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="rounded-full">
                            <a
                                href={calendlyLink}
                                target="_blank"
                                className="flex items-center gap-2"
                                rel="noreferrer"
                            >
                                <Calendar size={18} /> Schedule a Call
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
