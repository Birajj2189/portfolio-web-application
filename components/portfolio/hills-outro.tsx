"use client"

import { useMemo } from "react"
import { MessageSquareQuote } from "lucide-react"
import { useReducedMotion } from "framer-motion"

import { GLSLHills } from "@/components/ui/glsl-hills"
import type { HeroData } from "@/types/portfolio"
import { cn } from "@/lib/utils"

interface HillsOutroProps {
  hero: HeroData
  className?: string
}

/** Default copy: inclusive, peer-to-peer — override via Strapi `outro*` fields on hero. */
const INSPIRATION_FALLBACK = {
  thought: "To everyone still learning in public",
  statement: "The work that changes you almost always starts where you feel least ready.",
  supporting:
    "Every expert was embarrassed by version one. Keep shipping, stay teachable, answer one beginner's question, review someone's work with kindness — small acts of courage compound, and the next person breaking through might be watching how you handle this moment.",
} as const

function useOutroCopy(hero: HeroData) {
  return useMemo(() => {
    const thought = hero.outroThought?.trim() || INSPIRATION_FALLBACK.thought
    const statement = hero.outroStatement?.trim() || INSPIRATION_FALLBACK.statement
    const supporting = hero.outroSupporting?.trim() || INSPIRATION_FALLBACK.supporting

    return { thought, statement, supporting }
  }, [hero])
}

/** Full-bleed GLSL terrain + closing thought before the footer. */
export function HillsOutro({ hero, className }: Readonly<HillsOutroProps>) {
  const reduce = useReducedMotion()
  const { thought, statement, supporting } = useOutroCopy(hero)

  return (
    <section
      id="outro"
      aria-labelledby="hills-outro-heading"
      className={cn(
        "relative flex min-h-[min(88vh,920px)] w-full scroll-mt-24 flex-col overflow-hidden border-t border-white/[0.06] bg-background",
        className
      )}
    >
      <GLSLHills
        className="absolute inset-0 min-h-full"
        cameraZ={125}
        planeSize={256}
        speed={0.5}
        disabled={!!reduce}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-background/75 via-background/30 to-transparent"
        aria-hidden
      />
      <div className="relative z-[3] flex flex-1 flex-col items-center justify-center px-4 py-24 text-center md:py-32">
        <MessageSquareQuote className="mb-6 h-8 w-8 text-primary/80" aria-hidden />
        <p className="mb-4 max-w-3xl font-poster text-xl text-muted-foreground italic md:text-2xl">
          {thought}
        </p>
        <h2
          id="hills-outro-heading"
          className="max-w-3xl font-poster text-2xl leading-snug font-semibold tracking-tight text-balance text-foreground md:text-4xl lg:text-[2.35rem] lg:leading-tight"
        >
          {statement}
        </h2>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground md:text-base">
          {supporting}
        </p>
      </div>
    </section>
  )
}
