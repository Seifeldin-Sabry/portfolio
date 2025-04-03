import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, ExternalLink } from "lucide-react"
import { projects } from "@/data/projects"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Projects</h1>

      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-center text-lg">
          Here's a collection of my recent projects, showcasing my skills in fullstack development and artificial
          intelligence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={project.image || "/placeholder.svg?height=192&width=384"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span key={tech} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.github && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={project.github} className="flex items-center gap-2">
                      <Github size={16} /> GitHub
                    </Link>
                  </Button>
                )}
                {project.liveDemo && (
                  <Button size="sm" asChild>
                    <Link href={project.liveDemo} className="flex items-center gap-2">
                      <ExternalLink size={16} /> Live Demo
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

