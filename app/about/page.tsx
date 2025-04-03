import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=500&width=400" alt="Profile" fill className="object-cover" />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Fullstack Engineer & AI Specialist</h2>
          <p className="mb-4">
            Hello! I'm a passionate fullstack developer with expertise in artificial intelligence. With over X years of
            experience in the tech industry, I've worked on a diverse range of projects from web applications to complex
            AI systems.
          </p>
          <p className="mb-4">
            My journey in technology began with a degree in Computer Science, and I've since expanded my skills to
            include modern web frameworks, cloud technologies, and machine learning.
          </p>
          <p className="mb-6">
            I'm driven by solving complex problems and creating intuitive, efficient solutions that make a real impact.
            When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or
            sharing my knowledge through technical writing.
          </p>

          <Button asChild>
            <Link href="/path-to-resume.pdf" className="flex items-center gap-2">
              <Download size={16} /> Download Resume
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">My Journey</h2>
        <div className="max-w-3xl mx-auto">
          <div className="relative border-l-2 border-gray-300 pl-8 pb-8">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
            <h3 className="text-xl font-bold">Education</h3>
            <p className="text-gray-600 mb-4">Bachelor's/Master's in Computer Science</p>
            <p>
              During my academic years, I developed a strong foundation in computer science principles, algorithms, and
              software engineering. I specialized in artificial intelligence and machine learning, completing several
              research projects in these areas.
            </p>
          </div>

          <div className="relative border-l-2 border-gray-300 pl-8 pb-8">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
            <h3 className="text-xl font-bold">Early Career</h3>
            <p className="text-gray-600 mb-4">Software Engineer</p>
            <p>
              I started my professional journey as a software engineer, working on web applications and backend systems.
              This experience taught me the importance of clean code, testing, and collaboration in software
              development.
            </p>
          </div>

          <div className="relative border-l-2 border-gray-300 pl-8">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
            <h3 className="text-xl font-bold">Present</h3>
            <p className="text-gray-600 mb-4">Fullstack Engineer & AI Specialist</p>
            <p>
              Today, I combine my expertise in fullstack development and artificial intelligence to build innovative
              solutions. I'm passionate about creating applications that leverage AI to solve real-world problems while
              providing excellent user experiences.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Personal Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image src="/placeholder.svg?height=80&width=80" alt="Coding" fill className="object-contain" />
            </div>
            <h3 className="font-semibold">Open Source</h3>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image src="/placeholder.svg?height=80&width=80" alt="Learning" fill className="object-contain" />
            </div>
            <h3 className="font-semibold">Continuous Learning</h3>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image src="/placeholder.svg?height=80&width=80" alt="Tech Writing" fill className="object-contain" />
            </div>
            <h3 className="font-semibold">Technical Writing</h3>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image src="/placeholder.svg?height=80&width=80" alt="Hiking" fill className="object-contain" />
            </div>
            <h3 className="font-semibold">Outdoor Activities</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

