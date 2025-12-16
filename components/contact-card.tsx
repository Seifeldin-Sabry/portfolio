'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Github, Linkedin, MapPin, Mail } from 'lucide-react';
import { SocialButton } from '@/components/social-button';
import { calendlyLink, githubLink, linkedInLink } from '@/lib/links';
import { GlowingLoopEffect } from '@/components/glowing-loop-effect';

interface ContactCardProps {
  className?: string;
}

export default function ContactCard({ className = '' }: ContactCardProps) {
  return (
    <Card className={`border-2 border-primary/20 bg-card/80 backdrop-blur-sm ${className} relative`}>
      <GlowingLoopEffect
        spread={40}
        borderWidth={3}
        rotationSpeed={4}
        variant="default"
      />
      <CardContent className="p-6 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            I'm always open to discussing new projects, creative ideas, or opportunities to collaborate.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <MapPin className="text-primary" size={20} />
            <span>Antwerp, Belgium</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Mail className="text-primary" size={20} />
            <a
              href="mailto:ismailseifeldin54@gmail.com"
              className="hover:text-primary transition-colors"
            >
              ismailseifeldin54@gmail.com
            </a>
          </div>
        </div>

        <div className="text-center">
          <h3 className="font-semibold mb-6 text-lg">Connect with me</h3>
          <div className="flex justify-center gap-6">
            <SocialButton icon={<Github size={28} />} link={githubLink} />
            <SocialButton icon={<Linkedin size={28} />} link={linkedInLink} />
            <SocialButton icon={<Calendar size={28} />} link={calendlyLink} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
