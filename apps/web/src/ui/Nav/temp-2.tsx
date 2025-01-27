"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Posts", href: "/posts" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setIsHovered(false)
    setHoveredItem(null)
    setIsMenuOpen(false)
  }, [isMobile]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 overflow-hidden mx-auto self-center">
      <AnimatePresence mode="wait">
        <motion.nav
          key="navbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="flex justify-center items-center relative backdrop-blur-sm w-full max-h-fit mx-auto max-w-7xl"
          {...(!isMobile
            ? {
                onMouseEnter: () => setIsHovered(true),
                onMouseLeave: () => {
                  setIsHovered(false)
                  setHoveredItem(null)
                },
              }
            : {
                onClick: () => setIsMenuOpen(!isMenuOpen),
              })}
        >
          <div className="w-full">
            <AnimatePresence mode="wait">
              {!isHovered && !isMenuOpen ? (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                  className="flex w-full justify-between px-8 py-2 text-center"
                >
                  <span>Menu</span>
                  <Link href="/" className="text-[#f5f5f5]">
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
                  className="w-full"
                >
                  <AnimatePresence>
                    <motion.div className="grid grid-rows-5 grid-cols-1 sm:grid-cols-5 sm:grid-rows-1 w-full">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.05,
                            ease: [0.77, 0, 0.175, 1],
                          }}
                          className="relative overflow-hidden w-full"
                          onMouseEnter={() => !isMobile && setHoveredItem(item.name)}
                          onMouseLeave={() => !isMobile && setHoveredItem(null)}
                        >
                          <Link
                            href={item.href}
                            className="relative block w-full text-center px-4 py-2"
                            onClick={() => isMobile && setIsMenuOpen(false)}
                          >
                            <motion.div
                              className="relative z-50 sm:z-10 w-full"
                              animate={{
                                color: !isMobile && hoveredItem === item.name ? "#000" : "#fff",
                              }}
                              transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                            >
                              {item.name}
                            </motion.div>
                          </Link>
                          <AnimatePresence>
                            {!isMobile && hoveredItem === item.name && (
                              <motion.div
                                className="absolute inset-0 bg-white"
                                initial={{ y: "100%" }}
                                animate={{ y: 1.25 }}
                                exit={{ y: "100%" }}
                                transition={{
                                  duration: 0.5,
                                  ease: [0.77, 0, 0.175, 1],
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
                  className="fixed inset-0 h-full bg-black/50 backdrop-blur-sm z-40 sm:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </AnimatePresence>
    </header>
  )
}

