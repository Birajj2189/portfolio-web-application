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
import { useUIStore } from "@/store/ui.store"

export default function Portfolio() {
  const { isCommandPaletteOpen, openCommandPalette, closeCommandPalette } = useUIStore()

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

  return (
    <main className="min-h-screen bg-background">
      <Navbar onOpenCommandPalette={openCommandPalette} />
      <Hero />
      <About />
      <Projects />
      <Journey />
      <Playground />
      <Resume />
      <Contact />
      <Footer />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} />
    </main>
  )
}
