"use client";

import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";
import Typewriter from "@/ui/atoms/typewriter";

export const LandingPageTypeWriter: FC = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { animationStates, resetTypewriterAnimation } = useAnimationContext();
  const lineHeights = useRef<number[]>([]);

  const lines = [
    [1, "I'm Andrew S. Ross, a passionate full stack developer and"],
    [2, "tinkerer with several years of Lead experience driven to create"],
    [3, "outstanding experiences for end-users and developers alike."],
    [4, "I specialize in Node.js, Typescript, React, and Next.js"],
    [5, "with a solid foundation in package development."],
    [6, "Let's build something amazing together!"]
  ] as const satisfies readonly [number, string][];

  const initialHeight = lines.length * 40;

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  const handleHeightChange = useCallback(
    (height: number, index: number) => {
      lineHeights.current[index] = height;
      const totalHeight = lineHeights.current.reduce((sum, h) => sum + h, 0);
      const spacingHeight = (lines.length - 1) * 4; // 4px spacing between lines
      setContainerHeight(Math.max(totalHeight + spacingHeight, initialHeight));
    },
    [lines.length, initialHeight]
  );

  const estimateFinalHeight = useCallback(() => {
    if (lineHeights.current.length === 0) return initialHeight;
    const maxLineHeight = Math.max(...lineHeights.current.filter(Boolean));
    return Math.max(
      maxLineHeight * lines.length + (lines.length - 1) * 4,
      initialHeight
    );
  }, [lines.length, initialHeight]);

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
    // Reset isReplaying with a brief delay to ensure proper state propagation
    setTimeout(() => {
      setIsReplaying(false);
    }, 100);
  }, [resetTypewriterAnimation, estimateFinalHeight]);

  useEffect(() => {
    setContainerHeight(initialHeight);
  }, [initialHeight]);

  return (
    <div className="flex min-h-[5rem] flex-col space-y-2">
      <div className="text-center">
        <h1 className="theme-transition mb-4 text-4xl font-bold">
          Portfolio 2025
        </h1>
        <div className="relative">
          <div
            ref={containerRef}
            className="mb-4 inline-flex flex-col space-y-1 whitespace-nowrap"
            style={{
              height: `${containerHeight}px`,
              transition: "height 0.5s ease-in-out",
              minHeight: `${initialHeight}px` // Ensure minimum height
            }}>
            {animationStates.hasTypewriterPlayed === false
              ? lines
                  .slice(0, currentLineIndex + 1)
                  .map(([lineNumber, text], index) => (
                    <Typewriter
                      key={`${lineNumber}-${isReplaying}`}
                      lineNumber={lineNumber}
                      text={text}
                      isReplaying={isReplaying}
                      totalLines={lines.length}
                      isCurrentLine={lineNumber === currentLineIndex + 1}
                      className={cn(
                        "theme-transition text-lg md:text-xl lg:text-2xl"
                      )}
                      onTypingComplete={
                        lineNumber === currentLineIndex + 1
                          ? handleTypingComplete
                          : undefined
                      }
                      onHeightChange={height =>
                        handleHeightChange(height, index)
                      }
                      isActive={lineNumber <= currentLineIndex + 1}
                    />
                  ))
              : lines.map(([lineNumber, text]) => (
                  <span key={lineNumber} className="theme-transition text-2xl">
                    {text}
                  </span>
                ))}
          </div>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 transform">
            <AnimatePresence>
              {animationStates.hasTypewriterPlayed && !isReplaying && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0, 0.71, 0.2, 1.01]
                  }}
                  onClick={handleReplay}
                  className="stroke-current/50 transition-opacity hover:stroke-current/100"
                  aria-label="Replay animation">
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[1.125rem]">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </motion.svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageTypeWriter;
