"use client";

import type { MotionStyle } from "motion/react";
import type {
  ComponentPropsWithRef,
  PropsWithChildren,
  ReactNode
} from "react";
import { useCallback, useMemo, useState } from "react";
import { Cursor } from "motion-cursor";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type CustomCursorProps = ComponentPropsWithRef<typeof Cursor>;

interface CustomCursorEntity
  extends PropsWithChildren<Omit<CustomCursorProps, "children">> {
  tooltipContent: ReactNode;
  tooltipClassName?: string;
  consumerClassName?: string;
}

/**
 * have to use style over className for the Cursor component
 * The React DOM style prop, enhanced with support for MotionValues and separate transform values.
 * */
function CustomCursor({
  children,
  tooltipContent,
  style,
  tooltipClassName,
  className,
  consumerClassName,
  ...cursorProps
}: CustomCursorEntity) {
  const [isHovering, setIsHovering] = useState(false);

  const handleHoverStart = useCallback(() => setIsHovering(true), []);
  const handleHoverEnd = useCallback(() => setIsHovering(false), []);
  const defaultCursorStyle = useMemo(
    () =>
      ({
        backgroundColor: "#1f2937",
        borderRadius: 10,
        borderWidth: "2px",
        borderColor: "#f5f5f5",
        borderCollapse: "collapse",

        ...style
      }) satisfies MotionStyle,
    [style]
  );
  return (
    <>
      <AnimatePresence>
        {isHovering && (
          <Cursor
            {...cursorProps}
            className={cn(className)}
            follow
            style={defaultCursorStyle}
            offset={{ x: -20, y: 20 }}
            variants={{ exit: { opacity: 0 } }}>
            <div
              className={cn(
                "font-basis-grotesque-pro font-medium m-0 p-[0.9375rem] text-lg tracking-tight text-[#f5f5f5]",
                tooltipClassName
              )}>
              {tooltipContent}
            </div>
          </Cursor>
        )}
      </AnimatePresence>
      <motion.div
        className={cn(consumerClassName)}
        onHoverEnd={handleHoverEnd}
        onHoverStart={handleHoverStart}>
        {children}
      </motion.div>
    </>
  );
}

CustomCursor.displayName = "CustomCursor";

export { CustomCursor, type CustomCursorEntity };

/**
 "use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"

interface CustomCursorProps {
  tooltipContent: React.ReactNode
  consumerClassName: string // Make this required
}

export const CustomCursor = ({ tooltipContent, consumerClassName }: CustomCursorProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (!consumerClassName) return // Exit early if no className provided

    const consumer = document.querySelector(`.${consumerClassName}`)
    if (consumer) {
      consumer.addEventListener("mousemove", handleMouseMove)
      consumer.addEventListener("mouseleave", handleMouseLeave)
    }
    return () => {
      if (consumer) {
        consumer.removeEventListener("mousemove", handleMouseMove)
        consumer.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [consumerClassName, handleMouseMove, handleMouseLeave])

  return (
    <>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 bg-white shadow-md rounded-md p-2 text-gray-800"
          style={{ left: position.x + 10, top: position.y + 10 }}
        >
          {tooltipContent}
        </div>
      )}
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import useSWR from "swr"

// You'll need to download this file and place it in your public directory
const geoUrl = "/world-110m.json"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function WorldMap() {
  const { data, error } = useSWR("/api/visitor-stats", fetcher, { refreshInterval: 5000 })
  const [maxVisitors, setMaxVisitors] = useState(0)

  useEffect(() => {
    if (data) {
      setMaxVisitors(Math.max(...Object.values(data)))
    }
  }, [data])

  const colorScale = scaleLinear<string>().domain([0, maxVisitors]).range(["#ffedea", "#ff5233"])

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <ComposableMap projection="geoMercator">
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const d = data[geo.properties.ISO_A2] || 0
            return (
              <Geography key={geo.rsmKey} geography={geo} fill={colorScale(d)} stroke="#FFFFFF" strokeWidth={0.5} />
            )
          })
        }
      </Geographies>
    </ComposableMap>
  )
}


 */
