"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [icon, setIcon] = useState<"sun" | "moon">("sun");

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIcon(e.matches ? "sun" : "moon");
    };

    // Set initial icon based on system preference
    setIcon(mediaQuery.matches ? "sun" : "moon");

    // Listen for changes in system preference
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIcon(theme === "dark" ? "sun" : "moon");
    }
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <motion.nav
      className="bg-background/80 border-border fixed left-0 right-0 top-0 z-50 w-full border-b shadow-sm backdrop-blur-sm transition-all duration-300"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="animate-fade-right text-xl font-bold text-foreground animate-delay-300 animate-once animate-ease-in-out">
              MDX Code Snippets
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 animate-pulse rounded-md p-2 animate-duration-[2000ms] animate-infinite"
              aria-label="Toggle dark mode">
              {icon === "sun" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
