'use client';

import { skills, Skill } from '@/data/skills';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import { cn } from '@/lib/utils';

const skillsByCategory = skills.reduce((acc, skill) => {
  if (!acc[skill.category]) {
    acc[skill.category] = [];
  }
  acc[skill.category].push(skill);
  return acc;
}, {} as Record<string, Skill[]>);

const categories = [
  { name: 'Frontend', direction: 'left' as const, gradient: 'from-blue-500/10 to-purple-500/10' },
  { name: 'Backend', direction: 'right' as const, gradient: 'from-purple-500/10 to-pink-500/10' },
  { name: 'AI & Machine Learning', direction: 'left' as const, gradient: 'from-pink-500/10 to-orange-500/10' },
  { name: 'DevOps & Tools', direction: 'right' as const, gradient: 'from-orange-500/10 to-green-500/10' },
  { name: 'Developer Tools', direction: 'left' as const, gradient: 'from-green-500/10 to-blue-500/10' },
];

function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all mx-4">
      <div className="relative w-8 h-8 flex-shrink-0">
        <Image
          src={skill.icon}
          alt={skill.name}
          fill
          className={cn('object-contain', skill.whiteBg ? 'bg-white rounded-full p-1' : '')}
        />
      </div>
      <span className="text-sm font-medium whitespace-nowrap">{skill.name}</span>
    </div>
  );
}

export default function SkillsLoopingAnimation() {
  return (
    <div className="w-full py-16 overflow-hidden">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-3">Technical Skills</h2>
        <p className="text-muted-foreground">Technologies and tools I work with</p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const categorySkills = skillsByCategory[category.name] || [];
          if (categorySkills.length === 0) return null;

          return (
            <div key={category.name} className="relative">
              <div className={cn('absolute inset-0 bg-gradient-to-r opacity-20', category.gradient)} />
              <Marquee
                speed={30}
                gradient={false}
                direction={category.direction}
                pauseOnHover
                className="py-4"
              >
                {categorySkills.map((skill) => (
                  <SkillBadge key={skill.id} skill={skill} />
                ))}
              </Marquee>
            </div>
          );
        })}
      </div>
    </div>
  );
}
