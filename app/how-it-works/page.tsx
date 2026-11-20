import type { Metadata } from "next"

import HowItWorks from "@/components/Home/HowItWorks"

export const metadata: Metadata = {
  title: "How It Works | FixMate",
  description: "See how FixMate helps you find, book, and complete repairs.",
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <HowItWorks />
    </main>
  )
}
