'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Project } from '@/data/projects';

interface ProjectCarouselProps {
  projects: Project[];
}

// Monochrome theme - no color variations needed
const monochromeTheme = {
  bg: 'bg-white/[0.02]',
  border: 'border-white/10',
  accent: 'text-white'
};

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
      setIsExpanded(false);
    });
  }, [api]);

  const currentProject = projects[currentIndex];
  const hasDetails = currentProject.challenges || currentProject.solutions || currentProject.generalFeatures || currentProject.myContributions || currentProject.results;

  return (
    <div className="relative w-full px-4 py-12">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {projects.map((project, index) => {
            const itemHasDetails = project.challenges || project.solutions || project.generalFeatures || project.myContributions || project.results;

            return (
              <CarouselItem key={project.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`${monochromeTheme.bg} ${monochromeTheme.border} border backdrop-blur-sm`}>
                    <CardContent className="p-8 lg:p-12">
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                              <span className="text-sm text-muted-foreground">
                                Project {index + 1} of {projects.length}
                              </span>
                              {project.status && (
                                <Badge
                                  variant={project.status === "In Production" ? "default" : project.status === "Live" ? "default" : "secondary"}
                                  className={project.status === "Coming Soon" ? "opacity-70" : ""}
                                >
                                  {project.status}
                                </Badge>
                              )}
                            </div>
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${monochromeTheme.accent}`}>
                              {project.title}
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                              {project.description}
                            </p>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="secondary"
                                  className="bg-white/10 text-white border border-white/20"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-4 mb-6">
                            {project.github && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-4 h-4 mr-2" />
                                  View Code
                                </a>
                              </Button>
                            )}
                            {project.liveDemo && (
                              <Button size="sm" asChild>
                                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Live Demo
                                </a>
                              </Button>
                            )}
                          </div>

                          {index === currentIndex && itemHasDetails && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full justify-between"
                              >
                                <span className="text-sm font-medium">
                                  {isExpanded ? 'Hide Details' : 'Show More Details'}
                                </span>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </Button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-4 pt-4 mt-4 border-t border-border/50">
                                      {project.challenges && (
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">Challenges</h4>
                                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            {project.challenges.map((challenge, i) => (
                                              <li key={i}>{challenge}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {project.solutions && (
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">Solutions</h4>
                                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            {project.solutions.map((solution, i) => (
                                              <li key={i}>{solution}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {project.generalFeatures && (
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">General Features</h4>
                                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            {project.generalFeatures.map((feature, i) => (
                                              <li key={i}>{feature}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {project.myContributions && (
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">My Contributions</h4>
                                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            {project.myContributions.map((contribution, i) => (
                                              <li key={i}>{contribution}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {project.results && (
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">Results</h4>
                                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            {project.results.map((result, i) => (
                                              <li key={i}>{result}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <Button
          variant="outline"
          size="icon"
          onClick={() => api?.scrollPrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => api?.scrollNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex"
          aria-label="Next project"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </Carousel>

      <div className="flex justify-center gap-2 mt-8">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-white border-white border-2 w-8'
                : 'bg-white/20 border border-white/30'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6 md:hidden">
        <Button variant="outline" size="sm" onClick={() => api?.scrollPrev()}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => api?.scrollNext()}>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
