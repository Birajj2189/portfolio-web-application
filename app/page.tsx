"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/portfolio/navbar"
import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { Projects } from "@/components/portfolio/projects"
import { Journey } from "@/components/portfolio/journey"
import { Playground } from "@/components/portfolio/playground"
import { Resume } from "@/components/portfolio/resume"
import { Contact } from "@/components/portfolio/contact"
import { CommandPalette } from "@/components/portfolio/command-palette"
import { Footer } from "@/components/portfolio/footer"
import { AuthModal } from "@/components/portfolio/auth-modal"
import { GreetingBar } from "@/components/portfolio/greeting-bar"
import { GalleryTeaser } from "@/components/portfolio/gallery-teaser"
import { LoadingScreen, ErrorScreen } from "@/components/portfolio/loading-screen"
import { useUIStore } from "@/store/ui.store"
import { useAuthStore } from "@/store/auth.store"
import { usePortfolioStore } from "@/store/portfolio.store"

export default function Portfolio() {
  const { isCommandPaletteOpen, openCommandPalette, closeCommandPalette } = useUIStore()
  const { rehydrate } = useAuthStore()
  const { data, status, errorMessage, fetch: fetchPortfolio } = usePortfolioStore()

  // Validate persisted auth session on mount
  useEffect(() => {
    rehydrate()
  }, [rehydrate])

  // Fetch portfolio content on mount
  useEffect(() => {
    fetchPortfolio()
  }, [fetchPortfolio])

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        openCommandPalette()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [openCommandPalette])

  // Show loading screen while fetching
  if (status === "idle" || status === "loading") {
    return <LoadingScreen />
  }

  // Show error screen if fetch failed
  if (status === "error" || !data) {
    return (
      <ErrorScreen
        message={errorMessage ?? "Could not load portfolio data. Is the backend running?"}
        onRetry={fetchPortfolio}
      />
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar onOpenCommandPalette={openCommandPalette} />
      <Hero data={data.hero} />
      <About data={data.about} />
      <Projects data={data.projects} />
      <Journey data={data.journey} />
      <Playground />
      <GalleryTeaser />
      <Resume data={data.resume} />
      <Contact data={data.contact} />
      <Footer data={data.footer} />

      {/* Command palette */}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} />

      {/* Auth modal — login / signup */}
      <AuthModal />

      {/* Sticky greeting shown when logged in */}
      <GreetingBar />
    </main>
  )
}
