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
                "font-basis-grotesque-pro-medium m-0 p-[0.9375rem] text-lg tracking-tight text-[#f5f5f5]",
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
