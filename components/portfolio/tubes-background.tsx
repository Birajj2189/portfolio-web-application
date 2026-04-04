"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function randomHexColors(count: number): string[] {
  return Array.from({ length: count }, () => {
    const n = Math.floor(Math.random() * 0xffffff)
    return `#${n.toString(16).padStart(6, "0")}`
  })
}

/**
 * CDN bundle ships its own Three.js build. Spline (`@splinetool/react-spline`) also bundles Three,
 * so devtools may warn about multiple Three instances — expected unless you remove one effect.
 */
const TUBES_CURSOR_URL =
  "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js" as const

type TubesApp = {
  tubes: {
    setColors: (colors: string[]) => void
    setLightsColors: (colors: string[]) => void
  }
  destroy?: () => void
}

type TubesCursorFactory = (
  el: HTMLCanvasElement,
  opts: {
    tubes: {
      colors: string[]
      lights: { intensity: number; colors: string[] }
    }
  }
) => TubesApp

export interface TubesBackgroundProps {
  children?: React.ReactNode
  className?: string
  /** When false, skips WebGL init (e.g. reduced motion). */
  enabled?: boolean
  enableClickInteraction?: boolean
}

/** Neon tubes cursor effect (threejs-components). Canvas fills container; children overlay. */
export function TubesBackground({
  children,
  className,
  enabled = true,
  enableClickInteraction = true,
}: Readonly<TubesBackgroundProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<TubesApp | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    let cancelled = false
    const canvas = canvasRef.current
    if (!canvas) return

    const run = async () => {
      try {
        const mod = (await import(
          /* webpackIgnore: true */
          /* vite-ignore */
          TUBES_CURSOR_URL
        )) as { default: TubesCursorFactory }
        const TubesCursor = mod.default

        if (cancelled || !canvasRef.current) return

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
            },
          },
        })

        appRef.current = app
        setReady(true)
      } catch (e) {
        console.error("TubesBackground: failed to load cursor effect", e)
      }
    }

    void run()

    return () => {
      cancelled = true
      appRef.current?.destroy?.()
      appRef.current = null
      setReady(false)
    }
  }, [enabled])

  const handleCanvasClick = useCallback(() => {
    if (!enableClickInteraction || !ready) return
    const app = appRef.current
    if (!app?.tubes) return
    app.tubes.setColors(randomHexColors(3))
    app.tubes.setLightsColors(randomHexColors(4))
  }, [enableClickInteraction, ready])

  return (
    <div
      className={cn(
        "relative h-full min-h-[min(100dvh,100%)] w-full overflow-hidden bg-background",
        className
      )}
    >
      {enabled ? (
        <canvas
          ref={canvasRef}
          role="presentation"
          aria-hidden
          className="absolute inset-0 z-0 block h-full w-full cursor-crosshair"
          style={{ touchAction: "none" }}
          onClick={handleCanvasClick}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-background" aria-hidden />
      )}

      <div className="pointer-events-none relative z-10 flex min-h-dvh w-full flex-col">
        {children}
      </div>
    </div>
  )
}
