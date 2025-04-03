import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {ArrowRight, Github, Linkedin, Mail} from "lucide-react"
import {skills} from "@/data/skills"
import {projects} from "@/data/projects"
import {experiences} from "@/data/experiences"
import {Skill} from "@/components/skill";

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
                            Building innovative solutions at the intersection of web development and artificial
                            intelligence.
                        </p>
                        <div className="flex gap-4">
                            <Button asChild>
                                <Link href="/projects">View Projects</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/contact">Contact Me</Link>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {skills.slice(0, 4).map((skill) => (
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
                        {experiences.slice(0, 2).map((experience, index) => (
                            <div key={experience.id} className="mb-8 flex gap-4">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={experience.companyLogo || "/placeholder.svg?height=64&width=64"}
                                        alt={experience.company}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-black">{experience.role}</h3>
                                    <h4 className="text-gray-600">{experience.company}</h4>
                                    <p className="text-sm text-gray-500">{experience.period}</p>
                                    <p className="mt-2">{experience.description}</p>
                                </div>
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
            <section className="py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
                    <p className="mb-8 max-w-2xl mx-auto">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                        vision.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" asChild className="rounded-full">
                            <a href="https://github.com/Seifeldin-Sabry" target="_blank"
                               className="flex items-center gap-2"
                            >
                                <Github size={18} /> GitHub
                            </a>
                        </Button>
                        <Button variant="outline" asChild className="rounded-full">
                            <a href="https://www.linkedin.com/in/seifeldin-sabry-b8a542202/" target="_blank"
                               className="flex items-center gap-2"
                            >
                                <Linkedin size={18} /> LinkedIn
                            </a>
                        </Button>
                        <Button asChild className="rounded-full">
                            <Link href="/contact" className="flex items-center gap-2">
                                <Mail size={18} /> Contact Me
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

