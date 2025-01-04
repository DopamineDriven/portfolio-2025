"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const useThemeTransition = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [transitioning, setTransitioning] = useState(false);
  const [transitionTheme, setTransitionTheme] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (theme === "system") {
      setTransitionTheme(systemTheme);
    } else {
      setTransitionTheme(theme);
    }
  }, [theme, systemTheme]);

  useEffect(() => {
    if (transitionTheme !== undefined) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 500); // match timeout delay with --theme-transition-duration css variable
      return () => clearTimeout(timer);
    }
  }, [transitionTheme]);

  const toggleTheme = () => {
    setTheme(transitionTheme === "dark" ? "light" : "dark");
  };

  return { transitionTheme, transitioning, toggleTheme };
};

/*
"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export const useThemeTransition = () => {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()
  const [transitioning, setTransitioning] = useState(false)
  const [transitionTheme, setTransitionTheme] = useState<string | undefined>(undefined)
  console.log(`resolved: ${resolvedTheme} \n system: ${systemTheme}`)
  useEffect(() => {
    if (theme === 'system') {
      setTransitionTheme(resolvedTheme)
    } else {
      setTransitionTheme(resolvedTheme)
    }
  }, [theme, resolvedTheme])

  useEffect(() => {
    if (transitionTheme !== undefined) {
      setTransitioning(true)
      const timer = setTimeout(() => {
        setTransitioning(false)
      }, 500) // Match this with the --theme-transition-duration in CSS
      return () => clearTimeout(timer)
    }
  }, [transitionTheme])

  const toggleTheme = () => {
    setTheme(transitionTheme === 'dark' ? 'light' : 'dark')
  }

  return { transitionTheme, transitioning, toggleTheme, resolvedTheme };
}


*/
