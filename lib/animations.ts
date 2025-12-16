import { Variants } from 'framer-motion';

// Fade in from direction - simplified and subtle
export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

// Stagger container
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

// Scale in animation - subtle
export const scaleIn = (delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

// Slide in from side - subtle
export const slideIn = (direction: 'left' | 'right', delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -30 : 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

// Hover lift effect - minimal
export const hoverLift = {
  rest: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Glow effect on hover - monochrome, subtle
export const glowOnHover = {
  rest: {
    boxShadow: '0 0 0 rgba(255, 255, 255, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
    transition: {
      duration: 0.2,
    },
  },
};

// Typewriter effect (for text)
export const typewriter = {
  hidden: {
    width: 0,
  },
  visible: {
    width: '100%',
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// Rotate in animation - subtle
export const rotateIn = (delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      rotate: -5,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

// Parallax scroll effect - subtle
export const parallaxScroll = (offset: number) => {
  return {
    y: offset,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  };
};

// Page transition - subtle
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// Magnetic button effect - minimal
export const magneticButton = {
  rest: {
    x: 0,
    y: 0,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Shimmer effect for loading
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};
