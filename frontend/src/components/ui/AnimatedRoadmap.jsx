"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

const MilestoneMarker = ({ milestone }) => {
  const statusClasses = {
    complete: "bg-indigo-500 border-indigo-700",
    "in-progress": "bg-blue-500 border-blue-700 animate-pulse",
    pending: "bg-white/10 border-white/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: milestone.id * 0.3, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.8 }}
      className="absolute flex items-center gap-4"
      style={milestone.position}
    >
      <div className="relative flex h-8 w-8 items-center justify-center">
        <div
          className={cn(
            "absolute h-3 w-3 rounded-full border-2",
            statusClasses[milestone.status]
          )}
        />
        <div className="absolute h-full w-full rounded-full bg-indigo-500/10" />
      </div>
      <div className="rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2 text-[10px] font-bold text-white uppercase tracking-widest shadow-2xl">
        {milestone.name}
      </div>
    </motion.div>
  );
};

const AnimatedRoadmap = React.forwardRef(
  ({ className, milestones, mapImageSrc, ...props }, ref) => {
    const targetRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start end", "end start"],
    });

    const pathLength = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);

    return (
      <div
        ref={targetRef}
        className={cn("relative w-full max-w-5xl mx-auto py-24", className)}
        {...props}
      >
        {/* Background map image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="absolute inset-0 top-10 opacity-40"
        >
          <img
            src={mapImageSrc}
            alt="Campus Connectivity Map"
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* SVG path for animation */}
        <div className="relative h-[500px]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
            className="absolute top-0 left-0"
          >
            <motion.path
              d="M 50 350 Q 200 50 400 200 T 750 100"
              fill="none"
              stroke="rgba(79, 70, 229, 0.5)"
              strokeWidth="2"
              strokeDasharray="8 4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {/* Render each milestone */}
          {milestones.map((milestone) => (
            <MilestoneMarker key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    );
  }
);

AnimatedRoadmap.displayName = "AnimatedRoadmap";

export { AnimatedRoadmap };
