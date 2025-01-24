"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "Agency", href: "/agency" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" }
];

export default function NavbarAlt() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [_isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset states when switching between mobile and desktop
  useEffect(() => {
    setIsHovered(false);
    setHoveredItem(null);
    setIsMenuOpen(false);
  }, [isMobile]);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <nav
        className="relative flex items-center justify-between px-6 py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {/* Animate out Menu + AR together, animate in the full-width links */}
        <AnimatePresence mode="sync">
          {!isHovered ? (
            /* Default (collapsed) state: Menu on left, AR on right */
            <motion.div
              key="collapsed"
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: -40 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="flex w-full justify-between">
              <span className="text-[#f5f5f5]">Menu</span>
              <Link href="/" className="text-[#f5f5f5]">
                AR
              </Link>
            </motion.div>
          ) : (
            /* Expanded state: Evenly-spaced menu items across full width */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex w-full justify-evenly">
              {menuItems.map(item => (
                <div
                  key={item.name}
                  className="relative overflow-hidden"
                  onMouseEnter={() =>
                    !isMobile ? setHoveredItem(item.name) : undefined
                  }
                  onMouseLeave={() =>
                    !isMobile ? setHoveredItem(null) : undefined
                  }>
                  <Link
                    href={item.href}
                    className="relative z-10 block px-4 py-2 text-[#f5f5f5]">
                    <motion.span
                      // Switch text to black on hover
                      whileHover={{ color: "#000", backgroundColor: "#" }}
                      transition={{ duration: 0.3 }}>
                      {item.name}
                    </motion.span>
                    {/* Bottom-to-top black-to-white background */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: hoveredItem ? "#f5f5f5" : "#202020",
                        color: hoveredItem ? "#202020" : "#f5f5f5"
                      }}
                      initial={{ y: "100%", dy: "100%" }}
                      whileHover={{ dy: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
