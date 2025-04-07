"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform
} from "motion/react";
import { useCookies } from "@/context/cookie-context";
import { useResizeObs as useResizeObserver } from "@/hooks/use-resize-obs";
import { useWindowSize } from "@/hooks/use-window-size";
import { getCookieDomain } from "@/lib/site-domain";
import { cn } from "@/lib/utils";

// Audio URLs
const elevatorAudio = {
  shortest:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-shortest.mp3",
  elevatorDoorOpen:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/audio/elevator-door-open.mp3",
  elevatorButtonSound:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/audio/elevator-button-sound.mp3",
  outieToInnieTransition:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/audio/elevator-outie-to-innie-switch.mp3"
};

export function ElevatorExperienceWorkup() {
  const memoizedCookieDomain = useMemo(() => getCookieDomain(), []);
  const isSecure = useMemo(() => process.env.NODE_ENV !== "development", []);
  const router = useRouter();
  const { pathOfIntent, clearPathOfIntent } = useCookies();
  const [stage, setStage] = useState<
    "initial" | "buttonPressed" | "doorsOpening" | "entering" | "transitioning"
  >("initial");
  const [isPulsing, setIsPulsing] = useState(true);
  const pathOfIntentRef = useRef<string>("/"); // Default to home page
  const [isMobile, setIsMobile] = useState(false);

  // Audio refs - using direct refs like in your working version
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const doorAudioRef = useRef<HTMLAudioElement | null>(null);
  const buttonAudioRef = useRef<HTMLAudioElement | null>(null);
  const transitionAudioRef = useRef<HTMLAudioElement | null>(null);

  // Refs for measuring elements
  const elevatorRef = useRef<HTMLDivElement>(null);
  const hallwayRef = useRef<HTMLDivElement>(null);

  // Get dimensions
  const elevatorDimensions = useResizeObserver(elevatorRef);
  const windowSize = useWindowSize();

  // Calculate floor height based on elevator position
  const [floorHeight, setFloorHeight] = useState("15dvh");

  // Perspective and movement controls - using a single continuous motion
  const perspective = useSpring(1000, { stiffness: 80, damping: 30 });
  const cameraZ = useSpring(0, { stiffness: 60, damping: 25 });
  const cameraY = useSpring(0, { stiffness: 60, damping: 25 });

  // Door animation controls
  const leftDoorX = useSpring(0, { stiffness: 100, damping: 20 });
  const rightDoorX = useSpring(0, { stiffness: 100, damping: 20 });

  // Lighting effects
  const ambientLight = useSpring(0.5, { stiffness: 100, damping: 20 });
  const buttonLight = useSpring(0.3, { stiffness: 100, damping: 20 });
  const indicatorLight = useSpring(0.3, { stiffness: 100, damping: 20 });
  const interiorLight = useSpring(0, { stiffness: 100, damping: 20 });

  // Door seam light effect
  const seamLightOpacity = useMotionValue(0.15);
  const seamLightGlow = useTransform(seamLightOpacity, [0.15, 0.8], [0, 10]);
  const seamLightStyle = useMotionTemplate`0 0 ${seamLightGlow}px rgba(255, 255, 255, 0.8)`;

  // Store the path of intent from context
  useEffect(() => {
    if (pathOfIntent) {
      pathOfIntentRef.current = pathOfIntent;
      console.log("[CLIENT] Path of intent from context:", pathOfIntent);
    } else {
      // Fallback: Try to read directly from cookies if context doesn't have it
      const poiCookie = Cookies.get("poi");
      if (poiCookie) {
        pathOfIntentRef.current = poiCookie;
        console.log(
          "[CLIENT] Path of intent from direct cookie read:",
          poiCookie
        );
      }
    }
  }, [pathOfIntent]);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update floor height when elevator dimensions change
  useEffect(() => {
    if (elevatorDimensions.bottom && windowSize.height) {
      // Calculate the distance from the bottom of the elevator to the bottom of the viewport
      const distanceToBottom = windowSize.height - elevatorDimensions.bottom;

      // Set floor height to match this distance, with a minimum height
      const calculatedHeight = Math.max(distanceToBottom, 50);
      setFloorHeight(`${calculatedHeight}px`);
    }
  }, [elevatorDimensions.bottom, windowSize.height]);

  // Initialize audio - using the approach from your working version
  useEffect(() => {
    audioRef.current = new Audio(elevatorAudio.shortest);
    audioRef.current.volume = 0.5;
    audioRef.current.preload = "auto";
    audioRef.current.crossOrigin = "anonymous";

    doorAudioRef.current = new Audio(elevatorAudio.elevatorDoorOpen);
    doorAudioRef.current.volume = 0.5;
    doorAudioRef.current.preload = "auto";
    doorAudioRef.current.crossOrigin = "anonymous";

    buttonAudioRef.current = new Audio(elevatorAudio.elevatorButtonSound);
    buttonAudioRef.current.volume = 0.5;
    buttonAudioRef.current.preload = "auto";
    buttonAudioRef.current.crossOrigin = "anonymous";

    // Initialize the transition sound effect
    transitionAudioRef.current = new Audio(
      elevatorAudio.outieToInnieTransition
    );
    transitionAudioRef.current.volume = 0.6;
    transitionAudioRef.current.preload = "auto";
    transitionAudioRef.current.crossOrigin = "anonymous";

    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (doorAudioRef.current) doorAudioRef.current.pause();
      if (buttonAudioRef.current) buttonAudioRef.current.pause();
      if (transitionAudioRef.current) transitionAudioRef.current.pause();
    };
  }, []);

  // Handle elevator button press
  const handleElevatorButtonPress = () => {
    if (stage !== "initial") return;

    setStage("buttonPressed");
    setIsPulsing(false);

    // Play button press sound
    if (buttonAudioRef.current) {
      buttonAudioRef.current.play().catch(err => {
        console.log("Button audio playback failed:", err);
      });
    }

    // Illuminate button and indicator
    buttonLight.set(1);
    indicatorLight.set(1);

    // Wait a moment before doors start opening
    setTimeout(() => {
      setStage("doorsOpening");
      seamLightOpacity.set(0.8);

      // Play door opening sound
      if (doorAudioRef.current) {
        doorAudioRef.current.play().catch(err => {
          console.log("Door audio playback failed:", err);
        });
      }

      // Open the doors
      leftDoorX.set(-100);
      rightDoorX.set(100);

      // Gradually increase interior lighting as doors open
      interiorLight.set(0.7);

      // After doors fully open, begin entering with a SINGLE FLUID MOTION
      setTimeout(() => {
        setStage("entering");

        // Play elevator sound
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.log("Elevator audio playback failed:", err);
          });
        }

        // IMPORTANT: Make sure we have the has-visited cookie set
        // This ensures we don't get redirected back to elevator after navigation
        Cookies.set("has-visited", "true", {
          path: "/",
          expires: 1,
          sameSite: "lax",
          secure: isSecure,
          domain: memoizedCookieDomain
        });
        console.log(
          "[CLIENT] Ensuring has-visited cookie is set with domain:",
          window.location.hostname === "localhost" ? "localhost" : undefined
        );

        // Clear the path of intent cookie as it's no longer needed
        // But we've already stored it in our ref
        clearPathOfIntent();

        // SMOOTH CONTINUOUS MOTION into the elevator
        // Use a single fluid motion with proper spring physics
        cameraZ.set(500);
        cameraY.set(-30);
        perspective.set(700);

        // After entering, transition to site
        setTimeout(() => {
          setStage("transitioning");

          // Play the outie to innie transition sound
          if (transitionAudioRef.current) {
            transitionAudioRef.current.play().catch(err => {
              console.log("Transition audio playback failed:", err);
            });
          }

          // Redirect to the original destination after animation
          setTimeout(() => {
            const destination = pathOfIntentRef.current ?? "/";
            console.log("[CLIENT] Navigating to:", destination);
            router.push(decodeURIComponent(destination));
            router.refresh();
          }, 2000); // Extended slightly to allow transition sound to play
        }, 3000);
      }, 1500);
    }, 800);
  };

  // Create brushed metal texture CSS
  const brushedMetalStyle = {
    background: `
      linear-gradient(90deg,
        rgba(180,180,180,0.8) 0%,
        rgba(200,200,200,0.9) 20%,
        rgba(190,190,190,0.85) 40%,
        rgba(210,210,210,0.9) 60%,
        rgba(180,180,180,0.8) 80%,
        rgba(190,190,190,0.85) 100%
      )
    `,
    backgroundSize: "200% 100%",
    backgroundPosition: "left center"
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#2a2a2a]">
      {/* Main scene container with perspective */}
      <motion.div
        className="relative h-full w-full"
        style={{
          perspective: perspective,
          backgroundColor: "#2a2a2a"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}>
        {/* Camera/viewport that moves into the elevator */}
        <motion.div
          className="relative h-full w-full"
          style={{
            z: cameraZ,
            y: cameraY,
            transformStyle: "preserve-3d"
          }}>
          {/* Hallway with elevator */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            ref={hallwayRef}>
            {/* Hallway walls - using the knockdown texture from Severance */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              style={{
                opacity: useTransform(ambientLight, [0, 1], [0.7, 1]),
                background: "#e6e6e6",
                // Knockdown texture effect
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/svg%3E")`,
                boxShadow: "inset 0 0 50px rgba(0,0,0,0.1)"
              }}>
              {/* Vertical panel separators - using dvw for consistent width */}
              <div className="absolute top-0 bottom-0 left-[20%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
              <div className="absolute top-0 bottom-0 left-[40%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
              <div className="absolute top-0 bottom-0 left-[60%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
              <div className="absolute top-0 bottom-0 left-[80%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
            </motion.div>

            {/* Elevator frame and surround - using viewport-relative units with mobile adjustments */}
            <div
              ref={elevatorRef}
              className={cn(
                `relative aspect-[400/650] h-auto transform-gpu bg-transparent`,
                isMobile ? "w-[35dvw] md:w-[23.14814dvw]" : "w-[23.14814dvw]"
              )}
              style={{
                // For mobile, adjust vertical position to be more centered
                marginTop: isMobile ? "-5dvh" : "0"
              }}>
              {/* Elevator frame */}
              <div className="absolute inset-0 overflow-hidden border-2 border-[#333] bg-[#444]">
                {/* Elevator header/frame */}
                <div className="absolute top-0 right-0 left-0 flex h-[3.90625dvw] items-center justify-center border-b border-[#333] bg-[#555]">
                  {/* Triangular indicator above elevator */}
                  <motion.div
                    className="flex aspect-[120/40] h-auto w-[7.8125dvw] items-center justify-center rounded-sm bg-[#222]"
                    style={{
                      boxShadow: useMotionTemplate`0 0 ${useTransform(indicatorLight, [0, 1], [2, 15])}px rgba(255, 165, 0, ${indicatorLight})`
                    }}>
                    <motion.div
                      className="h-0 w-0 border-t-[1.628dvw] border-r-[0.9765625dvw] border-l-[0.9765625dvw] border-r-transparent border-l-transparent"
                      style={{
                        borderTopColor: useMotionTemplate`rgba(255, 165, 0, ${indicatorLight})`
                      }}
                    />
                  </motion.div>
                </div>

                {/* Elevator doors container */}
                <div className="absolute top-[3.90625dvw] right-0 bottom-0 left-0 overflow-x-hidden bg-[#333]">
                  {/* Left door - brushed metal effect */}
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 w-1/2 border-r border-[#555]"
                    style={{
                      x: leftDoorX,
                      ...brushedMetalStyle
                    }}
                  />

                  {/* Right door - brushed metal effect */}
                  <motion.div
                    className="absolute top-0 right-0 bottom-0 w-1/2 border-l border-[#555]"
                    style={{
                      x: rightDoorX,
                      ...brushedMetalStyle
                    }}
                  />

                  {/* Door seam light effect - using dvw for consistent width */}
                  <motion.div
                    className="absolute top-0 bottom-0 left-1/2 z-10 w-[0.130208333dvw] -translate-x-1/2 transform bg-white"
                    style={{
                      opacity: seamLightOpacity,
                      boxShadow: seamLightStyle
                    }}
                  />

                  {/* Elevator interior (visible when doors open) */}
                  <div className="absolute inset-0 -z-10">
                    {/* Back wall */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-[#888] to-[#777]"
                      style={{
                        opacity: interiorLight
                      }}>
                      {/* Interior details */}
                      <motion.div
                        className="absolute top-[5%] right-[10%] left-[10%] h-[3%] rounded-sm bg-white"
                        style={{
                          boxShadow: useMotionTemplate`0 0 ${useTransform(interiorLight, [0, 1], [5, 20])}px rgba(255, 255, 255, ${interiorLight})`
                        }}
                      />

                      {/* Side panels */}
                      <div className="absolute top-[15%] bottom-[15%] left-[5%] w-[5%] bg-[#666]"></div>
                      <div className="absolute top-[15%] right-[5%] bottom-[15%] w-[5%] bg-[#666]"></div>

                      {/* Floor */}
                      <div className="absolute right-0 bottom-0 left-0 h-[15%] bg-[#555]"></div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Call button panel - adjusted for mobile */}
              <motion.div
                className={cn(
                  `absolute top-1/2 flex aspect-[60/100] h-auto -translate-y-1/2 transform flex-col items-center justify-center rounded-sm border border-[#222] bg-[#333]`,
                  isMobile
                    ? "right-[-7.8dvw] w-[5.85dvw]"
                    : "right-[-5.2dvw] w-[3.90625dvw]"
                )}
                style={{
                  boxShadow: "0 0 10px rgba(0,0,0,0.3)"
                }}>
                <button
                  onClick={handleElevatorButtonPress}
                  disabled={stage !== "initial"}
                  className={cn(
                    `relative flex items-center justify-center overflow-hidden rounded-sm bg-[#222] focus:outline-none`,
                    isMobile ? "size-[3.9dvw]" : "size-[2.6dvw]", stage ==="initial" ? "animate-pulse" : ""
                  )}
                  aria-label="Call elevator">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-[#222]"
                    style={{
                      boxShadow: useMotionTemplate`inset 0 0 ${useTransform(buttonLight, [0, 1], [2, 10])}px rgba(255, 165, 0, ${buttonLight})`
                    }}>
                    <motion.div
                      animate={{
                        opacity: isPulsing ? [0.7, 1, 0.7] : 1
                      }}
                      transition={{
                        repeat: isPulsing ? Number.POSITIVE_INFINITY : 0,
                        duration: 2
                      }}
                      className={cn(
                        `h-0 w-0 border-r-transparent border-l-transparent`,
                        isMobile
                          ? "border-t-[1.17dvw] border-r-[0.78dvw] border-l-[0.78dvw]"
                          : "border-t-[0.78125dvw] border-r-[0.5208dvw] border-l-[0.5208dvw]"
                      )}
                      style={{
                        borderTopColor: useMotionTemplate`rgba(255, 165, 0, ${buttonLight})`
                      }}
                    />
                  </motion.div>
                </button>
              </motion.div>
            </div>

            {/* Dynamically sized floor that aligns with the bottom of the elevator */}
            <div
              className="absolute right-0 bottom-0 left-0 bg-[#1a1a1a]"
              style={{
                height: floorHeight,
                // Ensure the floor is positioned correctly relative to the elevator
                top: elevatorDimensions.bottom
                  ? `${elevatorDimensions.bottom}px`
                  : "auto"
              }}></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Transition overlay for final transition */}
      <AnimatePresence>
        {stage === "transitioning" && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }} // Extended to match transition sound
          />
        )}
      </AnimatePresence>
    </div>
  );
}
