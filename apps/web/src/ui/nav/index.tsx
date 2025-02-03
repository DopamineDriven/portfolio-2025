"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { getResumeUrl } from "@/app/actions";
import { ArLogo } from "@/ui/svg/ar-logo";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Resume", href: "/resume-2025.pdf" },
  { name: "Projects", href: "/#projects" }
];

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const downloadUrl = await getResumeUrl();

      // Create a temporary link and trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "resume-2025.pdf"; // This will be the suggested filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };
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
    <header className="fixed top-0 left-0 z-50 mx-auto w-full self-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.nav
          key="navbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="max-w-10xl relative mx-auto flex max-h-fit w-full items-center justify-center backdrop-blur-sm"
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
                  className="mx-auto flex w-full max-w-7xl flex-row justify-between px-4 py-2 text-center sm:px-5 sm:py-4">
                  <Link href="/" className="block text-[#f5f5f5]">
                    <ArLogo className="size-5 sm:size-7" />
                  </Link>
                  <span className="block">Menu</span>
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
                    <motion.div className="grid w-full grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1">
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
                          {item.name === "Resume" ? (
                            <button
                              onClick={handleDownload}
                              className="relative block w-full appearance-none px-4 py-2 text-center sm:py-4"
                              disabled={isDownloading}
                              role="link">
                              <motion.div
                                className="relative z-50 w-full sm:z-10"
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
                            </button>
                          ) : (
                            <Link
                              href={item.href}
                              className="relative block w-full px-4 py-2 text-center sm:py-4"
                              onClick={() => isMobile && setIsMenuOpen(false)}>
                              <motion.div
                                className="relative z-50 w-full sm:z-10"
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
                          )}
                          <AnimatePresence>
                            {!isMobile && hoveredItem === item.name && (
                              <motion.div
                                className="absolute inset-0 bg-white"
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                  className="fixed inset-0 z-40 h-full bg-black/50 backdrop-blur-sm sm:hidden"
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
