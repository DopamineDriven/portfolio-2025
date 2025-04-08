"use client";

import type { Transition } from "motion/react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform
} from "motion/react";

// Simple in-memory cache to track visited routes
const visitedRoutes = new Set<string>();

// Audio URLs
const elevatorAudio = {
  full: "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-full.mp3",
  secondLongest:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-second-longest.mp3",
  secondShortest:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-second-shortest.mp3",
  shortest:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-shortest.mp3"
};

function LoadingAnimation({ children }: { children: React.ReactNode }) {
  const progress = useMockLoading();
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedAudio = useRef(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  const leftEdge = useMotionValue("calc(50% - 2px)");
  const rightEdge = useMotionValue("calc(50% + 2px)");
  const topEdge = useTransform(progress, [0, 1], ["50%", "0%"]);
  const bottomEdge = useTransform(progress, [0, 1], ["50%", "100%"]);

  /**
   * Ideally this would be as simple as something like inset() but this would leave
   * the bit in the middle visible, whereas we want to punch out the bit in the
   * middle and leave the rest. So to fix this we create a polygon that cuts into
   * the middle with a thin line and then opens that thin line once progress is 1
   */
  const clipPath = useMotionTemplate`polygon(
      0% 0%, ${leftEdge} 0%, ${leftEdge} ${topEdge}, ${leftEdge} ${bottomEdge}, ${rightEdge} ${bottomEdge}, ${rightEdge} ${topEdge},
      ${leftEdge} ${topEdge}, ${leftEdge} 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%
    )`;

  // Function to play audio with error handling
  const playAudio = () => {
    if (audioRef.current && !hasPlayedAudio.current) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasPlayedAudio.current = true;
            setShowPlayButton(false);
          })
          .catch(error => {
            console.log("Audio playback was prevented by the browser:", error);
            // Show play button if autoplay fails
            setShowPlayButton(true);
          });
      }
    }
  };

  // Initialize audio on component mount
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(elevatorAudio.shortest);
    audioRef.current.crossOrigin = "anonymous"; // Add this line for CORS support
    audioRef.current.volume = 0.4; // Set volume to 40% for subtlety
    audioRef.current.preload = "auto";

    // Set up event handlers for the audio element
    if (audioRef.current) {
      audioRef.current.oncanplaythrough = () => {
        // Audio is ready to play
        console.log("Audio is ready to play");
      };
    }

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Set up user interaction listeners
  useEffect(() => {
    // Create a one-time interaction listener
    const handleInteraction = () => {
      playAudio();
    };

    // Add listeners for common user interactions
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  useMotionValueEvent(progress, "change", latest => {
    // When progress reaches 80%, try to play the elevator sound
    if (latest >= 0.8 && !isLoaded && !hasPlayedAudio.current) {
      playAudio();
    }

    if (latest >= 1 && !isLoaded) {
      setIsLoaded(true);
    }
  });

  useEffect(() => {
    if (!isLoaded) return;

    const transition: Transition = {
      type: "spring",
      visualDuration: 0.5,
      bounce: 0
    };

    animate(leftEdge, "calc(0% - 0px)", transition);
    animate(rightEdge, "calc(100% + 0px)", transition);
  }, [isLoaded, leftEdge, rightEdge]);

  // Handle manual play button click
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAudio();
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {children}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[10000000000] bg-[#f8fafc]"
        animate={{ opacity: isLoaded ? 0 : 1 }}
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[10000000001] bg-[#020817] will-change-[clip-path]"
        style={{ clipPath }}
      />

      {/* Play button that appears if autoplay fails */}
      {showPlayButton && !isLoaded && (
        <button
          onClick={handlePlayButtonClick}
          className="fixed right-4 bottom-4 z-[10000000002] rounded-md bg-[#f8fafc]/10 px-4 py-2 text-[#f8fafc] transition-colors hover:bg-[#f8fafc]/20">
          Play Elevator Sound
        </button>
      )}
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryStr = searchParams.toString();
  const currentUrl = queryStr ? `${pathname}?${queryStr}` : pathname;

  // Skip animation if route is already visited
  const shouldAnimate = !visitedRoutes.has(currentUrl);

  // Add current route to visited routes
  useEffect(() => {
    visitedRoutes.add(currentUrl);
  }, [currentUrl]);

  // If we shouldn't animate, just return children
  if (!shouldAnimate) {
    return (
      <Suspense fallback={<></>}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </Suspense>
    );
  }

  // Otherwise, show the loading animation
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[100dvh] max-w-[96rem] flex-col overflow-x-hidden! sm:px-6 lg:px-8">
          <div className="h-16 w-full animate-pulse bg-[#020817] dark:bg-[#020817]" />{" "}
          {/* Navbar placeholder */}
          <div className="flex-grow bg-[#020817]" /> {/* Content placeholder */}
          <div className="h-32 w-full animate-pulse bg-[#020817] dark:bg-[#020817]" />{" "}
          {/* Footer placeholder */}
        </div>
      }>
      <LoadingAnimation>{children}</LoadingAnimation>
    </Suspense>
  );
}

/**
 * Mock loading hook to simulate a loading progress
 * Adjusted to be slightly slower for a better visual experience
 */
function useMockLoading() {
  const progress = useSpring(0, { stiffness: 300, damping: 40 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newProgress = progress.get() + Math.random() * 0.3;

      if (newProgress >= 1) {
        progress.set(1);
        clearInterval(interval);
      } else {
        progress.set(newProgress);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [progress]);

  return progress;
}
