"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedListItemProps
  extends Omit<ComponentPropsWithRef<typeof motion.li>, "children"> {
  children: ReactNode;
  index: number;
}

function AnimatedListItem({
  children,
  index,
  ref,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { delay: index * 0.1 },
  className,
  ...props
}: AnimatedListItemProps) {
  return (
    <motion.li
      ref={ref}
      initial={initial}
      
      animate={animate}
      transition={transition}
      className={cn("mb-4", className)}
      {...props}>
      {children}
    </motion.li>
  );
}

AnimatedListItem.displayName = "AnimatedListItem";

export { AnimatedListItem };
