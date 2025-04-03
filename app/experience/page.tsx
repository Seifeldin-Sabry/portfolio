import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { experiences } from "@/data/experiences"
import {education} from "@/data/education";

export default function ExperiencePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Work Experience</h1>

      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-center text-lg">My professional journey as a fullstack engineer and AI specialist.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {experiences.map((experience, index) => (
          <div key={experience.id} className="mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center md:justify-start">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <Image
                        src={experience.companyLogo || "/placeholder.svg?height=96&width=96"}
                        alt={experience.company}
                        fill
                        className="object-contain bg-white"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold">{experience.role}</h2>
                    <h3 className="text-xl text-gray-600 mb-2">{experience.company}</h3>
                    <p className="text-gray-500 mb-4">{experience.period}</p>
                    <p className="mb-4">{experience.description}</p>

                    {experience.achievements && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Achievements:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {experience.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {experience.technologies && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <span key={tech} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Education</h2>

        {education.map((edu) => (
          <Card key={edu.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center md:justify-start">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden">
                    <Image
                      src={edu.logo}
                      alt="University Logo"
                      fill
                      className="object-contain bg-white"
                    />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h2 className="text-2xl font-bold">{edu.degree}</h2>
                  <h3 className="text-xl text-gray-600 mb-2">{edu.school}</h3>
                  <p className="text-gray-500 mb-4">
                    {edu.start} - {edu.end}
                  </p>
                  <p className="mb-4">{edu.info}</p>
                  <p className="mb-4">{edu.field}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Relevant Coursework:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {edu.courseWork.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
</Card>
        ))}
      </div>
    </div>
  )
}

