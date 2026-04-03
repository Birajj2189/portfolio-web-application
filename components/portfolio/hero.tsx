"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroProfileJsonPanel } from "@/components/portfolio/hero-profile-json"
import { TubesBackground } from "@/components/portfolio/tubes-background"
import { buildHeroProfileSummary } from "@/lib/hero-profile-summary"
import type { HeroData } from "@/types/portfolio"

interface HeroProps {
  data: HeroData
}

/** Build rotating / typing source from CMS */
function useRoleLines(data: HeroData): string[] {
  return useMemo(() => {
    if (data.roleVariants?.length) {
      return data.roleVariants.map((s) => s.trim()).filter(Boolean)
    }
    const parts = data.role
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
    return parts.length ? parts : [data.role]
  }, [data.role, data.roleVariants])
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic role: multi-line crossfade OR single typewriter
// ─────────────────────────────────────────────────────────────────────────────
function DynamicRole({ lines }: Readonly<{ lines: string[] }>) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState("")
  const single = lines.length === 1 ? lines[0] : null

  // Rotate when multiple roles
  useEffect(() => {
    if (lines.length < 2 || reduceMotion) return
    const id = globalThis.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length)
    }, 3800)
    return () => globalThis.clearInterval(id)
  }, [lines.length, reduceMotion])

  // Typewriter for single role — setState only inside scheduled callbacks
  useEffect(() => {
    let alive = true
    const timeouts: ReturnType<typeof setTimeout>[] = []

    if (!single || reduceMotion) {
      const id = globalThis.requestAnimationFrame(() => {
        if (alive) setTyped(single ?? "")
      })
      return () => {
        alive = false
        cancelAnimationFrame(id)
      }
    }

    const schedule = (fn: () => void, ms: number) => {
      const id = globalThis.setTimeout(() => {
        if (alive) fn()
      }, ms)
      timeouts.push(id)
    }

    schedule(() => setTyped(""), 0)
    let i = 0
    const tick = () => {
      if (!alive) return
      i += 1
      setTyped(single.slice(0, i))
      if (i < single.length) {
        schedule(tick, 32 + (single.charAt(i - 1) === " " ? 75 : 0))
      }
    }
    schedule(tick, 480)

    return () => {
      alive = false
      timeouts.forEach(clearTimeout)
    }
  }, [single, reduceMotion])

  if (lines.length > 1) {
    return (
      <div className="relative min-h-[2.5rem] sm:min-h-[2.75rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={lines[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 text-center font-mono text-xl text-muted-foreground sm:text-2xl lg:text-left"
          >
            {lines[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <span className="block w-full text-center font-mono text-xl text-muted-foreground sm:text-2xl lg:text-left">
      {typed}
      <motion.span
        aria-hidden
        className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-primary align-middle"
        animate={reduceMotion ? {} : { opacity: [1, 0.15, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero headline — first / last name, theme-aligned motion
// ─────────────────────────────────────────────────────────────────────────────
function parseNameParts(full: string): { first: string; last: string | null } {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: "", last: null }
  if (parts.length === 1) return { first: parts[0]!, last: null }
  return { first: parts[0]!, last: parts.slice(1).join(" ") }
}

function HeroDisplayName({
  name,
  reduceMotion,
}: Readonly<{ name: string; reduceMotion: boolean }>) {
  const { first, last } = parseNameParts(name)
  if (!first) return null

  const spring = { type: "spring" as const, stiffness: 120, damping: 22, mass: 0.85 }
  const springSoft = { type: "spring" as const, stiffness: 90, damping: 20, mass: 0.9 }

  const lastGradient =
    "bg-gradient-to-br from-primary via-teal-200/90 to-accent bg-[length:180%_180%] bg-clip-text text-transparent"

  return (
    <div className="relative flex flex-col items-center gap-3 lg:items-start">
      <motion.p
        className="mb-0.5 font-sans text-[13px] font-normal tracking-[0.02em] text-zinc-500 italic sm:text-sm"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { ...springSoft, delay: 0.02 }}
      >
        Hi, I&apos;m
      </motion.p>

      <div className="flex flex-col items-center gap-2 sm:gap-3 lg:flex-row lg:flex-wrap lg:items-end lg:justify-start lg:gap-x-4 lg:gap-y-1">
        {last ? (
          <>
            <motion.span
              className="block text-5xl font-extralight tracking-[-0.03em] text-zinc-50 sm:text-6xl md:text-7xl lg:text-8xl"
              initial={reduceMotion ? false : { opacity: 0, x: -36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { ...spring, delay: 0.06 }}
            >
              {first}
            </motion.span>

            <motion.span
              aria-hidden
              className="hidden pb-2 font-light text-primary/35 select-none lg:inline lg:text-4xl xl:text-5xl"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduceMotion ? { duration: 0 } : { ...springSoft, delay: 0.14 }}
            >
              /
            </motion.span>

            <motion.span
              className={`block text-5xl font-semibold tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-8xl ${lastGradient}`}
              initial={reduceMotion ? false : { opacity: 0, x: 40 }}
              animate={
                reduceMotion
                  ? { opacity: 1, x: 0 }
                  : {
                      opacity: 1,
                      x: 0,
                      backgroundPosition: ["0% 40%", "100% 60%", "0% 40%"],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { ...spring, delay: 0.12 },
                      x: { ...spring, delay: 0.12 },
                      backgroundPosition: { duration: 10, repeat: Infinity, ease: "linear" },
                    }
              }
            >
              {last}
            </motion.span>
          </>
        ) : (
          <motion.span
            className={`block text-5xl font-semibold tracking-[-0.025em] sm:text-6xl md:text-7xl lg:text-8xl ${lastGradient}`}
            initial={reduceMotion ? false : { opacity: 0, x: 32 }}
            animate={
              reduceMotion
                ? { opacity: 1, x: 0 }
                : {
                    opacity: 1,
                    x: 0,
                    backgroundPosition: ["0% 40%", "100% 60%", "0% 40%"],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    opacity: { ...spring, delay: 0.08 },
                    x: { ...spring, delay: 0.08 },
                    backgroundPosition: { duration: 10, repeat: Infinity, ease: "linear" },
                  }
            }
          >
            {first}
          </motion.span>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
export function Hero({ data }: Readonly<HeroProps>) {
  const roleLines = useRoleLines(data)
  const profileSummary = useMemo(() => buildHeroProfileSummary(data), [data])
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-background">
      <TubesBackground
        className="min-h-screen"
        enabled={!reduceMotion}
        enableClickInteraction={!reduceMotion}
      >
        {/* Depth above WebGL, below interactive content */}
        <div className="hero-rim-light pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="hero-vignette pointer-events-none absolute inset-0 z-[2]" aria-hidden />

        <div className="pointer-events-none relative z-[3] flex min-h-dvh flex-1 flex-col items-center justify-center">
          <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4 pb-28 text-center sm:px-5 lg:px-8 lg:pb-32">
            <div className="grid gap-12 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-center lg:gap-14 lg:gap-y-10 lg:pb-6 lg:text-left">
              <div className="relative lg:max-w-2xl lg:pr-2">
                {data.available && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="glass-card mx-auto mb-7 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)] lg:mx-0"
                  >
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">
                      Available for new opportunities
                    </span>
                  </motion.div>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5 lg:mb-6"
                >
                  <HeroDisplayName name={data.name} reduceMotion={!!reduceMotion} />
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.58 }}
                  className="mb-6 flex min-h-[2.75rem] items-center justify-center gap-3 sm:min-h-[3rem] lg:justify-start"
                >
                  <motion.span
                    className="h-px w-10 bg-gradient-to-r from-transparent to-border/80 sm:w-12"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.38, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="max-w-[min(100%,22rem)] min-w-0 sm:max-w-none lg:max-w-xl">
                    <DynamicRole lines={roleLines} />
                  </div>
                  <motion.span
                    className="h-px w-10 bg-gradient-to-l from-transparent to-border/80 sm:w-12"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.38, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mb-9 max-w-xl text-base leading-[1.65] text-muted-foreground/95 sm:text-lg lg:mx-0 lg:mb-10 lg:max-w-lg"
                >
                  {data.tagline}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
                >
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <Button
                      size="lg"
                      className="glow-teal bg-primary px-8 text-primary-foreground shadow-[0_12px_40px_-16px_oklch(0.55_0.14_180_/_0.45)] hover:bg-primary/90"
                      onClick={() =>
                        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      {data.ctaPrimaryLabel}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-border/80 bg-background/30 px-8 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.35)] backdrop-blur-[2px] hover:border-accent hover:text-accent"
                      onClick={() =>
                        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      {data.ctaSecondaryLabel}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>

              <div className="flex justify-center lg:justify-end lg:pt-2">
                <HeroProfileJsonPanel summary={profileSummary} />
              </div>
            </div>
          </div>

          <motion.div
            className="pointer-events-auto absolute bottom-8 left-1/2 z-[4] -translate-x-1/2"
            animate={reduceMotion ? {} : { y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <a
              href="#about"
              className="group glass-card flex items-center gap-2.5 rounded-full border-white/10 px-5 py-2.5 text-sm text-muted-foreground shadow-[0_10px_36px_-14px_rgba(0,0,0,0.4)] transition-all hover:border-primary/45 hover:text-primary"
            >
              <span className="font-medium tracking-wide">Scroll to explore</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 transition-colors group-hover:bg-primary/40">
                <ArrowDown className="h-3.5 w-3.5 text-primary" />
              </span>
            </a>
          </motion.div>
        </div>
      </TubesBackground>
    </section>
  )
}
