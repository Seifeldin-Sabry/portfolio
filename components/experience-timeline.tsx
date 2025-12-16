'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Experience } from '@/data/experiences';
import { education } from '@/data/education';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

const educationData = education[0];

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const orderedExperiences = [...experiences].reverse();

  // Check scroll position to show/hide navigation buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();

      const timeout = setTimeout(checkScroll, 100);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        clearTimeout(timeout);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'right' ? scrollAmount : -scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="z-10"
          aria-label="Scroll timeline left"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </Button>

        <div className="flex-1 text-center">
          <p className="text-sm text-muted-foreground">
            Scroll horizontally or drag to explore my journey
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="z-10"
          aria-label="Scroll timeline right"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Fade overlays */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable Timeline */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden pb-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            cursor: isDragging ? 'grabbing' : 'grab',
            WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
          }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          role="region"
          aria-label="Experience timeline, scrollable horizontally"
          tabIndex={0}
        >
          <div className="flex gap-24 md:gap-32 lg:gap-40 px-4 py-8 min-w-min">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="relative flex-shrink-0"
            >
              <div className="absolute top-20 -left-2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
              <div className="absolute top-20 left-full w-24 md:w-32 lg:w-40 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 z-0" />

              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-96 md:w-[500px] lg:w-[600px]"
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden border-2 border-primary/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        <Image
                          src={educationData.logo}
                          alt={`${educationData.school} logo`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>

                    <div className="mb-3 text-center">
                      <h3 className="text-xl font-bold mb-1">
                        {educationData.degree}
                      </h3>
                      <p className="text-lg font-semibold">{educationData.school}</p>
                      <p className="text-sm text-muted-foreground">{educationData.start} - {educationData.end}</p>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-center">
                      {educationData.info}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2 text-center">Field of Study</h4>
                      <p className="text-sm text-muted-foreground text-center">{educationData.field}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-center">Key Coursework</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {educationData.courseWork.slice(0, 4).map((course) => (
                          <Badge
                            key={course}
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary border-primary/20"
                          >
                            {course}
                          </Badge>
                        ))}
                        {educationData.courseWork.length > 4 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary border-primary/20"
                          >
                            +{educationData.courseWork.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {orderedExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex-shrink-0"
              >
                {index < orderedExperiences.length - 1 && (
                  <div className="absolute top-20 left-full w-24 md:w-32 lg:w-40 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 z-0" />
                )}

                <div className="absolute top-20 -left-2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="w-96 md:w-[500px] lg:w-[600px]"
                >
                  <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      {experience.companyLogo && (
                        <div className="mb-4 flex justify-center">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            <Image
                              src={experience.companyLogo}
                              alt={`${experience.company} logo`}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        </div>
                      )}

                      <div className="mb-3 text-center">
                        <h3 className="text-xl font-bold mb-1 text-primary">
                          {experience.role}
                        </h3>
                        <p className="text-lg font-semibold">{experience.company}</p>
                        <p className="text-sm text-muted-foreground">{experience.period}</p>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {experience.description}
                      </p>

                      {experience.achievements && experience.achievements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Key Achievements</h4>
                          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                            {experience.achievements.slice(0, 3).map((achievement, i) => (
                              <li key={i} className="leading-relaxed">
                                {achievement}
                              </li>
                            ))}
                            {experience.achievements.length > 3 && (
                              <li className="italic">
                                +{experience.achievements.length - 3} more...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {experience.technologies && experience.technologies.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="text-xs bg-primary/10 text-primary border-primary/20"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 flex justify-center gap-2">
        {orderedExperiences.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-muted transition-colors duration-300"
          />
        ))}
      </div>
    </div>
  );
}
