import Link from "next/link"
import { Wrench } from "lucide-react"

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

          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#1D4ED8] transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-lg bg-[#F97316] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu */}
        <MobileMenu navLinks={navLinks} />
      </nav>
    </header>
  )
}