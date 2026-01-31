'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =============================================================================
// FADE UP - Paintings emerge softly as you scroll
// =============================================================================

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export function FadeUp({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  distance = 40,
  className = '' 
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.set(element, { 
      opacity: 0, 
      y: distance 
    });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [delay, duration, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// =============================================================================
// STAGGER CHILDREN - Grid items animate in sequence
// =============================================================================

interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
}

export function StaggerChildren({ 
  children, 
  stagger = 0.1,
  className = '' 
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current;
    const items = container.children;

    gsap.set(items, { 
      opacity: 0, 
      y: 30 
    });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// =============================================================================
// REVEAL IMAGE - Painting unveils with a curtain/mask effect
// =============================================================================

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function RevealImage({ 
  src, 
  alt, 
  className = '',
  direction = 'up' 
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;

    // Set initial clip-path based on direction
    const clipPaths: Record<string, { from: string; to: string }> = {
      up: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
      down: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
      left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
      right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
    };

    gsap.set(container, { clipPath: clipPaths[direction].from });
    gsap.set(image, { scale: 1.2 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(container, {
      clipPath: clipPaths[direction].to,
      duration: 1,
      ease: 'power3.inOut',
    }).to(image, {
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
    }, '-=0.8');

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [direction]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img 
        ref={imageRef}
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// =============================================================================
// PARALLAX - Subtle depth effect for hero images
// =============================================================================

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ 
  children, 
  speed = 0.3,
  className = '' 
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// =============================================================================
// TEXT REVEAL - Elegant text fade for titles
// =============================================================================

interface TextRevealProps {
  children: ReactNode;
  className?: string;
}

export function TextReveal({ children, className = '' }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.set(element, { 
      opacity: 0, 
      y: 20,
      filter: 'blur(10px)'
    });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// =============================================================================
// SCALE IN - Artwork card scales up gently
// =============================================================================

interface ScaleInProps {
  children: ReactNode;
  className?: string;
}

export function ScaleIn({ children, className = '' }: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.set(element, { 
      opacity: 0, 
      scale: 0.9 
    });

    gsap.to(element, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// =============================================================================
// HORIZONTAL LINE - Animated divider
// =============================================================================

interface LineRevealProps {
  className?: string;
}

export function LineReveal({ className = '' }: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.set(element, { scaleX: 0, transformOrigin: 'left center' });

    gsap.to(element, {
      scaleX: 1,
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, []);

  return (
    <div ref={ref} className={`h-px bg-current ${className}`} />
  );
}

// =============================================================================
// ARTWORK CARD - Combined hover + scroll animation
// =============================================================================

interface ArtworkCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function ArtworkCard({ 
  children, 
  className = '',
  index = 0 
}: ArtworkCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.set(element, { 
      opacity: 0, 
      y: 40 
    });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [index]);

  return (
    <div 
      ref={ref} 
      className={`group transition-transform duration-500 hover:-translate-y-2 ${className}`}
    >
      {children}
    </div>
  );
}
