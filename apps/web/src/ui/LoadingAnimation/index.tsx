"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="theme-transition fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}>
      <motion.div
        className="px-4 text-center text-4xl font-bold text-primary"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        {pathname === "/" ? "Andrew Ross' Portfolio 2025" : pathname}
      </motion.div>
    </motion.div>
  );
}
