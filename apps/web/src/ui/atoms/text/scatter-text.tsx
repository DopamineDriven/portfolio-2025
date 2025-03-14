"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { animate, hover } from "motion"
import { splitText } from "motion-plus"
import { useMotionValue } from "motion/react"
import type { ScatterTextProps } from "@/ui/atoms/types/scatter-text"
import { cn } from "@/lib/utils"
import { useResizeObserver } from "@/hooks/use-resize-observer"

export default function ScatterText({
  initialElement,
  content,
  animateTarget = "chars",
  animationOptions = { type: "spring", stiffness: 100, damping: 50 },
  as: Tag = "h1",
  className,
  headingClassName,
  keyframes = { x: 0, y: 0 },
  maxWidth = "420px",
  debug = false,
  allowOverflow = false,
}: ScatterTextProps) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node)
  }, [])

  const { width: containerWidth } = useResizeObserver({ current: containerElement })
  const elementRef = useRef<HTMLElement | null>(null)

  // Memoized callback for the text element ref
  const textRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && !initialElement) {
        elementRef.current = node
      }
    },
    [initialElement],
  )

  const keyframesRef = useRef(keyframes)
  const velocityX = useMotionValue(0)
  const velocityY = useMotionValue(0)
  const prevEvent = useRef(0)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    keyframesRef.current = keyframes
  }, [keyframes])

  useEffect(() => {
    if (debug) {
      console.log(`[${maxWidth}]: ${containerWidth}px`)
    }
  }, [maxWidth, containerWidth, debug])



  useEffect(() => {
    if (!containerElement || !elementRef.current) return

    try {
      const target = splitText(elementRef.current)

      const handlePointerMove = (event: PointerEvent) => {
        const now = performance.now()
        const timeSinceLastEvent = Math.max(0.001, (now - prevEvent.current) / 1000)
        prevEvent.current = now
        velocityX.set(event.movementX / timeSinceLastEvent)
        velocityY.set(event.movementY / timeSinceLastEvent)
      }

      document.addEventListener("pointermove", handlePointerMove)

      const handleHoverStart = (element: Element, _event: PointerEvent) => {
        const speed = Math.sqrt(velocityX.get() * velocityX.get() + velocityY.get() * velocityY.get())
        const angle = Math.atan2(velocityY.get(), velocityX.get())
        const distance = speed * 0.1

        const dynamicKeyframes = {
          ...keyframesRef.current,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        }

        animate(element, dynamicKeyframes, animationOptions)

        return (event: PointerEvent) => {
          event
          // Optional hover end handler
        }
      }

      hover(target[animateTarget], handleHoverStart)

      return () => {
        document.removeEventListener("pointermove", handlePointerMove)
      }
    } catch (err) {
      console.error("Error in ScatterText effect:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }, [content, containerElement, animateTarget, animationOptions, velocityX, velocityY])

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error rendering animated text: {error.message}</p>
        <p>{content}</p>
      </div>
    )
  }

  const getWidthClass = () => {
    if (!maxWidth) return ""

    if (["full", "fit", "auto", "none"].includes(maxWidth)) {
      return `max-w-${maxWidth}`
    }

    if (maxWidth.endsWith("%")) {
      return `max-w-[${maxWidth}]`
    }

    return `max-w-[${maxWidth}]`
  }

  return (
    <div
      className={cn(
        "container flex flex-col items-center justify-center text-left relative space-y-2",
        allowOverflow ? "overflow-visible" : "overflow-hidden",
        getWidthClass(),
        className,
      )}
      ref={containerRef}
      aria-label={`Interactive text: ${content}`}
    >
      <Tag
        ref={textRef}
        className={cn("leading-none tracking-[-0.04em] will-change-[transform,opacity]", headingClassName)}
      >
        {content}
      </Tag>

      {debug && (
        <div className="relative mt-2 text-xs text-gray-400 bg-black/50 px-1 rounded">
          Width: {containerWidth.toFixed(0)}px
        </div>
      )}
    </div>
  )
}
ScatterText.displayName = "ScatterText"

