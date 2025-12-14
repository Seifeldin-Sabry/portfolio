'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import ContactCard from '@/components/contact-card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        About Me
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-12 items-center mb-16"
      >
        <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden">
          <Image src="/assets/images/seif-sun.png" alt="Profile" fill className="object-cover" />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Software Engineer</h2>
          <p className="mb-4">
            Hello! I'm Seif, a software engineer who enjoys building web applications and working with AI.
          </p>
          <p className="mb-4">
            I focus on creating solutions that are easy to use and solve real problems. I'm comfortable working with
            different technologies and adapting to what each project needs.
          </p>
          <p className="mb-4">
            I've worked with both startups and companies like Atlas Copco, where I helped with their development
            projects.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0)}
        className="mb-16"
      >
        <motion.h2 variants={fadeIn('up', 0)} className="text-2xl font-bold mb-6 text-center">
          On the side
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={fadeIn('up', 0)} className="text-center p-6 border rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Travelling</h3>
            <p>
              I like exploring the world, rejuvenating and energising myself. Allowing myself to feel better and more
              productive. I love to travel and experience different cultures.
            </p>
          </motion.div>
          <motion.div variants={fadeIn('up', 0.1)} className="text-center p-6 border rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Side projects</h3>
            <p>
              I enjoy working on side projects that allow me to learn new skills and technologies. I often share these
              projects on my GitHub.
            </p>
          </motion.div>
          <motion.div variants={fadeIn('up', 0.2)} className="text-center p-6 border rounded-lg">
            <div>
              <div className="flex gap-3 items-start justify-center">
                <a href="http://www.ns2agi.com/" target="_blank" className="font-semibold text-xl mb-3 underline">
                  North Star AGI
                </a>
                <Image src="/assets/images/north-star.png" alt="North Star" className="object-cover" width={30} height={30} />
              </div>
              <p>
                Currently volunteering to shape the future of AI in Europe. I am part of a team that is working on
                creating events, making connections, and building software, a community and a platform around AI.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0)}
        className="mb-16"
      >
        <motion.h2 variants={fadeIn('up', 0)} className="text-2xl font-bold mb-6 text-center">
          How I Work
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={fadeIn('up', 0)} className="text-center p-6 border rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Team Player</h3>
            <p>
              I work well with others and adapt to your team's way of doing things. I'm happy to use the tools and
              processes you already have in place.
            </p>
          </motion.div>
          <motion.div variants={fadeIn('up', 0.1)} className="text-center p-6 border rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Problem Solver</h3>
            <p>
              I enjoy tackling technical challenges and finding practical solutions. I focus on writing clean code
              that's easy to maintain.
            </p>
          </motion.div>
          <motion.div variants={fadeIn('up', 0.2)} className="text-center p-6 border rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Always Learning</h3>
            <p>
              I'm constantly learning new technologies and improving my skills. I bring this curiosity and growth
              mindset to every project.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0)}
      >
        <motion.h2 variants={fadeIn('up', 0)} className="text-2xl font-bold mb-6 text-center">
          Personal Interests
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <motion.div variants={fadeIn('up', 0)} className="text-center">
            <h3 className="font-semibold">Continuous Learning</h3>
          </motion.div>
          <motion.div variants={fadeIn('up', 0.1)} className="text-center">
            <h3 className="font-semibold">Technical Writing</h3>
          </motion.div>
          <motion.div variants={fadeIn('up', 0.2)} className="text-center">
            <h3 className="font-semibold">Sports and Travelling</h3>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mt-16"
      >
        <ContactCard />
      </motion.div>
    </div>
  );
}
