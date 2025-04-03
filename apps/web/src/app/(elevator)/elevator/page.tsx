"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "cookie.js";
import { motion } from "motion/react";

export default function ElevatorPage() {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/audio/elevator-shortest.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle elevator button press
  const handleElevatorButtonPress = () => {
    setIsPressed(true);

    // Play the elevator sound
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log("Audio playback failed:", err);
      });
    }

    // Get the path of intent from cookie
    const pathOfIntent = Cookies.get("poi") || "/";
    // Set visited cookie
    Cookies.set("has-visited", "true", { expires: 60 * 60 });

    // Remove the path of intent cookie as it's no longer needed
    Cookies.remove("poi");

    // Animate door opening
    setTimeout(() => {
      setDoorOpen(true);

      // Redirect to the original destination after animation
      setTimeout(() => {
        router.push(pathOfIntent);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#020817]">
      <div className="relative aspect-[9/16] w-full max-w-md overflow-hidden rounded-lg bg-[#111827]">
        {/* Elevator doors */}
        <motion.div
          className="absolute inset-0 border-r border-[#374151] bg-[#1f2937]"
          initial={{ x: 0 }}
          animate={{ x: doorOpen ? "-50%" : 0 }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        />
        <motion.div
          className="absolute inset-0 border-l border-[#374151] bg-[#1f2937]"
          initial={{ x: 0 }}
          animate={{ x: doorOpen ? "50%" : 0 }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        />

        {/* Elevator button */}
        <div className="absolute right-8 bottom-20 flex flex-col items-center">
          <button
            onClick={handleElevatorButtonPress}
            disabled={isPressed}
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isPressed ? "bg-green-500" : "bg-red-500 hover:bg-red-600"
            } transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none`}>
            <span className="text-2xl text-white">↓</span>
          </button>
          <p className="mt-2 text-sm text-[#f8fafc]">Press to enter</p>
        </div>

        {/* Elevator floor indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 transform rounded bg-black px-4 py-2">
          <span className="font-mono text-xl text-red-500">S</span>
        </div>
      </div>
    </div>
  );
}
