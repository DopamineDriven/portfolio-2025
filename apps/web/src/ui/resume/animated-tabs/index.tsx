"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedTabsProps {
  tabs: string[];
  onTabChange: (tab: string) => void;
}

export function AnimatedTabs({ tabs, onTabChange }: AnimatedTabsProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (index: number) => {
    if (tabs[index]) {
      setSelectedTab(index);
      onTabChange(tabs[index]);
    }
  };

  return (
    <nav className="mb-6 w-full">
      <ul className="bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1">
        {tabs.map((tab, index) => {
          const isSelected = selectedTab === index;
          return (
            <li
              key={tab}
              className="relative hover:text-current/[1.10]"
              role="tab"
              aria-selected={isSelected}>
              {isSelected && (
                <motion.div
                  layoutId="tab-indicator"
                  className="bg-background absolute inset-0 z-0 rounded-sm"
                  initial={false}
                  transition={{
                    type: "spring",
                    bounce: 0.12,
                    duration: 0.6,
                    damping: 15,
                    mass: 1.25
                  }}
                />
              )}
              <motion.button
                className={cn(
                  // prettier-ignore
                  `ring-offset-background focus-visible:ring-ring relative z-10 inline-flex items-center justify-center rounded-sm px-3 py-1.5 cursor-pointer
                  text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none
                  disabled:pointer-events-none disabled:opacity-50 hover:text-foreground/90`,
                  isSelected ? "text-foreground" : ""
                )}
                whileTap={{ scale: 0.95 }}
                whileFocus={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
                onTapStart={() => handleTabChange(index)}>
                {tab}
              </motion.button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
