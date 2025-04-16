"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const ArLogoMotion = ({
  style,
  className,
  ...svg
}: Omit<
  ComponentPropsWithRef<typeof motion.svg>,
  "viewBox" | "xmlns" | "role" | "aria-label" | "fill"
>) => {
  return (
    <motion.svg
      style={style}
      className={cn(className)}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AR Logo"
      fill="none"
      {...svg}>
      <path d="M107.701 334.338L177.229 173.979H202.963L272.49 334.338H243.144L227.117 295.897H152.397L136.144 334.338H107.701ZM162.556 271.103H216.959L189.644 207.417L162.556 271.103Z" />
      <path d="M258.93 334.336V175.112H329.36C347.717 175.112 362.089 179.699 372.476 188.873C382.86 198.05 388.055 210.368 388.055 225.838C388.055 238.426 384.669 248.775 377.897 256.886C371.125 265 361.945 270.725 350.354 274.061L393.021 334.339H360.286L321.011 278.839H286.699V334.339H258.933L258.93 334.336ZM286.695 254.042H327.325C337.258 254.042 345.162 251.619 351.031 246.762C356.897 241.912 359.838 235.315 359.838 226.973C359.838 218.482 356.978 211.958 351.26 207.412C345.541 202.862 337.487 200.586 327.103 200.586H286.699V254.039L286.695 254.042Z" />
      <path d="M256 512C394.144 512 512 394.144 512 256C512 117.856 394.144 0 256 0C117.856 0 0 117.856 0 256C0 394.144 117.856 512 256 512ZM256 500C124.935 500 12 387.065 12 256C12 124.935 124.935 12 256 12C387.065 12 500 124.935 500 256C500 387.065 387.065 500 256 500Z" />
    </motion.svg>
  );
};
/**
 "use client"

import { motion, useSpring, useTransform } from "motion/react"
import { useEffect } from "react"

function LoadingFillText() {
  const progress = useMockLoading()
  const clipPath = useTransform(progress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])

  return (
    <div className="container">
      <div className="svg-container">
        // Background SVG (semi-transparent)
        <svg
          className="svg svg-bg"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="AR Logo"
          fill="none"
          aria-hidden
        >
          <path d="M107.701 334.338L177.229 173.979H202.963L272.49 334.338H243.144L227.117 295.897H152.397L136.144 334.338H107.701ZM162.556 271.103H216.959L189.644 207.417L162.556 271.103Z" />
          <path d="M258.93 334.336V175.112H329.36C347.717 175.112 362.089 179.699 372.476 188.873C382.86 198.05 388.055 210.368 388.055 225.838C388.055 238.426 384.669 248.775 377.897 256.886C371.125 265 361.945 270.725 350.354 274.061L393.021 334.339H360.286L321.011 278.839H286.699V334.339H258.933L258.93 334.336ZM286.695 254.042H327.325C337.258 254.042 345.162 251.619 351.031 246.762C356.897 241.912 359.838 235.315 359.838 226.973C359.838 218.482 356.978 211.958 351.26 207.412C345.541 202.862 337.487 200.586 327.103 200.586H286.699V254.039L286.695 254.042Z" />
          <path d="M256 512C394.144 512 512 394.144 512 256C512 117.856 394.144 0 256 0C117.856 0 0 117.856 0 256C0 394.144 117.856 512 256 512ZM256 500C124.935 500 12 387.065 12 256C12 124.935 124.935 12 256 12C387.065 12 500 124.935 500 256C500 387.065 387.065 500 256 500Z" />
        </svg>


        <motion.svg
          className="svg svg-fill"
          style={{ clipPath }}
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="AR Logo"
          fill="none"
        >
          <path d="M107.701 334.338L177.229 173.979H202.963L272.49 334.338H243.144L227.117 295.897H152.397L136.144 334.338H107.701ZM162.556 271.103H216.959L189.644 207.417L162.556 271.103Z" />
          <path d="M258.93 334.336V175.112H329.36C347.717 175.112 362.089 179.699 372.476 188.873C382.86 198.05 388.055 210.368 388.055 225.838C388.055 238.426 384.669 248.775 377.897 256.886C371.125 265 361.945 270.725 350.354 274.061L393.021 334.339H360.286L321.011 278.839H286.699V334.339H258.933L258.93 334.336ZM286.695 254.042H327.325C337.258 254.042 345.162 251.619 351.031 246.762C356.897 241.912 359.838 235.315 359.838 226.973C359.838 218.482 356.978 211.958 351.26 207.412C345.541 202.862 337.487 200.586 327.103 200.586H286.699V254.039L286.695 254.042Z" />
          <path d="M256 512C394.144 512 512 394.144 512 256C512 117.856 394.144 0 256 0C117.856 0 0 117.856 0 256C0 394.144 117.856 512 256 512ZM256 500C124.935 500 12 387.065 12 256C12 124.935 124.935 12 256 12C387.065 12 500 124.935 500 256C500 387.065 387.065 500 256 500Z" />
        </motion.svg>
      </div>
      <StyleSheet />
    </div>
  )
}


function useMockLoading() {
  const progress = useSpring(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newProgress = progress.get() + Math.random() * 0.2

      if (newProgress >= 1) {
        clearInterval(interval)
      }

      progress.set(newProgress)
    }, 500)

    return () => clearInterval(interval)
  }, [progress])

  return progress
}


function StyleSheet() {
  return (
    <style>
      {`
            @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap');

            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }

            .svg-container {
                position: relative;
                width: 300px;
                height: 300px;
            }

            .svg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .svg-bg {
                opacity: 0.2;
            }

            .svg-bg path {
                fill: var(--hue-1);
            }

            .svg-fill {
                clip-path: inset(0 100% 0 0);
                will-change: clip-path;
                z-index: 1;
            }

            .svg-fill path {
                fill: var(--hue-1);
            }
            `}
    </style>
  )
}

export default LoadingFillText

 */
