"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export type CookieContextType = {
  hasVisited: boolean;
  pathOfIntent: string | null;
  clearPathOfIntent: () => void;
};

const CookieContext = createContext<CookieContextType>({
  hasVisited: false,
  pathOfIntent: null,
  clearPathOfIntent: () => {}
});

export const useCookies = () => useContext(CookieContext);

export function CookieProvider({ children }: { children: ReactNode }) {
  const [hasVisited, setHasVisited] = useState(false);
  const [pathOfIntent, setPathOfIntent] = useState<string | null>(null);

  // Initialize cookie state on mount - read-only
  useEffect(() => {
    // Function to read cookies
    const readCookies = () => {
      try {
        // Try to read cookies directly from document.cookie
        const cookieString = document.cookie;
        console.log("[CLIENT] Raw cookie string:", cookieString);

        // Parse cookies manually to avoid any js-cookie issues
        const hasVisitedValue = cookieString
          .split("; ")
          .find(row => row.startsWith("has-visited="))
          ?.split("=")?.[1];

        const poiValue = cookieString
          .split("; ")
          .find(row => row.startsWith("poi="))
          ?.split("=")[1];

        // Also try js-cookie for comparison
        const jsHasVisited = Cookies.get("has-visited");
        const jsPoi = Cookies.get("poi");

        console.log("[CLIENT] Reading cookies:", {
          manual: { hasVisitedValue, poiValue },
          jsCookie: { jsHasVisited, jsPoi }
        });

        setHasVisited(!!hasVisitedValue || !!jsHasVisited);
        setPathOfIntent(poiValue || jsPoi || null);
      } catch (error) {
        console.error("[CLIENT] Error reading cookies:", error);
      }
    };

    // Read cookies immediately
    readCookies();

    // Also set up an interval to read cookies for a short time
    // This helps catch cookies that might be set by middleware after initial load
    const intervalId = setInterval(readCookies, 500);

    // Clear interval after 3 seconds
    setTimeout(() => {
      clearInterval(intervalId);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Clear path of intent cookie
  const clearPathOfIntent = () => {
    console.log("[CLIENT] Clearing POI cookie");
    try {
      // Try multiple approaches to ensure the cookie is cleared
      Cookies.remove("poi", { path: "/" });

      // Also try setting an expired cookie as a fallback
      document.cookie = "poi=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setPathOfIntent(null);
    } catch (error) {
      console.error("[CLIENT] Error clearing POI cookie:", error);
    }
  };

  const value = {
    hasVisited,
    pathOfIntent,
    clearPathOfIntent
  };

  return (
    <CookieContext.Provider value={value}>{children}</CookieContext.Provider>
  );
}
