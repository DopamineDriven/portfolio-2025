"use client";

import type { FC } from "react";
import { motion } from "motion/react";

export const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center rounded-lg p-[2.5rem]">
    <motion.div
      className={`border-t-foreground size-[3.125rem] rounded-[50%] border-[0.25rem_solid_#1a1e26] will-change-[transform]`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear"
      }}
    />
  </div>
);
