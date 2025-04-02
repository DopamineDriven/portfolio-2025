"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useAnimationContext } from "@/context/animation-context";
import { cn } from "@/lib/utils";

export function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const { setAnimationComplete } = useAnimationContext();

  useEffect(() => {
    if (pathname !== "/") {
      const timerAltRoute = setTimeout(() => {
        setIsVisible(false);
        setAnimationComplete("hasLoadingAnimationPlayed");
      }, 2000);
      return () => clearTimeout(timerAltRoute);
    }
    if (pathname === "/") {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setAnimationComplete("hasLoadingAnimationPlayed");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pathname, setAnimationComplete]);

  return (
    <motion.div
      className={cn(
        "theme-transition bg-background inset-0 h-screen items-center justify-center",
        isVisible === true ? "fixed z-50 flex" : "z-0 hidden"
      )}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}>
      <motion.div
        className="text-primary px-4 text-center text-4xl font-bold"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        {pathname === "/" ? "Andrew Ross' Portfolio 2025" : pathname}
      </motion.div>
    </motion.div>
  );
}
/**
 "use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}>
      <motion.div
        className="text-primary text-4xl font-bold"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        MDX Code Snippets
      </motion.div>
    </motion.div>
  );
}
 */
