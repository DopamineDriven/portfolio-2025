"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { ElevatorExperienceWorkup } from "@/ui/elevator/workup";

export default function ElevatorExperience() {
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
        secure: process.env.NODE_ENV === "production",
        domain:
          window.location.hostname === "localhost" ? "localhost" : undefined
      });
      console.log("[CLIENT] Initialized pending has-visited cookie");
    }
  }, []);

  return <ElevatorExperienceWorkup />;
}
