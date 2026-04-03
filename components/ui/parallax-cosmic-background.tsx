"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

export interface CosmicParallaxBgProps {
  /** Main heading (large, center). Ignored when `showOverlayText` is false. */
  head?: string
  /**
   * Subtitle: comma-separated phrases, each animated as a segment.
   * Ignored when `showOverlayText` is false.
   */
  text?: string
  /** Loop star + text animations */
  loop?: boolean
  className?: string
  /** When false, only stars / horizon / earth render (e.g. section background). @default true */
  showOverlayText?: boolean
}

function generateStarBoxShadow(count: number): string {
  const shadows: string[] = []
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000)
    const y = Math.floor(Math.random() * 2000)
    shadows.push(`${x}px ${y}px #fff`)
  }
  return shadows.join(", ")
}

/**
 * Cosmic parallax starfield with optional centered title + comma-split subtitle.
 * Stars are generated after mount so SSR markup stays stable.
 */
export function CosmicParallaxBg({
  head = "",
  text = "",
  loop = true,
  className,
  showOverlayText = true,
}: Readonly<CosmicParallaxBgProps>) {
  const [smallStars, setSmallStars] = useState("")
  const [mediumStars, setMediumStars] = useState("")
  const [bigStars, setBigStars] = useState("")

  const textParts = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSmallStars(generateStarBoxShadow(700))
      setMediumStars(generateStarBoxShadow(200))
      setBigStars(generateStarBoxShadow(100))
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const iteration = loop ? "infinite" : "1"

  return (
    <div
      className={cn("cosmic-parallax-container", className)}
      style={
        {
          "--cosmic-animation-iteration": iteration,
          "--cosmic-small": smallStars || "0 0 transparent",
          "--cosmic-medium": mediumStars || "0 0 transparent",
          "--cosmic-large": bigStars || "0 0 transparent",
        } as CSSProperties
      }
    >
      <div className="cosmic-stars" />
      <div className="cosmic-stars-medium" />
      <div className="cosmic-stars-large" />

      <div className="cosmic-horizon">
        <div className="cosmic-horizon-glow" />
      </div>
      <div className="cosmic-earth" />

      {showOverlayText && head ? <div className="cosmic-title">{head.toUpperCase()}</div> : null}
      {showOverlayText && textParts.length > 0 ? (
        <div className="cosmic-subtitle">
          {textParts.map((part, index) => (
            <span
              key={`${part}-${index}`}
              className={cn(
                "cosmic-subtitle-part",
                index === 0 && "cosmic-subtitle-part--a",
                index === 1 && "cosmic-subtitle-part--b",
                index === 2 && "cosmic-subtitle-part--c",
                index > 2 && "cosmic-subtitle-part--rest"
              )}
            >
              {part.toUpperCase()}
              {index < textParts.length - 1 ? "\u00a0" : null}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
