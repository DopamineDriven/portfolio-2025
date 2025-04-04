"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"

export function CookieCheck() {
  const router = useRouter()
  const pathname = usePathname()
  const isRedirecting = useRef(false)

  useEffect(() => {
    // Skip this check on the elevator page itself to avoid redirect loops
    if (pathname === "/elevator" || isRedirecting.current) return

    // Check if the has-visited cookie exists
    const hasVisited = Cookies.get("has-visited")

    if (!hasVisited) {
      // Set flag to prevent multiple redirects
      isRedirecting.current = true

      // Set the path of intent cookie BEFORE redirecting
      // Make sure to set it with proper path and expiration
      Cookies.set("poi", pathname, {
        path: "/",
        expires: 1, // 1 day
      })

      console.log("Setting POI cookie to:", pathname)

      // Small timeout to ensure cookie is set before redirect
      setTimeout(() => {
        // Redirect to elevator
        router.push("/elevator")
      }, 50)
    }
  }, [pathname, router])

  // This component doesn't render anything
  return null
}

