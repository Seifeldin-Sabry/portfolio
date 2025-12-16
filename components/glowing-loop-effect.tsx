"use client";

import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface GlowingLoopEffectProps {
  blur?: number;
  spread?: number;
  variant?: "default" | "white";
  className?: string;
  borderWidth?: number;
  rotationSpeed?: number; // seconds per full rotation
}

const GlowingLoopEffect = memo(
  ({
    blur = 0,
    spread = 40,
    variant = "default",
    className,
    borderWidth = 3,
    rotationSpeed = 5.5,
  }: GlowingLoopEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const animationRef = useRef<any>(null);

    useEffect(() => {
      if (!containerRef.current) return;
      const element = containerRef.current;

      if (isHovered) {
        // Start continuous rotation
        element.style.setProperty("--active", "1");

        const currentAngle = parseFloat(
          element.style.getPropertyValue("--start")
        ) || 0;

        // Animate to current angle + 360 degrees for continuous loop
        animationRef.current = animate(currentAngle, currentAngle + 360, {
          duration: rotationSpeed,
          ease: "linear",
          repeat: Infinity,
          onUpdate: (value) => {
            element.style.setProperty("--start", String(value % 360));
          },
        });
      } else {
        // Fade out when not hovering
        element.style.setProperty("--active", "0");
        if (animationRef.current) {
          animationRef.current.stop();
        }
      }

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    }, [isHovered, rotationSpeed]);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute inset-0"
      >
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                      from 236.84deg at 50% 50%,
                      #ffffff,
                      #ffffff 25%
                    )`
                  : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                     radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                     radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
                     radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                     repeating-conic-gradient(
                       from 236.84deg at 50% 50%,
                       #dd7bbb 0%,
                       #d79f1e 25%,
                       #5a922c 50%,
                       #4c7894 75%,
                       #dd7bbb 100%
                     )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            blur > 0 && "blur-[var(--blur)]",
            'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
            "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
            "after:[background:var(--gradient)] after:[background-attachment:fixed]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
            "after:[mask-clip:padding-box,border-box]",
            "after:[mask-composite:intersect]",
            "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]",
            className
          )}
        />
      </div>
    );
  }
);

GlowingLoopEffect.displayName = "GlowingLoopEffect";

export { GlowingLoopEffect };
