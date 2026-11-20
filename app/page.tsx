import Hero from "@/components/Home/Hero"
import HomeServices from "@/components/Home/HomeServices"
import HowItWorks from "@/components/Home/HowItWorks"
import HashScroll from "@/components/Home/HashScroll"

// Services are loaded per request so the section height never shifts after
// hydration (which would break the navbar's #services / #how-it-works links).
export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <main>
      <Hero />
      <HomeServices />
      <HowItWorks />
      <HashScroll />
    </main>
  )
}
