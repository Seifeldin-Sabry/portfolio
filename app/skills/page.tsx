import {skills} from "@/data/skills"
import {Skill as SkillComponent} from "@/components/skill"

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
                    As a Software engineer with expertise in AI, I've developed a diverse set of skills across
                    frontend, backend,
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
        </div>
    )
}

