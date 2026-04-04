"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particles-typography"
import { TubesBackground } from "@/components/portfolio/tubes-background"
import type { HeroData } from "@/types/portfolio"
import { cn } from "@/lib/utils"

interface HeroProps {
  data: HeroData
}

const PRIMARY_CTA = "See my work"
const SECONDARY_CTA = "View projects"

const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1]

/** Canvas must use a concrete family string (matches `Space_Grotesk` in layout) */
const HERO_POSTER_CANVAS_FONT = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"

/** Single-line particle strip — full width, height scales with viewport */
const HERO_NAME_STRIP =
  "h-[min(16vh,132px)] min-h-[92px] w-full sm:h-[min(17vh,144px)] md:h-[min(18vh,156px)] lg:h-[min(19vh,172px)]"

function useRoleHeadline(data: HeroData): string {
  return useMemo(() => {
    if (data.roleVariants?.length) {
      const line = data.roleVariants.map((s) => s.trim()).find(Boolean)
      if (line) return line
    }
    const parts = data.role.split("|").map((s) => s.trim())
    return parts.find(Boolean) ?? data.role
  }, [data.role, data.roleVariants])
}

function PosterBottomName({
  naturalName,
  displayUpper,
  reduceMotion,
}: Readonly<{ naturalName: string; displayUpper: string; reduceMotion: boolean }>) {
  if (!naturalName) return null

  if (reduceMotion) {
    return (
      <div className="relative z-20 w-full text-foreground">
        <h1 className="sr-only">{naturalName}</h1>
        <motion.div
          className="w-full px-1"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_IN_OUT }}
          aria-hidden
        >
          <svg
            className="block w-full text-foreground"
            style={{ height: "clamp(2.85rem, min(12vw, 15vh), 6.25rem)" }}
            viewBox="0 0 1000 200"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <text
              x="500"
              y="132"
              className="fill-current"
              style={{
                fontSize: 118,
                fontWeight: 700,
                fontFamily:
                  'var(--font-hero-poster), "Space Grotesk", ui-sans-serif, system-ui, sans-serif',
              }}
              dominantBaseline="middle"
              textAnchor="middle"
              textLength="970"
              lengthAdjust="spacingAndGlyphs"
            >
              {displayUpper}
            </text>
          </svg>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative z-20 w-full min-w-0 px-1">
      <h1 className="sr-only">{naturalName}</h1>
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: EASE_IN_OUT }}
        className="mx-auto w-full max-w-[100vw] min-w-0 text-foreground"
        aria-hidden
      >
        <CursorDrivenParticleTypography
          text={displayUpper}
          className={HERO_NAME_STRIP}
          fontSize={220}
          fontFamily={HERO_POSTER_CANVAS_FONT}
          particleSize={1.75}
          particleDensity={4}
          dispersionStrength={20}
          returnSpeed={0.08}
          maxFontSizeByWidthFactor={0.28}
          stretchToCanvasWidth
          maxHorizontalStretch={80}
        />
      </motion.div>
    </div>
  )
}

export function Hero({ data }: Readonly<HeroProps>) {
  const reduceMotion = useReducedMotion()
  const reduce = !!reduceMotion

  const primaryLabel = data.ctaPrimaryLabel?.trim() || PRIMARY_CTA
  const secondaryLabel = data.ctaSecondaryLabel?.trim() || SECONDARY_CTA
  const roleHeadline = useRoleHeadline(data)

  const tagline = useMemo(() => {
    const t = (data.tagline ?? "").replaceAll(/\s+/g, " ").trim()
    return t || "Crafting digital products with clarity, performance, and care."
  }, [data.tagline])

  const naturalName = useMemo(() => data.name.replaceAll(/\s+/g, " ").trim(), [data.name])
  const displayUpper = naturalName.toUpperCase()

  const slide = (delay: number, x: number) => ({
    initial: reduce ? false : { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.55, delay: reduce ? 0 : delay, ease: EASE_IN_OUT },
  })

  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      <TubesBackground className="min-h-screen" enabled={!reduce} enableClickInteraction={!reduce}>
        <div className="hero-rim-light pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-background/20 via-transparent to-background/95"
          aria-hidden
        />

        <div className="pointer-events-none relative z-[3] min-h-dvh">
          <div className="pointer-events-auto flex min-h-dvh flex-col">
            {/* Upper poster row: pinned to bottom edge of this region, directly above the name */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div
                className={cn(
                  "mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end",
                  "px-5 pt-24 pb-5 sm:px-8 sm:pt-28 sm:pb-6 md:pb-7 lg:px-10 lg:pb-8"
                )}
              >
                <div
                  className={cn(
                    "grid w-full grid-cols-1 gap-10 sm:gap-8",
                    "md:grid-cols-2 md:items-end md:gap-x-10 lg:gap-x-16 xl:gap-x-24"
                  )}
                >
                  {/* Left — status + role (bottom-aligned with right column on md+) */}
                  <motion.div
                    className="flex max-w-xl flex-col gap-4 md:max-w-md md:justify-self-start"
                    {...slide(0.06, -28)}
                  >
                    {data.available ? (
                      <div className="glass-card inline-flex w-fit items-center gap-2 rounded-full border-white/10 px-3 py-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_oklch(0.75_0.15_180_/_0.7)]" />
                        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                          Available for work
                        </span>
                      </div>
                    ) : null}
                    <h2
                      className={cn(
                        "text-left font-poster text-2xl leading-[1.15] font-bold tracking-tight text-foreground sm:text-3xl md:text-[1.75rem] lg:text-3xl xl:text-[2rem]"
                      )}
                    >
                      {roleHeadline}
                    </h2>
                  </motion.div>

                  {/* Right — bio + CTAs: on small screens tuck to the right; on md+ bottom + right aligned */}
                  <motion.div
                    className={cn(
                      "flex max-w-xl flex-col gap-6 md:max-w-md",
                      "max-md:ml-auto max-md:w-full max-md:max-w-lg max-md:items-end max-md:text-right",
                      "md:items-end md:justify-self-end md:text-right"
                    )}
                    {...slide(0.14, 28)}
                  >
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {tagline}
                    </p>
                    <div className="flex flex-col gap-4 max-md:items-end md:items-end">
                      <motion.div
                        whileHover={reduce ? undefined : { scale: 1.02 }}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                      >
                        <Button
                          size="lg"
                          className={cn(
                            "h-12 gap-3 rounded-full border-0 bg-primary pr-7 pl-2 text-primary-foreground",
                            "shadow-[0_16px_48px_-20px_oklch(0.55_0.14_180_/_0.55)]",
                            "hover:bg-primary/90"
                          )}
                          onClick={() =>
                            document
                              .getElementById("projects")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                          {primaryLabel}
                        </Button>
                      </motion.div>
                      <button
                        type="button"
                        className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary max-md:text-right"
                        onClick={() =>
                          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        {secondaryLabel} →
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom — single-line name */}
            <div className="pointer-events-auto shrink-0 border-t border-white/[0.06] bg-background/40 px-3 py-4 backdrop-blur-[2px] sm:px-6 sm:py-5">
              <PosterBottomName
                naturalName={naturalName}
                displayUpper={displayUpper}
                reduceMotion={reduce}
              />
            </div>
          </div>
        </div>
      </TubesBackground>
    </section>
  )
}
