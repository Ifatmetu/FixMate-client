"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"

import ThemeToggle from "./ThemeToggle"

type NavLink = {
  name: string
  target: string
}

type MobileMenuProps = {
  navLinks: NavLink[]
  onNavigate: (target: string) => void
}

export default function MobileMenu({ navLinks, onNavigate }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (target: string) => {
    setIsOpen(false)
    onNavigate(target)
  }

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-1">
        <ThemeToggle />

        {/* Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#1D4ED8] transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/40"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full border-b bg-background shadow-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.target}
                  type="button"
                  onClick={() => handleClick(link.target)}
                  className="rounded-lg px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-orange-50 hover:text-[#1D4ED8] dark:hover:bg-orange-950/40"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="mt-3 flex flex-col gap-2 border-t pt-4">
              <a
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-[#1D4ED8] px-4 py-2.5 text-center text-sm font-medium text-[#1D4ED8] transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                Sign In
              </a>

              <a
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-[#F97316] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
