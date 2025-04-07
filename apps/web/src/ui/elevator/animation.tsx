"use client";

import { useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { getCookieDomain } from "@/lib/site-domain";
import { ElevatorExperienceWorkup } from "@/ui/elevator/workup";

export default function ElevatorExperience() {
  const memoizedCookieDomain = useMemo(() => getCookieDomain(), []);
  const isSecure = useMemo(() => process.env.NODE_ENV !== "development", []);
  useEffect(() => {
    // Security script handling
    window.postMessage({ type: "exclude", nonce: "nonce" }, "*");

    // Cookie initialization
    const hasVisitedCookie = JSON.parse(
      Cookies.get("has-visited") ?? "false"
    ) as boolean;
    console.log("[CLIENT] Initial cookie check on elevator page:", {
      hasVisitedCookie
    });

    if (!hasVisitedCookie) {
      Cookies.set("has-visited", "true", {
        path: "/",
        expires: 1, // 1 day
        sameSite: "lax",
        secure: isSecure,
        domain: memoizedCookieDomain
      });
      console.log("[CLIENT] Initialized pending has-visited cookie");
    }
  }, [memoizedCookieDomain, isSecure]);

  return <ElevatorExperienceWorkup />;
}
