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

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsHovered(false);
    setHoveredItem(null);
    setIsMenuOpen(false);
  }, [isMobile]);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <AnimatePresence mode="wait">
        <motion.nav
          key="navbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="relative flex w-full items-center justify-center pb-4 backdrop-blur-sm"
          {...(!isMobile
            ? {
                onMouseEnter: () => setIsHovered(true),
                onMouseLeave: () => {
                  setIsHovered(false);
                  setHoveredItem(null);
                }
              }
            : {
                onClick: () => setIsMenuOpen(!isMenuOpen)
              })}>
          <div className="w-full">
            <AnimatePresence mode="wait">
              {!isHovered && !isMenuOpen ? (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                  className="mt-4 grid grid-cols-5 w-full justify-center px-12">
                  <span className="col-span-2 block mx-auto">Menu</span>
                  <Link href="/" className="text-[#f5f5f5] col-start-4 col-span-2 mx-auto">
                    AR
                  </Link>
                </motion.span>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                  className="w-full">
                  <AnimatePresence>
                    <motion.div className="grid w-full grid-rows-5 sm:grid-cols-5">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.05,
                            ease: [0.77, 0, 0.175, 1]
                          }}
                          className="relative w-full overflow-hidden h-auto"
                          onMouseEnter={() =>
                            !isMobile && setHoveredItem(item.name)
                          }
                          onMouseLeave={() =>
                            !isMobile && setHoveredItem(null)
                          }>
                          <Link
                            href={item.href}
                            className="relative block w-full px-4 py-2 text-center"
                            onClick={() => isMobile && setIsMenuOpen(false)}>
                            <motion.div
                              className="relative z-50 w-full text-lg sm:z-10"
                              animate={{
                                color:
                                  !isMobile && hoveredItem === item.name
                                    ? "#000"
                                    : "#fff"
                              }}
                              transition={{
                                duration: 0.5,
                                ease: [0.77, 0, 0.175, 1]
                              }}>
                              {item.name}
                            </motion.div>
                          </Link>
                          <AnimatePresence>
                            {!isMobile && hoveredItem === item.name && (
                              <motion.div
                                className="absolute inset-0 bg-white"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{
                                  duration: 0.5,
                                  ease: [0.77, 0, 0.175, 1]
                                }}
                              />
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isMobile && isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                  className="fixed inset-0 z-40 h-full bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </AnimatePresence>
    </header>
  );
}
