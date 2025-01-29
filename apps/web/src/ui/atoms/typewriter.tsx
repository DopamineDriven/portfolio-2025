"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";

interface TypewriterProps
  extends React.ComponentPropsWithRef<typeof motion.div> {
  text: string;
  delay?: number;
  onTypingComplete?: () => void;
  isActive: boolean;
  lineNumber: number;totalLines: number;
}

const Typewriter = ({
  text,
  delay = 50,
  className,
  onTypingComplete,
  onAnimationComplete,
  isActive,
  lineNumber,
  totalLines,
  ...props
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef(text);

  const { animationStates, setAnimationComplete } = useAnimationContext()

  useEffect(() => {
    if (isActive) {
      setDisplayText("")
      setCurrentIndex(0)
      textRef.current = text
    }
  }, [text, isActive])

  useEffect(() => {
    if (!animationStates.hasTypewriterPlayed && isActive) {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }, delay)

        return () => clearTimeout(timeout)
      } else if (currentIndex === text.length) {
        if (onTypingComplete) {
          onTypingComplete()
        }
        if (lineNumber === totalLines) {
          setAnimationComplete("hasTypewriterPlayed")
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
  ])

  if (animationStates.hasTypewriterPlayed) {
    return <div className={cn(className)}>{text}</div>
  }

  return (
    <AnimatePresence>
      <motion.div
        key={text}
        className={cn(`block`, className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={onAnimationComplete}
        {...props}>
        {displayText}
        <motion.span
          className="animate-cursor-blink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

Typewriter.displayName = "Typewriter";

export type { TypewriterProps };

export default Typewriter;
