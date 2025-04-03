import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, ArrowLeft } from "lucide-react"
import { projects } from "@/data/projects"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.id === params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/projects" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
        <Image
          src={project.image || "/placeholder.svg?height=384&width=768"}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <div className="flex gap-3 mt-4 md:mt-0">
            {project.github && (
              <Button variant="outline" asChild>
                <Link href={project.github} className="flex items-center gap-2">
                  <Github size={16} /> GitHub
                </Link>
              </Button>
            )}
            {project.liveDemo && (
              <Button asChild>
                <Link href={project.liveDemo} className="flex items-center gap-2">
                  <ExternalLink size={16} /> Live Demo
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech) => (
            <span key={tech} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>

        <div className="prose max-w-none">
          <h2>Overview</h2>
          <p>{project.description}</p>

          <h2>Challenges</h2>
          <p>
            During the development of this project, I encountered several challenges that pushed me to expand my skills
            and find innovative solutions.
          </p>
          <ul>
            {project.challenges?.map((challenge, index) => <li key={index}>{challenge}</li>) || (
              <>
                <li>Challenge 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Challenge 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
              </>
            )}
          </ul>

          <h2>Solutions</h2>
          <p>To overcome these challenges, I implemented the following solutions:</p>
          <ul>
            {project.solutions?.map((solution, index) => <li key={index}>{solution}</li>) || (
              <>
                <li>Solution 1: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</li>
                <li>Solution 2: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</li>
              </>
            )}
          </ul>

          <h2>Key Features</h2>
          <ul>
            {project.features?.map((feature, index) => <li key={index}>{feature}</li>) || (
              <>
                <li>Feature 1: Responsive design that works across all devices</li>
                <li>Feature 2: Integration with third-party APIs for enhanced functionality</li>
                <li>Feature 3: Real-time data processing and visualization</li>
                <li>Feature 4: User authentication and personalized experiences</li>
              </>
            )}
          </ul>

          <h2>Results</h2>
          <p>
            This project successfully achieved its goals and provided valuable learning experiences. The implementation
            resulted in:
          </p>
          <ul>
            {project.results?.map((result, index) => <li key={index}>{result}</li>) || (
              <>
                <li>Improved user engagement and satisfaction</li>
                <li>Enhanced performance and scalability</li>
                <li>Successful integration of AI capabilities with web technologies</li>
              </>
            )}
          </ul>

          <h2>Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=192&width=384" alt="Screenshot 1" fill className="object-cover" />
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=192&width=384" alt="Screenshot 2" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

