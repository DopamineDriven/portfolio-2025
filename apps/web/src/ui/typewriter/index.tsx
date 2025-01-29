"use client";

import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";
import Typewriter from "@/ui/atoms/typewriter";

export const LandingPageTypeWriter: FC = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const { animationStates } = useAnimationContext();

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

  return (
    <div className="flex min-h-[5rem] flex-col space-y-2">
      <div className="text-center">
        <h1 className="theme-transition mb-4 text-4xl font-bold">
          Portfolio 2025
        </h1>
        <div className="text-pretty">
          {animationStates.hasTypewriterPlayed === false
            ? lines
                .slice(0, currentLineIndex + 1)
                .map(([lineNumber, text]) => (
                  <Typewriter
                    key={lineNumber}
                    lineNumber={lineNumber}
                    text={text}
                    totalLines={lines.length}
                    className={cn(
                      "theme-transition block w-full text-2xl",
                      lineNumber === lines.length ? "mt-4" : ""
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
                <span
                  key={lineNumber}
                  className="theme-transition block w-full text-2xl last:mt-4">
                  {text}
                </span>
              ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPageTypeWriter;
