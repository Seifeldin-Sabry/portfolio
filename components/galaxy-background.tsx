'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Render static starfield with lighter gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0f2a');
      gradient.addColorStop(0.5, '#1f1f4a');
      gradient.addColorStop(1, '#15153a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw static stars (fewer for reduced motion)
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }
      return;
    }

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 25 : 50; // Reduced from 75/200

      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.3 + 0.15, // Reduced from 0.5 + 0.3
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resizeCanvas();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Create gradient background (lighter colors for better contrast)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0f2a');   // Lightened from #0a0a1f
      gradient.addColorStop(0.5, '#1f1f4a'); // Lightened from #1a1a3e
      gradient.addColorStop(1, '#15153a');   // Lightened from #0f0f2e

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Subtle drift animation only (removed mouse repulsion)
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Gentle return to base position
        particle.vx += (particle.baseX - particle.x) * 0.005;
        particle.vy += (particle.baseY - particle.y) * 0.005;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Keep particles in bounds
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.baseX = Math.random() * canvas.width;
          particle.x = particle.baseX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.baseY = Math.random() * canvas.height;
          particle.y = particle.baseY;
        }

        // Twinkling effect (reduced intensity by 50%)
        const twinkle = Math.sin(time * particle.twinkleSpeed + particle.twinkleOffset);
        const currentOpacity = particle.opacity + twinkle * 0.15; // Reduced from 0.3

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        // Add glow for larger particles (softer, warmer color)
        if (particle.size > 1.5) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          const glowGradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 2
          );
          // Warmer, subtler glow (reduced from 0.3 to 0.12 opacity)
          glowGradient.addColorStop(0, `rgba(200, 200, 255, ${currentOpacity * 0.12})`);
          glowGradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
