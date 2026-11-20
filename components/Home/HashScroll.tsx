"use client"

import { useEffect } from "react"

/**
 * Scrolls to the section named in the URL hash after the home page mounts.
 * This makes navbar jumps work when arriving from another page (e.g. /services).
 */
export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash.slice(1)

    if (!hash) return

    const scrollToSection = () => {
      const target =
        document.getElementById(hash) ??
        document.querySelector(`[data-section="${hash}"]`)

      target?.scrollIntoView({ behavior: "auto", block: "start" })
    }

    scrollToSection()

    // Re-run once after layout settles in case images/fonts shift the page.
    const timer = window.setTimeout(scrollToSection, 120)

    return () => window.clearTimeout(timer)
  }, [])

  return null
}
