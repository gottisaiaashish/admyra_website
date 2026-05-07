"use client";

import React from "react";
import { cn } from "../../lib/utils";

export function AnimatedLetterText({ text = "Grievance Wall", letterToReplace = "a", className }) {
  let keyIndex = 0;

  // Find the first occurrence of the letter to replace (case insensitive)
  const lowerText = text.toLowerCase();
  const lowerLetter = letterToReplace.toLowerCase();
  const replaceIndex = lowerText.indexOf(lowerLetter);

  if (replaceIndex === -1) {
    // No letter to replace found, just render the text
    return <span className={cn("font-black tracking-tight text-white", className)}>{text}</span>;
  }

  // Split text into: before, animated visual, after (keeping the letter)
  const before = text.slice(0, replaceIndex);
  const after = text.slice(replaceIndex); // Start from the letter itself

  return (
    <span className={cn("inline-flex items-center font-black tracking-wide text-white", className)}>
      {before && <span key={keyIndex++}>{before}</span>}

      {/* Animated visual replacing the letter */}
      <span
        className={cn(
          "relative inline-flex items-center justify-center",
          lowerLetter === 'a' ? "ml-[0.04em] mr-[-0.12em]" : "ml-[0.08em] mr-[-0.05em]"
        )}
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      >
        {/* SVG filters for realistic effects */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="3" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feFlood floodColor="rgba(255,255,255,0.15)" result="color" />
              <feComposite in2="offsetblur" operator="in" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
              </feMerge>
            </filter>

            <filter id="diamondGlow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.4" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            <linearGradient id="diamondShine" x1="0%" y1="0%" x2="50%" y2="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            <radialGradient id="outerShapeGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#0f0f0f" />
            </radialGradient>
          </defs>
        </svg>

        {/* Scalloped outer shape */}
        <svg viewBox="0 0 100 100" className="w-[0.85em] h-[0.85em]">
          <path
            d="M50 0
               C55 15, 65 15, 75 10
               C70 25, 75 35, 90 35
               C80 45, 80 55, 90 65
               C75 65, 70 75, 75 90
               C65 85, 55 85, 50 100
               C45 85, 35 85, 25 90
               C30 75, 25 65, 10 65
               C20 55, 20 45, 10 35
               C25 35, 30 25, 25 10
               C35 15, 45 15, 50 0Z"
            fill="url(#outerShapeGradient)"
            filter="url(#innerShadow)"
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-[0.38em] h-[0.38em] animate-diamond-rotate"
            filter="url(#diamondGlow)"
          >
            <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="url(#diamondGradient)" />
            <path d="M50 8 L8 50 L50 50 Z" fill="url(#diamondShine)" />
            <path d="M50 18 L82 50 L50 82 L18 50 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          </svg>
        </span>
      </span>

      {after && <span key={keyIndex++}>{after}</span>}
    </span>
  );
}
