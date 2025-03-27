"use client";

import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";

export function OrientationOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-md p-6 text-center">
        <motion.div
          className="mb-8 flex justify-center text-white"
          animate={{
            rotate: [0, -90],
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 1.5,
              ease: "easeInOut"
            }
          }}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <RotateCcw className="h-8 w-8" />
            </div>
            <svg
              width="100"
              height="180"
              viewBox="0 0 100 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect
                x="5"
                y="5"
                width="90"
                height="170"
                rx="15"
                stroke="white"
                strokeWidth="4"
                fill="none"
              />
              <rect x="45" y="155" width="10" height="4" rx="2" fill="white" />
            </svg>
          </div>
        </motion.div>

        <h2 className="mb-4 text-2xl font-bold text-white">
          Please Rotate Your Device
        </h2>
        <p className="mb-2 text-white/80">
          For the best Pong experience, please rotate your device to landscape
          mode.
        </p>
        <p className="text-sm text-white/60">
          The game will automatically resume when you rotate your device.
        </p>
      </div>
    </div>
  );
}
