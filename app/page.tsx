"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
import { HillsOutro } from "@/components/portfolio/hills-outro"
import { ErrorScreen } from "@/components/portfolio/loading-screen"

const LoadingScreen = dynamic(
  () =>
    import("@/components/portfolio/loading-screen").then((m) => ({
      default: m.LoadingScreen,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="dot-pattern fixed inset-0 z-[300] bg-background"
        aria-busy
        aria-label="Loading portfolio"
      />
    ),
  }
)
import { useUIStore } from "@/store/ui.store"
import { useAuthStore } from "@/store/auth.store"
import { usePortfolioStore } from "@/store/portfolio.store"

const FETCH_TIMEOUT_MS = 20_000

const MAIN_ENTER = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.42, 0, 0.58, 1] as const },
}

export default function Portfolio() {
  const router = useRouter()
  const [introComplete, setIntroComplete] = useState(false)
  const { isCommandPaletteOpen, openCommandPalette, closeCommandPalette } = useUIStore()
  const { rehydrate } = useAuthStore()
  const { data, status, errorMessage, fetch: fetchPortfolio } = usePortfolioStore()

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  const handleRetry = useCallback(() => {
    setIntroComplete(false)
    void fetchPortfolio({ force: true })
  }, [fetchPortfolio])

  useEffect(() => {
    rehydrate()
  }, [rehydrate])

  useEffect(() => {
    void fetchPortfolio()
  }, [fetchPortfolio])

  useEffect(() => {
    if (status !== "idle" && status !== "loading") return
    const id = globalThis.setTimeout(() => {
      router.replace("/error?reason=timeout")
    }, FETCH_TIMEOUT_MS)
    return () => globalThis.clearTimeout(id)
  }, [status, router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        openCommandPalette()
      }
    }
    globalThis.window.addEventListener("keydown", handleKeyDown)
    return () => globalThis.window.removeEventListener("keydown", handleKeyDown)
  }, [openCommandPalette])

  if (status === "error") {
    return (
      <ErrorScreen
        message={errorMessage ?? "Could not load portfolio data. Is the backend running?"}
        onRetry={handleRetry}
      />
    )
  }

  const readyToShow = status === "success" && data != null && introComplete

  if (!readyToShow) {
    return <LoadingScreen onSequenceComplete={handleIntroComplete} />
  }

  return (
    <motion.main className="min-h-screen bg-background" {...MAIN_ENTER}>
      <Navbar onOpenCommandPalette={openCommandPalette} />
      <Hero data={data.hero} />
      <About data={data.about} />
      <Projects data={data.projects} />
      <Journey data={data.journey} />
      <Playground displayName={data.hero.name} />
      <GalleryTeaser />
      <Resume data={data.resume} />
      <Contact data={data.contact} />
      <HillsOutro hero={data.hero} />
      <Footer data={data.footer} />

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} />
      <AuthModal />
      <GreetingBar />
    </motion.main>
  )
}
