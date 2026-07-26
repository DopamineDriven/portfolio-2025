"use client";

import { useEffect } from "react";

export function useResolvedTheme(resolvedTheme?: string) {
  useEffect(() => {
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (!resolvedTheme) {
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      if (resolvedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [resolvedTheme]);
  return resolvedTheme;
}
