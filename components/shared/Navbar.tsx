"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wrench } from "lucide-react"
import UserMenu from "./UserMenu"
import MobileMenu from "./MobileMenu"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Services",
    href: "/services",
  },
  {
    name: "About",
    href: "/about",
  },
]

export default function Navbar() {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D4ED8] text-white">
            <Wrench className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-tight text-[#1E3A8A]">
            Fix<span className="text-[#F97316]">Mate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#1D4ED8]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <UserMenu />
        </div>

        {/* Mobile Menu */}
        <MobileMenu navLinks={navLinks} />
      </nav>
    </header>
  )
}