"use client";

import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";
import Typewriter from "@/ui/atoms/typewriter";

export const LandingPageTypeWriter: FC = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const { animationStates, resetTypewriterAnimation } = useAnimationContext();

  const lines = [
    [1, "I'm Andrew S. Ross, a passionate full stack developer and"],
    [2, "tinkerer with several years of Lead experience driven to create"],
    [3, "outstanding experiences for end-users and developers alike."],
    [4, "I specialize in Node.js, Typescript, React, and Next.js with"],
    [5, "a strong background in package development."],
    [6, "Let's build something amazing together!"]
  ] as const satisfies readonly [number, string][];

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

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
    // Reset isReplaying after a brief delay to ensure proper state propagation
    setTimeout(() => {
      setIsReplaying(false);
    }, 100);
  }, [resetTypewriterAnimation]);

  return (
    <div className="flex min-h-[5rem] flex-col space-y-2">
      <div className="text-center">
        <h1 className="theme-transition mb-4 text-4xl font-bold">
          Portfolio 2025
        </h1>
        <div className="relative inline-flex flex-col space-y-1 whitespace-nowrap">
          {animationStates.hasTypewriterPlayed === false
            ? lines
                .slice(0, currentLineIndex + 1)
                .map(([lineNumber, text]) => (
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
                    isActive={lineNumber <= currentLineIndex + 1}
                  />
                ))
            : lines.map(([lineNumber, text]) => (
                <span key={lineNumber} className="theme-transition text-2xl">
                  {text}
                </span>
              ))}
          <div className="relative h-10 w-full">
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
                  className="absolute left-1/2 -translate-x-1/2 transform opacity-50 transition-opacity hover:opacity-100"
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
