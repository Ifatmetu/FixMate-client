"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Wrench } from "lucide-react"
import SearchBar from "./SearchBar"
import UserMenu from "./UserMenu"
import MobileMenu from "./MobileMenu"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  {
    name: "Home",
    target: "home",
  },
  {
    name: "Services",
    target: "services",
  },
  {
    name: "How It Works",
    target: "how-it-works",
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname.startsWith("/dashboard")) {
    return null
  }

  const handleNavigation = (target: string) => {
    // How It Works একটি আলাদা page — section-এ scroll নয়।
    if (target === "how-it-works") {
      router.push("/how-it-works")
      return
    }

    // Home page-এ না থাকলে hash সহ home-এ পাঠাই (HashScroll সেখানে scroll করবে)।
    if (pathname !== "/") {
      const hash = target === "home" ? "top" : target
      router.push(`/#${hash}`)
      return
    }

    // Home
    if (target === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })

      return
    }

    // Services section (home page)
    const element =
      document.getElementById(target) ??
      document.querySelector(`[data-section="${target}"]`)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
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
            <button
              key={link.target}
              type="button"
              onClick={() => handleNavigation(link.target)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#1D4ED8]"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
  <SearchBar />
  <ThemeToggle />
  <UserMenu />
</div>

        {/* Mobile Menu */}
        <MobileMenu navLinks={navLinks} onNavigate={handleNavigation} />
      </nav>
    </header>
  )
}
