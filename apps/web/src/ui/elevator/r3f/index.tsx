"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import Cookies from "js-cookie";
import type { ElevatorTransitionEventDetail } from "@/ui/elevator/r3f/custom-event";
import type { ThreeElement } from "@react-three/fiber";
import { useCookies } from "@/context/cookie-context";
import { getCookieDomain } from "@/lib/site-domain";
import { ElevatorScene } from "@/ui/elevator/r3f/scene";
import { TriangleGeometry } from "@/ui/elevator/r3f/triangle-geometry";

extend({ TriangleGeometry });

// Add types to ThreeElements so TypeScript understands triangleGeometry
declare module "@react-three/fiber" {
  interface ThreeElements {
    triangleGeometry: ThreeElement<typeof TriangleGeometry>;
  }
}
export default function ElevatorApp() {
  const [loading, setLoading] = useState(true);

  const [fadeOpacity, setFadeOpacity] = useState(0);

  const { pathOfIntent, clearPathOfIntent } = useCookies();

  const pathOfIntentRef = useRef<string>("/");

  const memoizedCookieDomain = useMemo(() => getCookieDomain(), []);

  const isSecure = useMemo(() => process.env.NODE_ENV !== "development", []);

  const navigationTriggeredRef = useRef(false);

  useEffect(() => {
    if (pathOfIntent) {
      pathOfIntentRef.current = pathOfIntent;
      console.log("[CLIENT] Path of intent from context:", pathOfIntent);
    } else {
      // Fallback: Try to read directly from cookies if context doesn't have it
      const poiCookie = Cookies.get("poi");
      if (poiCookie) {
        pathOfIntentRef.current = poiCookie;
      }
    }
  }, [pathOfIntent]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const router = useRouter();

  // Listen for transition events from the scene
  useEffect(() => {
    const handleTransition = (
      e: CustomEvent<ElevatorTransitionEventDetail>
    ) => {
      setFadeOpacity(e.detail.progress);
      if (e.detail.progress >= 0.95 && !navigationTriggeredRef.current) {
        navigationTriggeredRef.current = true;

        // Set the has-visited cookie
        Cookies.set("has-visited", "true", {
          path: "/",
          sameSite: "lax",
          secure: isSecure,
          domain: memoizedCookieDomain
        });
        const destination = pathOfIntentRef.current ?? "/";
        if (clearPathOfIntent) {
          clearPathOfIntent();
        }
        setTimeout(() => {
          console.log("[CLIENT] router.push event to: ", destination);
          router.push(decodeURIComponent(destination));
          router.refresh();
        }, 1000);
      }
    };

    window.addEventListener(
      "elevator-transition",
      handleTransition as EventListener
    );

    return () => {
      window.removeEventListener(
        "elevator-transition",
        handleTransition as EventListener
      );
    };
  }, [isSecure, memoizedCookieDomain, router, clearPathOfIntent]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <div className="text-xl text-white">Loading Elevator...</div>
        </div>
      )}

      {/* Fade overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-black transition-opacity duration-500"
        style={{ opacity: fadeOpacity }}
      />

      <Canvas
        className="absolute top-0 left-0 z-20 min-h-[100dvh] min-w-screen items-center justify-center bg-black/80"
        shadows
        camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 1.6, 5] }}>
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 6]}
            fov={30}
            near={0.1}
            far={100}
          />
          <ElevatorScene />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
            resolution={256}
          />
        </Suspense>
      </Canvas>
    </>
  );
}
