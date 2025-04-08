"use client";

import type { Transition } from "motion-dom";
import type { FC, SVGAttributes } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const ArLogo: FC<
  Omit<SVGAttributes<SVGSVGElement>, "viewBox" | "fill" | "role" | "xmlns">
> = ({ className, ...svg }) => (
  <svg
    viewBox="0 0 512 512"
    className={cn("theme-transition", className)}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="AR Logo Dark"
    fill="none"
    {...svg}>
    <path
      fill="currentColor"
      d="M107.701 334.338L177.229 173.979H202.963L272.49 334.338H243.144L227.117 295.897H152.397L136.144 334.338H107.701ZM162.556 271.103H216.959L189.644 207.417L162.556 271.103Z"
    />
    <path
      fill="currentColor"
      d="M258.93 334.336V175.112H329.36C347.717 175.112 362.089 179.699 372.476 188.873C382.86 198.05 388.055 210.368 388.055 225.838C388.055 238.426 384.669 248.775 377.897 256.886C371.125 265 361.945 270.725 350.354 274.061L393.021 334.339H360.286L321.011 278.839H286.699V334.339H258.933L258.93 334.336ZM286.695 254.042H327.325C337.258 254.042 345.162 251.619 351.031 246.762C356.897 241.912 359.838 235.315 359.838 226.973C359.838 218.482 356.978 211.958 351.26 207.412C345.541 202.862 337.487 200.586 327.103 200.586H286.699V254.039L286.695 254.042Z"
    />
    <path
      fill="currentColor"
      d="M256 512C394.144 512 512 394.144 512 256C512 117.856 394.144 0 256 0C117.856 0 0 117.856 0 256C0 394.144 117.856 512 256 512ZM256 500C124.935 500 12 387.065 12 256C12 124.935 124.935 12 256 12C387.065 12 500 124.935 500 256C500 387.065 387.065 500 256 500Z"
    />
  </svg>
);

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Posts", href: "/#posts" },
  { name: "Projects", href: "/#projects" },
  { name: "Resume", href: "/resume" },
  { name: "World Tour", href: "/#world-tour" }
];

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Memoized transition values based on device type
  const viewportEasing = useMemo(
    () =>
      (!isMobile
        ? {
            duration: 0.5,
            ease: [0.77, 0, 0.175, 1]
          }
        : {
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1]
          }) satisfies Transition,
    [isMobile]
  );

  // Faster transition for mobile menu overlay
  const mobileMenuTransition = useMemo(
    () =>
      ({
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1]
      }) satisfies Transition,
    []
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 738);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, isMenuOpen]);

  useEffect(() => {
    setIsHovered(false);
    setHoveredItem(null);
    setIsMenuOpen(false);
  }, [isMobile]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) closeMenu();
    },
    [closeMenu, isMenuOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <header
      className="fixed top-0 left-0 z-50 mx-auto w-screen self-center overflow-hidden"
      id="top">
      <AnimatePresence mode="wait">
        {isMobile && isMenuOpen ? (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={mobileMenuTransition}>
            <div
              className="bg-background/70 absolute inset-0 after:absolute after:inset-0 after:z-[-1] after:backdrop-blur-[2px] after:content-['']"
              onClick={closeMenu}
            />

            {/* Close button */}
            <div className="relative z-50">
              <div className="absolute top-2 right-2 p-2.5">
                <button
                  onClick={closeMenu}
                  className="text-foreground bg-background/20 hover:bg-background/30 rounded-full transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex flex-1 flex-col items-center justify-center">
              <motion.div className="grid w-full grid-cols-1 grid-rows-5">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      ...viewportEasing,
                      delay: index * 0.05
                    }}
                    className="relative w-full overflow-hidden">
                    <Link
                      href={item.href}
                      className="relative block w-full px-4 py-4 text-center"
                      onClick={closeMenu}>
                      <div className="text-foreground">{item.name}</div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.nav
            key="navbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={viewportEasing}
            className="relative mx-auto flex max-h-fit w-full max-w-screen items-center justify-center after:absolute after:inset-0 after:z-[-1] after:backdrop-blur-sm after:content-['']"
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
            <div className="relative z-10 w-full" id="top">
              <AnimatePresence mode="wait">
                {!isHovered && !isMenuOpen ? (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={viewportEasing}
                    className="mx-auto grid w-screen grid-cols-5 justify-between px-4 py-2 text-center md:px-10 md:py-4 2xl:max-w-[96rem]">
                    <Link
                      href="/"
                      className="text-foreground mx-0 block justify-start text-left">
                      <ArLogo className="size-5 md:size-7" />
                    </Link>
                    <span className="col-start-5 block text-right md:text-right">
                      Menu
                    </span>
                  </motion.span>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={viewportEasing}
                    className="w-full">
                    <AnimatePresence>
                      <motion.div className="grid w-full grid-cols-1 grid-rows-5 md:grid-cols-5 md:grid-rows-1">
                        {menuItems.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{
                              ...viewportEasing,
                              delay: index * 0.05
                            }}
                            className="relative w-full overflow-hidden"
                            onMouseEnter={() =>
                              !isMobile && setHoveredItem(item.name)
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredItem(null)
                            }>
                            <Link
                              href={item.href}
                              className="relative block w-full px-4 py-2 text-center md:py-4"
                              onClick={() => isMobile && setIsMenuOpen(false)}>
                              <motion.div
                                className="relative z-50 w-full md:z-10"
                                animate={{
                                  color:
                                    !isMobile && hoveredItem === item.name
                                      ? "#020817"
                                      : "#f8fafc"
                                }}
                                transition={viewportEasing}>
                                {item.name}
                              </motion.div>
                            </Link>
                            <AnimatePresence>
                              {!isMobile && hoveredItem === item.name && (
                                <motion.div
                                  className="bg-foreground absolute inset-0"
                                  initial={{ y: "100%" }}
                                  animate={{ y: 1.25 }}
                                  exit={{ y: "100%" }}
                                  transition={viewportEasing}
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
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
