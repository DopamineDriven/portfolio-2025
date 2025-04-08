"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const checkIsMobile = () => {
    const viewportCookie = Cookies.get("viewport");

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
