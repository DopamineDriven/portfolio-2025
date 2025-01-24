"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "Agency", href: "/agency" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Reset states when switching between mobile and desktop
  useEffect(() => {
    setIsHovered(false)
    setHoveredItem(null)
    setIsMenuOpen(false)
  }, [isMobile])

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="px-6 py-4 flex justify-between items-start relative">
        {/* Menu Trigger */}
        <div
          className="relative h-auto overflow-hidden cursor-pointer"
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
          <AnimatePresence>
            {!isHovered && !isMenuOpen ? (
              <motion.span
                initial={{ y: 0 }}
                animate={{ y: 0 }}
                exit={{ y: -40 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="block text-white"
              >
                Menu
              </motion.span>
            ) : (
              <motion.div
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                exit={{ y: 40 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="flex flex-col lg:flex-row gap-8 lg:gap-16"
              >
                {menuItems.map((item) => (
                  <div key={item.name} className="relative min-w-fit">
                    <Link
                      href={item.href}
                      className="relative block overflow-hidden px-4 py-2"
                      onClick={() => isMobile && setIsMenuOpen(false)}
                      {...(!isMobile
                        ? {
                            onMouseEnter: () => setHoveredItem(item.name),
                            onMouseLeave: () => setHoveredItem(null),
                          }
                        : {})}
                    >
                      <motion.div
                        className="relative z-10 text-lg text-center"
                        animate={{
                          color: !isMobile && hoveredItem === item.name ? "#000" : "#fff",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.name}
                      </motion.div>
                      {!isMobile && (
                        <motion.div
                          className="absolute inset-0 bg-white"
                          initial={{ y: "100%" }}
                          animate={{
                            y: hoveredItem === item.name ? "0%" : "100%",
                          }}
                          transition={{
                            duration: 0.5,
                            ease: [0.76, 0, 0.24, 1],
                          }}
                        />
                      )}
                    </Link>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logo */}
        <Link href="/" className="text-white">
          AR
        </Link>

        {/* Mobile Menu Overlay */}
        {isMobile && (
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        )}
      </nav>
    </header>
  )
}

