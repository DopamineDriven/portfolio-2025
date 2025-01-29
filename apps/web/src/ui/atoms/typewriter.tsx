"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";

export interface TypewriterProps
  extends React.ComponentPropsWithRef<typeof motion.div> {
  text: string;
  delay?: number;
  onTypingComplete?: () => void;
  lineNumber: number;
  isActive: boolean;
  totalLines: number;
  isCurrentLine: boolean;
  isReplaying?: boolean;
}

const Typewriter = ({
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
  ...props
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef(text);

  const { animationStates, setAnimationComplete } = useAnimationContext();

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
      textRef.current = text;
    }
  }, [text, isActive]);

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
            `inline-block whitespace-pre-wrap`,
            isCurrentLine
              ? "border-primary animate-cursor-blink border-r-[0.15em] border-solid"
              : ""
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
          <span className="absolute h-0 overflow-hidden opacity-0">{text}</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

Typewriter.displayName = "Typewriter";

export default Typewriter;
