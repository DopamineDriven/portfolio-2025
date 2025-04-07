"use client";

import { useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { ElevatorExperienceWorkup } from "@/ui/elevator/workup";
import { getCookieDomain } from "@/lib/site-domain";

export default function ElevatorExperience() {
  const memoizedCookieDomain = useMemo(() => getCookieDomain(), [])
  useEffect(() => {
    // Security script handling
    window.postMessage({ type: "exclude", nonce: "nonce" }, "*");

    // Cookie initialization
    const hasVisitedCookie = Cookies.get("has-visited");
    console.log("[CLIENT] Initial cookie check on elevator page:", {
      hasVisitedCookie
    });

    if (!hasVisitedCookie) {
      Cookies.set("has-visited", "pending", {
        path: "/",
        expires: 1, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV !== "development",
        domain: memoizedCookieDomain
      });
      console.log("[CLIENT] Initialized pending has-visited cookie");
    }
  }, [memoizedCookieDomain]);

  return <ElevatorExperienceWorkup />;
}
