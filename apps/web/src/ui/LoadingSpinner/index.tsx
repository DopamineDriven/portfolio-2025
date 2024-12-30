"use client";

import React from "react";
import { motion } from "motion/react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "currentColor"
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`rounded-full border-b-2 border-t-2 ${sizeClasses[size]}`}
        style={{
          borderColor: color,
          borderTopColor: "transparent",
          borderBottomColor: "transparent"
        }}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </div>
  );
};

export default LoadingSpinner;
