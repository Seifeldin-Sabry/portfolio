import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {Skill, skills} from "@/data/skills"
import { Skill as SkillComponent } from "@/components/skill"

export default function SkillsPage() {
  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Skills</h1>

      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-center text-lg">
          As a fullstack engineer with expertise in AI, I've developed a diverse set of skills across frontend, backend,
          and artificial intelligence technologies.
        </p>
      </div>

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categorySkills.map((skill) => (
              <SkillComponent skill={skill} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Certifications</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="AWS Certification"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AWS Certified Solutions Architect</h3>
                <p className="text-sm text-gray-500">Amazon Web Services</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="TensorFlow Certification"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">TensorFlow Developer Certificate</h3>
                <p className="text-sm text-gray-500">Google</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

