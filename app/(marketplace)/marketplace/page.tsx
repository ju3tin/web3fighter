import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CharactersSection } from "@/components/characters-section"
import { MovesSection } from "@/components/moves-section"
import { FeaturedSection } from "@/components/featured-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CharactersSection />
      <MovesSection />
      <FeaturedSection />
      <Footer />
    </main>
  )
}
