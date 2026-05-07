"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "../../lib/utils";

const STYLES = `
.cinematic-hero-wrapper {
  --pill-bg-1: rgba(255, 255, 255, 0.03);
  --pill-bg-2: rgba(255, 255, 255, 0.01);
  --pill-shadow: rgba(0, 0, 0, 0.5);
  --pill-highlight: rgba(255, 255, 255, 0.1);
  --pill-inset-shadow: rgba(0, 0, 0, 0.8);
  --pill-border: rgba(255, 255, 255, 0.08);
}

@keyframes hero-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes hero-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-hero-breathe {
  animation: hero-breathe 8s ease-in-out infinite alternate;
}

.animate-hero-scroll-marquee {
  animation: hero-scroll-marquee 40s linear infinite;
}

.hero-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.hero-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(79, 70, 229, 0.15) 0%, 
    rgba(147, 51, 234, 0.15) 40%, 
    transparent 70%
  );
}

.hero-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}
`;

export function CinematicBackground() {
  const giantTextRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    gsap.fromTo(
      giantTextRef.current,
      { y: "5vh", opacity: 0 },
      { y: "0vh", opacity: 1, duration: 2, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none cinematic-hero-wrapper">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="hero-aurora absolute left-1/2 top-1/2 h-[100vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 animate-hero-breathe rounded-[50%] blur-[100px] z-0" />
      <div className="hero-bg-grid absolute inset-0 z-0" />
      <div
        ref={giantTextRef}
        className="hero-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 select-none"
      >
        ADMYRA
      </div>
    </div>
  );
}
