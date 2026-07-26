import { useEffect, useRef, useState } from "react";

/**
 * Returns `true` for `ms` milliseconds only when `flag` transitions true -> false.
 * Cancels the window if `flag` becomes true again.
 */
export function useFallingEdgeTimer(flag = false, ms = 3000) {
  const [active, setActive] = useState(false);
  const prevRef = useRef(flag);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prev = prevRef.current;

    // falling edge: true -> false
    if (prev && !flag) {
      // start/restart the grace window
      setActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setActive(false);
        timeoutRef.current = null;
      }, ms);
    }

    // if streaming resumes during the window, cancel it
    if (flag && active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    prevRef.current = flag;
    // don't want ms or active to included in dep array, would cause excessive re-rendering
    // eslint-disable-next-line
  }, [flag]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return active;
}
