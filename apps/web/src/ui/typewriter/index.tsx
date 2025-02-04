"use client";

import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";
import Typewriter from "@/ui/atoms/typewriter";

const LandingPageTypeWriter: FC = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // clean-up on unmount
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { animationStates, resetTypewriterAnimation } = useAnimationContext();
  const lineHeights = useRef<number[]>([]);

  const linesDesktop = [
    [1, "I'm Andrew S. Ross, a full stack developer living in the"],
    [2, "greater Chicagoland area. Creating outstanding experiences"],
    [3, "for end-users and developers alike is a major driver"],
    [4, "of mine. I specialize in Node.js, Typescript, React, and"],
    [5, "Next.js with a strong foundation in package development."],
    [6, "Let's build something impactful together!"]
  ] as const satisfies readonly [number, string][];

  const linesMobile = [
    [1, "I'm Andrew S. Ross, a full stack developer"],
    [2, "living in the greater Chicagoland area."],
    [3, "Creating outstanding experiences"],
    [4, "for end-users and developers alike"],
    [5, "is a major driver of mine."],
    [6, "I specialize in Node.js, Typescript,"],
    [7, "React, and Next.js with a strong"],
    [8, "foundation in package development."],
    [9, "Let's build something impactful together!"]
  ] as const satisfies readonly [number, string][];

  const lines = isMobile ? linesMobile : linesDesktop;

  const initialHeight = lines.length * 32;

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  const calculateInitialHeight = useCallback(() => {
    const lineHeight = isMobile ? 20 : 40;
    const spacing = isMobile ? 8 : 4;
    return lines.length * lineHeight + (lines.length - 1) * spacing;
  }, [isMobile, lines.length]);

  const handleHeightChange = useCallback(
    (height: number, index: number) => {
      lineHeights.current[index] = height;
      const totalHeight = lineHeights.current.reduce((sum, h) => sum + h, 0);
      const spacing = isMobile ? 8 : 4;
      const spacingHeight = (lines.length - 1) * spacing;
      const initialHeight = calculateInitialHeight();
      setContainerHeight(Math.max(totalHeight + spacingHeight, initialHeight));
    },
    [lines.length, isMobile, calculateInitialHeight]
  );

  const estimateFinalHeight = useCallback(() => {
    if (lineHeights.current.length === 0) return calculateInitialHeight();
    const maxLineHeight = Math.max(...lineHeights.current.filter(Boolean));
    const spacing = isMobile ? 8 : 4;
    return Math.max(
      maxLineHeight * lines.length + (lines.length - 1) * spacing,
      calculateInitialHeight()
    );
  }, [lines.length, isMobile, calculateInitialHeight]);

  useEffect(() => {
    if (isTypingComplete && currentLineIndex < lines.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setIsTypingComplete(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isTypingComplete, currentLineIndex, lines.length]);

  const handleReplay = useCallback(() => {
    setIsReplaying(true);
    resetTypewriterAnimation();
    setCurrentLineIndex(0);
    setIsTypingComplete(false);
    const estimatedHeight = estimateFinalHeight();
    setContainerHeight(estimatedHeight);
    setTimeout(() => {
      setIsReplaying(false);
    }, 100);
  }, [resetTypewriterAnimation, estimateFinalHeight]);

  useEffect(() => {
    setContainerHeight(calculateInitialHeight());
  }, [calculateInitialHeight, isMobile]);

  return (
    <div className="flex min-h-[3rem] flex-col px-2 sm:min-h-[4rem] sm:px-4 md:px-8">
      <div className="mx-auto w-full max-w-4xl text-center">
        <h1 className="theme-transition mb-4 text-3xl font-bold md:mb-8">
          Portfolio 2025
        </h1>
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 select-none"
            aria-hidden="true">
            {lines.join("\n")}
          </div>
          <div
            ref={containerRef}
            className="mb-4 inline-flex w-full flex-col space-y-1.5 text-center md:mb-4 md:space-y-1"
            style={{
              height: `${containerHeight}px`,
              transition: "height 0.5s ease-in-out",
              minHeight: `${initialHeight}px` // Ensure minimum height
            }}>
            {lines.map(([lineNumber, text], index) => (
              <Typewriter
                key={`${lineNumber}-${isReplaying}`}
                lineNumber={lineNumber}
                text={text}
                isMobile={isMobile}
                isReplaying={isReplaying}
                totalLines={lines.length}
                isCurrentLine={lineNumber === currentLineIndex + 1}
                className={cn(
                  "theme-transition tracking-tight",
                  "text-base leading-snug",
                  "sm:text-lg sm:leading-snug",
                  "md:text-xl md:leading-normal",
                  "lg:text-2xl"
                )}
                onTypingComplete={
                  lineNumber === currentLineIndex + 1
                    ? handleTypingComplete
                    : undefined
                }
                onHeightChange={height => handleHeightChange(height, index)}
                isActive={lineNumber <= currentLineIndex + 1}
              />
            ))}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform sm:-bottom-2.5">
            <motion.button
              initial={false}
              animate={{
                opacity:
                  animationStates.hasTypewriterPlayed && !isReplaying ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              onClick={handleReplay}
              className={cn(
                "stroke-current/50 p-2 text-current/50 transition-colors hover:stroke-current hover:text-current",
                animationStates.hasTypewriterPlayed && !isReplaying
                  ? "visible"
                  : "invisible"
              )}
              aria-label="Replay animation">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 cursor-pointer sm:size-[1.125rem]">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageTypeWriter;
