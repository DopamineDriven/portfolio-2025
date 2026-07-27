"use client";

import type { CustomComponentPropsWithRef } from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button, Moon, Sun } from "@portfolio/ui";

export function ThemeToggle({
  className,
  ...props
}: CustomComponentPropsWithRef<typeof Button>) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Determine the icon to show before mount, based on system preference or stored theme (via script)
  let initialIcon = <Sun className="size-5" />; // Default to Sun
  if (typeof window !== "undefined") {
    const scriptSetDark = document.documentElement.classList.contains("dark");
    if (scriptSetDark) {
      initialIcon = <Moon className="size-5" />;
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        disabled // Disable button until mounted to prevent interaction issues
        aria-label="Toggle theme (loading)"
        {...props}>
        {initialIcon}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      {...props}>
      {resolvedTheme === "dark" ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
