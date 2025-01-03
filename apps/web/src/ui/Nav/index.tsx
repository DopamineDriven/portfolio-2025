"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeTransition } from "@/hooks/use-theme-transition";
import { Logo } from "@/ui/Vectors/Logo";

export function Navbar() {
  const { transitionTheme, transitioning, toggleTheme } = useThemeTransition();
  return (
    <nav className="theme-transition fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <span className="text-2xl font-bold">
              <Logo />
            </span>
          </div>
          <div>
            <button
              onClick={toggleTheme}
              className="theme-transition rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 dark:text-foreground"
              disabled={transitioning}
              aria-label="Toggle theme">
              {transitionTheme === "dark" ? (
                <Sun className="theme-transition h-5 w-5" />
              ) : (
                <Moon className="theme-transition h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
