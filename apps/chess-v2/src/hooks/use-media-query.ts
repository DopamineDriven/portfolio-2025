"use client";

import { useEffect, useState } from "react";

/**
   accepts media query string as an arg (eg, "(max-width: 768px)")

  `useState` tracks set (dispatched) media query matches

  `useEffect` listens for changes to media query match state

*/

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    setMatches(media.matches);

    // event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // add listener on component mount to detect changes
    media.addEventListener("change", listener);

    // remove event listener on component unmount (cleanup)
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
