"use client"

import { useEffect, useState } from "react"

export function useViewportDimensions() {
  // Start with null to indicate dimensions aren't available yet
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    // Only set dimensions on the client after first render
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [])

  // Return a consistent object shape with default values
  return dimensions ?? { width: 0, height: 0 }
}

