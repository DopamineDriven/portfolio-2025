"use client";

import type { ComponentPropsWithRef } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";

export interface TypewriterProps
  extends ComponentPropsWithRef<typeof motion.div> {
  text: string;
  delay?: number;
  onTypingComplete?: () => void;
  lineNumber: number;
  isActive: boolean;
  totalLines: number;
  isCurrentLine: boolean;
  isReplaying?: boolean;
  onHeightChange: (height: number) => void;
  isMobile: boolean;
}

function Typewriter({
  text,
  delay = 50,
  className,
  onTypingComplete,
  onAnimationComplete,
  isActive,
  isCurrentLine,
  lineNumber,
  totalLines,
  isReplaying,
  onHeightChange,
  isMobile,
  ...props
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  const { animationStates, setAnimationComplete } = useAnimationContext();
  useLayoutEffect(() => {
    if (textRef.current != null) {
      onHeightChange(textRef.current.offsetHeight);
    }
  }, [onHeightChange, textRef]);

  useEffect(() => {
    if (isReplaying) {
      setDisplayText("");
      setCurrentIndex(0);
    }
  }, [isReplaying]);

  useEffect(() => {
    if (isActive) {
      setDisplayText("");
      setCurrentIndex(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!animationStates.hasTypewriterPlayed && isActive) {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, delay);
        return () => clearTimeout(timeout);
      } else if (currentIndex === text.length) {
        if (onTypingComplete) {
          onTypingComplete();
        }
        if (lineNumber === totalLines) {
          setAnimationComplete("hasTypewriterPlayed");
        }
      }
    }
  }, [
    currentIndex,
    delay,
    text,
    onTypingComplete,
    animationStates.hasTypewriterPlayed,
    setAnimationComplete,
    lineNumber,
    isActive,
    totalLines
  ]);

  if (animationStates.hasTypewriterPlayed && !isReplaying) {
    return <div className={cn(className, "block w-full")}>{text}</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        key={`${lineNumber}-${isReplaying}`}
        className={cn(`block w-full`, className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={onAnimationComplete}
        {...props}>
        <motion.span
          className={cn(
            "relative inline-block break-words whitespace-pre-wrap",
            isCurrentLine && [
              "after:bg-primary after:absolute after:ml-[0.0625rem] after:inline-block after:w-[0.15em] after:content-['']",
              isMobile
                ? "after:animate-cursor-blink-mobile after:h-[1.1em] after:-translate-y-[0.05em]"
                : "after:animate-cursor-blink after:h-[1.25em] after:-translate-y-[0.125em]"
            ]
          )}
          style={{
            width: isActive ? "auto" : "0ch",
            transition: `width ${delay}ms step-end`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          {displayText}
        </motion.span>
        {!isActive && (
          <span
            className="absolute h-0 overflow-hidden opacity-0"
            aria-hidden="true">
            {text}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

Typewriter.displayName = "Typewriter";

export default Typewriter;
