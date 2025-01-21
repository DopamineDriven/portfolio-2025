"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import { Cursor } from "motion-cursor";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";

type CustomCursorProps = React.ComponentPropsWithRef<typeof Cursor>;

interface CustomCursorEntity extends Omit<CustomCursorProps, "children"> {
  tooltipContent: React.ReactNode;
  tooltipClassName?: string;

  consumerClassName?: string;
}

/**
 * have to use style over className for the Cursor component ⤵
 *
 *
 * The React DOM style prop, enhanced with support for MotionValues and separate transform values.
 * */
const CustomCursor = memo(
  ({
    children,
    tooltipContent,
style,
    tooltipClassName,
    className,
    consumerClassName,
    ...cursorProps
  }: React.PropsWithChildren<CustomCursorEntity>) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleHoverStart = useCallback(() => setIsHovering(true), []);
    const handleHoverEnd = useCallback(() => setIsHovering(false), []);
    const defaultCursorStyle = useMemo(
      () => ({
        backgroundColor: "hsl(0,0%,96%)",
        borderRadius: 10,
        ...style,
      }),
      [style],
    )
    return (
      <>
        <AnimatePresence>
          {isHovering && (
            <Cursor
              {...cursorProps}
              className={cn("rounded-[0.625rem] bg-[hsl(0,0%,96%)]", className)}
              follow
              style={defaultCursorStyle}
              offset={{ x: -20, y: 20 }}
              variants={{ exit: { opacity: 0 } }}>
              <div
                className={cn(
                  "m-0 p-[0.9375rem] font-basis-grotesque-pro-regular text-lg tracking-tight text-[hsl(215_28%_17%)]",
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
);

CustomCursor.displayName = "CustomCursor";

export { CustomCursor, type CustomCursorEntity };

// const CursorConsumer = React.memo(function CursorConsumer({
//   handleHoverEndAction,
//   handleHoverStartAction,
//   children,
//   ...rest
// }: CursorConsumerEntity) {
//   return (
//     <motion.div
//       onHoverStart={handleHoverStartAction}
//       onHoverEnd={handleHoverEndAction}
//       {...rest}>
//       {children}
//     </motion.div>
//   );
// });
// type ConsumerProps = Omit<
//   React.ComponentPropsWithRef<typeof motion.div>,
//   "onHoverStart" | "onHoverEnd" | "children"
// >;
// interface CursorConsumerEntity extends ConsumerProps {
//   children: React.ReactNode;
//   handleHoverStartAction: () => void;
//   handleHoverEndAction: () => void;
// }

// type CursorTooltipProps = React.HTMLAttributes<HTMLDivElement> & {
//   ref?: React.Ref<HTMLDivElement>;
// };

// const CursorTooltip: React.FC<
//   React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
// > = ({ className, ref, children, ...props }) => {
//   return (
//     <div
//       className={cn(
//         "m-0 p-[0.9375rem] text-lg tracking-tight text-[hsl(0,0%,96%)]",
//         className
//       )}
//       ref={ref}
//       {...props}>
//       {children}
//     </div>
//   );
// };

// CursorTooltip.displayName = "CursorTooltip";
/**
 the transform property in the css is changing from translateX() to translateY() to translate3d() depending on where on the screen and in which direction the user is moving the cursor with top-0 left-0 being their 0,0 frame of reference for the x and y planes

I guess the DOM is, for this immediate consideration, a 2D array, and likely in this package that is the conceptual assumption, too. I assume this is the case because if the scale changes while moving the cursor diagonally instead of modifying the z-index using translate3d(x,y,z) the author uses another transform function, scale(x,y), in addition to using the transform3d(x,y,z) css (where z remains 0)

width: 16px; height: 16px; z-index: 99999; will-change: transform; contain: layout; overflow: hidden; background-color: var(--hue-1); top: 0px; left: 0px; position: fixed; pointer-events: none; opacity: 0; transform: translate(-50%, -50%) translateX(1117px) translateY(166px) scale(0); transform-origin: 50% 50% 0px; border-radius: 20px;
 */
