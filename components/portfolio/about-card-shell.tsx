"use client"

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import type { ReactNode, RefObject } from "react"
import { useCallback, useRef } from "react"

import { cn } from "@/lib/utils"

const SPRING = { stiffness: 38, damping: 26, mass: 0.35 }

function useCardPointerGlow(shellRef: RefObject<HTMLDivElement | null>, reducedMotion: boolean) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const px = useSpring(useTransform(mx, [0, 1], [12, 88]), SPRING)
  const py = useSpring(useTransform(my, [0, 1], [12, 88]), SPRING)

  const move = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion) return
      const el = shellRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      mx.set(Math.min(1, Math.max(0, x)))
      my.set(Math.min(1, Math.max(0, y)))
    },
    [mx, my, reducedMotion, shellRef]
  )

  const leave = useCallback(() => {
    mx.set(0.5)
    my.set(0.5)
  }, [mx, my])

  const cursorGlow = useMotionTemplate`radial-gradient(ellipse 70% 60% at ${px}% ${py}%, oklch(0.78 0.16 180 / 0.32), oklch(0.65 0.14 300 / 0.12) 42%, transparent 68%)`

  return { move, leave, cursorGlow }
}

interface AboutCardShellProps {
  children: ReactNode
  reducedMotion: boolean
  className?: string
}

/**
 * Wraps only the About card block (inside `max-w-6xl`), not the section title.
 * Padding leaves a visible “frame” where motion shows through; everything is clipped to rounded rect.
 */
export function AboutCardShell({
  children,
  reducedMotion,
  className,
}: Readonly<AboutCardShellProps>) {
  const shellRef = useRef<HTMLDivElement>(null)
  const { move, leave, cursorGlow } = useCardPointerGlow(shellRef, reducedMotion)

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative isolate w-full max-w-full rounded-2xl p-2.5 sm:p-3 md:p-3.5",
        className
      )}
      onMouseMove={move}
      onMouseLeave={leave}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl ring-1 ring-white/[0.05]"
        aria-hidden
      >
        <motion.div
          className="absolute top-1/2 left-1/2 aspect-square w-[165%] -translate-x-1/2 -translate-y-1/2 opacity-[0.4]"
          style={{
            background: `conic-gradient(from 140deg at 50% 50%, oklch(0.72 0.14 180 / 0.16), transparent 28%, oklch(0.68 0.12 300 / 0.14) 52%, transparent 72%, oklch(0.7 0.1 200 / 0.12) 100%)`,
            filter: "blur(44px)",
          }}
          animate={reducedMotion ? undefined : { rotate: [0, 360] }}
          transition={
            reducedMotion ? undefined : { duration: 72, repeat: Infinity, ease: "linear" }
          }
        />

        <motion.div
          className="absolute inset-0 opacity-[0.55]"
          animate={
            reducedMotion ? undefined : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
          }
          transition={
            reducedMotion ? undefined : { duration: 22, repeat: Infinity, ease: "linear" }
          }
          style={{
            backgroundImage: `
              radial-gradient(ellipse 55% 45% at 25% 35%, oklch(0.75 0.12 180 / 0.16), transparent 55%),
              radial-gradient(ellipse 50% 40% at 78% 65%, oklch(0.7 0.14 310 / 0.12), transparent 50%)
            `,
            backgroundSize: "200% 200%",
          }}
        />

        {!reducedMotion ? (
          <motion.div
            className="absolute inset-0 opacity-90 mix-blend-screen"
            style={{ background: cursorGlow }}
          />
        ) : (
          <div
            className="absolute inset-0 opacity-[0.45] mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 45%, oklch(0.75 0.14 180 / 0.14), transparent 65%)",
            }}
          />
        )}

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-background/40" />
      </div>

      <div className="about-card-aura about-card-aura--framed" aria-hidden />

      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
