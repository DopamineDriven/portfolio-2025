### Portfolio 2025
please help me resolve the ongoing issue in this component on mobile browsers. I think the root of the bluring/bubbling of text and the svg icon during mobile nav open/close animations could be around how transitions are being applied coupled with backdrop-blur being applied in several locations

If the most expedient solution is to omit the backdrop-blur at the text element level I'm all for it 

please let me know your thoughts

here are the files in question

- components/navbar.tsx

```tsx
"use client";

import type { FC, SVGAttributes } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const ArLogo: FC<
  Omit<SVGAttributes<SVGSVGElement>, "viewBox" | "fill" | "role" | "xmlns">
> = ({ className, ...svg }) => (
  <svg
    className={cn(className, "theme-transition")}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...svg}>
    <path
      d="M107.701 334.338L177.229 173.979H202.963L272.49 334.338H243.144L227.117 295.897H152.397L136.144 334.338H107.701ZM162.556 271.103H216.959L189.644 207.417L162.556 271.103Z"
      fill="currentColor"
    />
    <path
      d="M258.93 334.336V175.112H329.36C347.717 175.112 362.089 179.699 372.476 188.873C382.86 198.05 388.055 210.368 388.055 225.838C388.055 238.426 384.669 248.775 377.897 256.886C371.125 265 361.945 270.725 350.354 274.061L393.021 334.339H360.286L321.011 278.839H286.699V334.339H258.933L258.93 334.336ZM286.695 254.042H327.325C337.258 254.042 345.162 251.619 351.031 246.762C356.897 241.912 359.838 235.315 359.838 226.973C359.838 218.482 356.978 211.958 351.26 207.412C345.541 202.862 337.487 200.586 327.103 200.586H286.699V254.039L286.695 254.042Z"
      fill="currentColor"
    />
    <path
      d="M6 256C6 118.156 118.156 6 256 6C393.844 6 506 118.156 506 256C506 393.844 393.844 506 256 506C118.156 506 6 393.844 6 256Z"
      stroke="currentColor"
      strokeWidth="12"
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
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
    <header className="fixed top-0 left-0 z-50 mx-auto w-screen self-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.nav
          key="navbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="relative mx-auto flex max-h-fit w-full max-w-screen items-center justify-center backdrop-blur-sm"
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
          <div className="w-full" id="top">
            <AnimatePresence mode="wait">
              {!isHovered && !isMenuOpen ? (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                  className="2xl:max-w-[96rem] mx-auto grid w-screen grid-cols-5 justify-between px-4 py-2 text-center sm:px-10 sm:py-4">
                  <Link
                    href="/"
                    className="mx-0 block justify-start text-left text-[#f8fafc]">
                    <ArLogo className="size-5 sm:size-7" />
                  </Link>
                  <span className="col-start-5 block text-right sm:text-right">
                    Menu
                  </span>
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
                    <motion.div className="grid w-full grid-cols-1 grid-rows-5 sm:grid-cols-5 sm:grid-rows-1">
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
                          className="relative w-full overflow-hidden"
                          onMouseEnter={() =>
                            !isMobile && setHoveredItem(item.name)
                          }
                          onMouseLeave={() =>
                            !isMobile && setHoveredItem(null)
                          }>
                          <Link
                            href={item.href}
                            className="relative block w-full px-4 py-2 text-center sm:py-4"
                            onClick={() => isMobile && setIsMenuOpen(false)}>
                            <motion.div
                              className="relative z-50 w-full sm:z-10"
                              animate={{
                                color:
                                  !isMobile && hoveredItem === item.name
                                    ? "#020817"
                                    : "#f8fafc"
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
                                className="absolute inset-0 bg-[#f8fafc]"
                                initial={{ y: "100%" }}
                                animate={{ y: 1.25 }}
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
                initial={{opacity: 0}}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ staggerChildren: 0.2, duration: 0.2, ease: [0.77, 0, 0.175, 1] }}
                  className="bg-[#020817]/50 will-change-[opacity,filter] fixed inset-0 z-40 h-full py-2 backdrop-blur-sm sm:hidden"
                  onClick={() => setIsMenuOpen(false)}>
                  <div className="absolute top-2 right-2 z-[100] p-2.5">
                    <button
                      onClick={closeMenu}
                      className="text-[#f8fafc] bg-[#020817]/20 hover:bg-[#020817]/30 rounded-full transition-colors">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </AnimatePresence>
    </header>
  );
}

```

this nav bar is rendered directly in the root layout file of the app directory so to mimic my local coding environments layout please wrap the "children" returned in the root layout.tsx file like this:

- app/layout.tsx

```tsx
  return (
    <html
      suppressHydrationWarning
      lang="en">
      <body className="text-[#f8fafc] bg-[#020817] overflow-x-hidden">
        <div className="mx-auto flex min-h-[100dvh] max-w-[96rem] flex-col overflow-x-hidden! sm:px-6 lg:px-8">
          <Navbar />
          <main className="theme-transition min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
```


please ensure you have the following dependency matches for 1:1 replication


motion@^12.6.3, motion-plus@^0.1.6, next@^15.2.4, react@^19.1.0, react-dom@^19.1.0, @types/node@^22.14.0, @types/react@^19.1.0, @types/react-dom@^19.1.1, typescript@^5.8.2
