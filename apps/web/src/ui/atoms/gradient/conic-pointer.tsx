"use client";

import { useRef } from "react";
import { HTMLMotionProps, motion, useMotionValue, useTransform } from "motion/react";
import { useElementDimensions } from "@/hooks/use-element-dimensions";
import { useViewportDimensions } from "@/hooks/use-viewport-dimensions";

function ConicPointer() {
  const ref = useRef<HTMLDivElement & HTMLMotionProps<"div">>(null);
  const [{ width, height, top, left }, measure] = useElementDimensions(ref);
  const { width: viewportWidth, height: viewportHeight } =
    useViewportDimensions();

  const gradientX = useMotionValue(0.5);
  const gradientY = useMotionValue(0.5);
  const background = useTransform(
    () =>
      `conic-gradient(from 0deg at calc(${gradientX.get() * 100}% - ${left}px) calc(${
        gradientY.get() * 100
      }% - ${top}px), var(--color-hue-5), var(--color-hue-1), var(--color-hue-0), var(--color-hue-5))`
  );

  // Calculate responsive dimensions based on viewport
  const elementSize = Math.min(
    800, // Maximum size
    Math.min(viewportWidth, viewportHeight) * 0.7 // 70% of the smaller viewport dimension
  );

  return (
    <div
          className="absolute inset-0 flex items-center justify-center"
      onPointerMove={e => {
        gradientX.set(e.clientX / width);
        gradientY.set(e.clientY / height);
      }}>
      <motion.div
        ref={ref}
        style={{
          background,
          width: elementSize,
          height: elementSize,
          borderRadius: Math.max(25, elementSize * 0.125), // Responsive border radius
          cursor: "none"
        }}
        onPointerEnter={() => measure()}
      />
    </div>
  );
}
ConicPointer.displayName = "ConicPointer";

export { ConicPointer };
