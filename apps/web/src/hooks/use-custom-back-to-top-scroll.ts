"use client";
import { useCallback } from "react"

const useCustomBackToTopScroll = (duration = 1000) => {
  const scrollToTop = useCallback(() => {
    const start = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    if (start === 0) return

    const startTime = performance.now()

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      let n = elapsed / duration
      if (n > 1) n = 1

      let progress: number
      if (n <= 0.33) {
        const u = n / 0.33
        progress = 0.33 * (u * u)
      } else if (n <= 0.6) {
        const u = (n - 0.33) / 0.27
        progress = 0.33 + 0.27 * (1 - Math.pow(1 - u, 2))
      } else if (n <= 0.95) {
        const u = (n - 0.6) / 0.35
        progress = 0.6 + 0.35 * (u * u)
      } else {
        const u = (n - 0.95) / 0.05
        progress = 0.95 + 0.05 * (1 - Math.pow(1 - u, 2))
      }

      const newScroll = start * (1 - progress)
      window.scrollTo(0, newScroll)

      if (n < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [duration])

  return scrollToTop
}

export default useCustomBackToTopScroll

