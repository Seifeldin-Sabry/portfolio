'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Notebook } from 'lucide-react';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experiences';
import ProjectCarousel from '@/components/project-carousel';
import ExperienceTimeline from '@/components/experience-timeline';
import SkillsLoopingAnimation from '@/components/skills-looping-animation';
import ContactCard from '@/components/contact-card';
import { fadeIn, staggerContainer, scaleIn } from '@/lib/animations';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.15, 0)}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <motion.div variants={fadeIn('right', 0)} className="flex-1">
              <motion.p
                variants={fadeIn('up', 0.1)}
                className="text-xl md:text-2xl font-bold mb-4"
              >
                Hi, I'm Seif!
              </motion.p>
              <motion.h1
                variants={fadeIn('up', 0.2)}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                Software Engineer
              </motion.h1>
              <motion.p
                variants={fadeIn('up', 0.3)}
                className="text-xl mb-8 text-muted-foreground"
              >
                Passionate about building impactful software solutions
              </motion.p>
              <motion.div
                variants={staggerContainer(0.1, 0.4)}
                initial="hidden"
                animate="visible"
                className="flex gap-4 flex-wrap"
              >
                <motion.div
                  variants={scaleIn(0)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" asChild>
                    <Link href="/blog" className="flex items-center gap-2">
                      <Notebook size={16} /> Check out my Blog!
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeIn('left', 0)}
              className="flex-1 flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/20"
              >
                <Image
                  src="/assets/images/seif.jpg"
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn('up', 0)}
          className="container mx-auto px-4"
        >
          <ProjectCarousel projects={projects} />
        </motion.div>
      </section>

      <section className="py-8 bg-muted/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn('up', 0)}
          className="container mx-auto px-4"
        >
          <ExperienceTimeline experiences={experiences} />
        </motion.div>
      </section>

      <section className="py-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn('up', 0)}
        >
          <SkillsLoopingAnimation />
        </motion.div>
      </section>

      <section className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 max-w-2xl"
        >
          <ContactCard />
        </motion.div>
      </section>
    </div>
  );
}
