import Link from "next/link";
import {notFound} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ArrowLeft, ExternalLink, Github} from "lucide-react";
import {projects} from "@/data/projects";

interface ProjectPageProps {
    params: {
        id: string;
    };
}

export default function ProjectPage({params}: ProjectPageProps) {
    const project = projects.find((p) => p.id === params.id);

    if (!project) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <Link href="/projects">
                <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Projects
                </Button>
            </Link>

            {/* Project Title */}
            <h1 className="text-3xl font-bold">{project.title}</h1>

            {/* Links */}
            <div className="flex gap-4">
                {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:underline"
                    >
                        <Github className="h-5 w-5" /> GitHub
                    </a>
                )}
                {project.liveDemo && (
                    <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:underline"
                    >
                        <ExternalLink className="h-5 w-5" /> Live Demo
                    </a>
                )}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                    <span
                        key={tech}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
            {tech}
          </span>
                ))}
            </div>

            {/* Description */}
            <div>
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="text-gray-700">{project.description}</p>
            </div>

            {/* Challenges, Solutions, Features, Results */}
            {project.challenges && (
                <div>
                    <h2 className="text-xl font-semibold">Challenges</h2>
                    <ul className="list-disc list-inside text-white">
                        {project.challenges.map((challenge, index) => (
                            <li key={index}>{challenge}</li>
                        ))}
                    </ul>
                </div>
            )}
            {project.solutions && (
                <div>
                    <h2 className="text-xl font-semibold">Solutions</h2>
                    <ul className="list-disc list-inside text-white">
                        {project.solutions.map((solution, index) => (
                            <li key={index}>{solution}</li>
                        ))}
                    </ul>
                </div>
            )}
            {project.features && (
                <div>
                    <h2 className="text-xl font-semibold">Key Features</h2>
                    <ul className="list-disc list-inside text-white">
                        {project.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            )}
            {project.results && (
                <div>
                    <h2 className="text-xl font-semibold">Results</h2>
                    <ul className="list-disc list-inside text-white">
                        {project.results.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
