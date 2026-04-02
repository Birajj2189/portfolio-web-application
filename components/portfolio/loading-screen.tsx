"use client"

import { useEffect, useState } from "react"

const STEPS = [
  "Initialising dev environment...",
  "Fetching portfolio data...",
  "Compiling components...",
  "Rendering your experience...",
]

export function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
    }, 800)
    return () => clearInterval(stepTimer)
  }, [])

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."))
    }, 400)
    return () => clearInterval(dotTimer)
  }, [])

  return (
    <div className="dot-pattern fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background">
      {/* Gradient orbs */}
      <div className="animate-pulse-glow absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div
        className="animate-pulse-glow absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Logo mark */}
        <div className="relative">
          <div className="glow-teal flex h-20 w-20 items-center justify-center rounded-2xl bg-primary font-mono text-2xl font-bold text-primary-foreground">
            {"</>"}
          </div>
          {/* Spinning ring */}
          <div className="absolute -inset-2 animate-spin rounded-2xl border-2 border-transparent border-t-primary/60" />
        </div>

        {/* Terminal block */}
        <div className="glass-card w-80 rounded-2xl p-6 sm:w-96">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">devspace.sh</span>
          </div>

          <div className="space-y-2 font-mono text-sm">
            {STEPS.slice(0, stepIndex + 1).map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="text-primary">›</span>
                <span className={i < stepIndex ? "text-muted-foreground" : "text-foreground"}>
                  {i === stepIndex ? `${step}${dots}` : step}
                </span>
                {i < stepIndex && <span className="ml-auto text-xs text-primary">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-64 overflow-hidden rounded-full bg-secondary sm:w-80">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground">Loading portfolio{dots}</p>
      </div>
    </div>
  )
}

// ─── Error screen ─────────────────────────────────────────────────────────────
export function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="glass-card w-full max-w-md rounded-2xl p-8 text-center">
        <div className="mb-4 font-mono text-5xl text-destructive">{"</>"}</div>
        <h2 className="mb-2 text-xl font-bold text-foreground">Connection Failed</h2>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <button
          onClick={onRetry}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
