"use client";

import { useEffect, useState } from "react";
import { useCookiesCtx } from "@/context/cookie-context";

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { get } = useCookiesCtx();
  const viewportCookie = get("viewport");
  const checkIsMobile = () => {
    const isTouchDevice =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      window.matchMedia("(pointer: coarse)").matches;

    const vmin = Math.min(window.innerWidth, window.innerHeight);
    const deviceIsMobile = isTouchDevice && vmin < 500;
    if (viewportCookie === "mobile") {
      setIsMobile(true);
    } else if (viewportCookie === "desktop") {
      setIsMobile(false);
    } else {
      setIsMobile(deviceIsMobile);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);
    window.addEventListener("orientationchange", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("orientationchange", checkIsMobile);
    };
  }, []);

  return isMobile;
}
