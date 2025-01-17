"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set the initial value
    setMatches(media.matches);

    // Define our event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener to begin watching for changes
    media.addEventListener("change", listener);

    // Remove the listener when the component unmounts
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
/*
It takes a media query string as an argument (e.g., "(max-width: 768px)").
It uses the `useState` hook to keep track of whether the media query matches.
It uses the `useEffect` hook to add a listener for changes to the media query match state.
It returns a boolean indicating whether the media query currently matches.*/
