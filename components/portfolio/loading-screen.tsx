"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { useBootSequence } from "@/components/portfolio/loading-screen/boot-sequence"

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TerminalCursor = memo(function TerminalCursor() {
  return (
    <span className="animate-loader-cursor-blink text-primary" aria-hidden>
      ▍
    </span>
  )
})

const TerminalBootLog = memo(function TerminalBootLog({
  settledLines,
  commandLineActive,
  typingCmdSuffix,
  pendingDoneLine,
  typingPersonalitySuffix,
  showCursor,
}: Readonly<{
  settledLines: readonly string[]
  commandLineActive: boolean
  typingCmdSuffix: string
  pendingDoneLine: string | null
  typingPersonalitySuffix: string | null
  showCursor: boolean
}>) {
  const showCmdCursor =
    showCursor && commandLineActive && typingPersonalitySuffix === null && pendingDoneLine === null
  const showPersonalityCursor = showCursor && typingPersonalitySuffix !== null

  return (
    <div className="min-h-[10.5rem] space-y-2.5 font-mono text-[13px] leading-relaxed sm:min-h-[11rem] sm:text-sm">
      <AnimatePresence initial={false} mode="popLayout">
        {settledLines.map((line, i) => (
          <motion.div
            key={`log-${i}`}
            layout
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className={
              line.startsWith(">")
                ? "flex flex-wrap gap-x-1.5 text-foreground/95"
                : "pl-0.5 text-muted-foreground"
            }
          >
            {line.startsWith(">") ? (
              <>
                <span className="shrink-0 text-primary">&gt;</span>
                <span>{line.slice(2)}</span>
              </>
            ) : (
              line
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {typingPersonalitySuffix !== null ? (
        <motion.div
          layout
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-baseline gap-x-1.5 text-foreground/95"
        >
          <span className="shrink-0 text-primary">&gt;</span>
          <span>{typingPersonalitySuffix}</span>
          {showPersonalityCursor ? <TerminalCursor /> : null}
        </motion.div>
      ) : commandLineActive ? (
        <div className="space-y-2">
          <motion.div layout className="flex flex-wrap items-baseline gap-x-1.5 text-foreground/95">
            <span className="shrink-0 text-primary">&gt;</span>
            <span>{typingCmdSuffix}</span>
            {showCmdCursor ? <TerminalCursor /> : null}
          </motion.div>
          <AnimatePresence>
            {pendingDoneLine ? (
              <motion.div
                key={pendingDoneLine}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
                className="pl-0.5 text-muted-foreground"
              >
                {pendingDoneLine}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  )
})

export interface LoadingScreenProps {
  onSequenceComplete?: () => void
}

export function LoadingScreen({ onSequenceComplete }: Readonly<LoadingScreenProps>) {
  const reduce = useReducedMotion() ?? false
  const narrativeOnce = useRef(false)
  const completeOnce = useRef(false)

  const [fadeOut, setFadeOut] = useState(false)
  const [barPulse, setBarPulse] = useState(false)
  const [pctLabel, setPctLabel] = useState(0)

  const handleNarrativeComplete = useCallback(() => {
    if (narrativeOnce.current) return
    narrativeOnce.current = true
    setBarPulse(true)
    setFadeOut(true)
  }, [])

  const boot = useBootSequence(reduce, handleNarrativeComplete)

  const progressMv = useMotionValue(boot.progressTarget)
  const progressSpring = useSpring(progressMv, {
    stiffness: reduce ? 220 : 88,
    damping: reduce ? 36 : 26,
    mass: 0.85,
  })

  useEffect(() => {
    progressMv.set(boot.progressTarget)
  }, [boot.progressTarget, progressMv])

  const barWidth = useTransform(progressSpring, (v) => `${Math.min(100, Math.max(0, v))}%`)

  useMotionValueEvent(progressSpring, "change", (v) => {
    const n = Math.round(Math.min(100, Math.max(0, v)))
    setPctLabel((p) => (p === n ? p : n))
  })

  const showTypingCursor = useMemo(() => {
    if (reduce) return false
    return (
      boot.typingPersonalitySuffix !== null ||
      boot.commandLineActive ||
      boot.pendingDoneLine !== null
    )
  }, [reduce, boot.typingPersonalitySuffix, boot.commandLineActive, boot.pendingDoneLine])

  const exitTransition = reduce
    ? { duration: 0.35, ease: EASE_OUT }
    : { duration: 0.52, ease: EASE_OUT }

  return (
    <motion.div
      className="dot-pattern fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-background"
      initial={false}
      animate={
        fadeOut
          ? { opacity: 0, scale: 0.97, filter: reduce ? "blur(0px)" : "blur(10px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={exitTransition}
      onAnimationComplete={() => {
        if (!fadeOut || completeOnce.current) return
        completeOnce.current = true
        onSequenceComplete?.()
      }}
    >
      {/* Existing neon depth stack — unchanged base aesthetic */}
      <div
        className="animate-loader-mesh pointer-events-none absolute inset-0 opacity-100 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 72% 58% at 50% 42%, oklch(0.62 0.14 180 / 0.14), transparent 58%), radial-gradient(ellipse 55% 48% at 78% 72%, oklch(0.58 0.18 330 / 0.09), transparent 52%)",
        }}
        aria-hidden
      />
      <div
        className="animate-loader-ambient pointer-events-none absolute top-[18%] left-[18%] h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-primary/[0.11] blur-[100px]"
        aria-hidden
      />
      <div
        className="animate-loader-ambient pointer-events-none absolute right-[12%] bottom-[20%] h-[min(22rem,55vw)] w-[min(22rem,55vw)] rounded-full bg-accent/[0.08] blur-[88px]"
        style={{ animationDelay: "1.4s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,transparent_0%,oklch(0.08_0.02_260/0.65)_100%)]"
        aria-hidden
      />
      {/* Faint center rim — depth only */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_38%_at_50%_38%,oklch(0.72_0.12_180/0.06),transparent_70%)]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-10 px-6 sm:gap-11">
        {/* 1 — Logo */}
        <motion.div
          className="relative flex h-[5.75rem] w-[5.75rem] shrink-0 items-center justify-center"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <div
            className="animate-loader-logo-glow pointer-events-none absolute inset-[-18%] rounded-full bg-primary/25 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-[-8%] rounded-full bg-gradient-to-tr from-primary/20 via-transparent to-accent/15 blur-xl"
            aria-hidden
          />
          <div className="animate-loader-logo-float relative flex h-full w-full items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border border-primary/15 bg-primary/[0.04] shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]"
              aria-hidden
            />
            <div
              className="animate-loader-orbit absolute inset-0 rounded-full border-2 border-transparent border-t-primary/90 border-r-primary/25 motion-reduce:border-t-primary/50"
              aria-hidden
            />
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.55, delay: 0.06, ease: EASE_OUT }}
              className="relative z-[1] flex h-[4.35rem] w-[4.35rem] items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/88 font-mono text-lg font-bold tracking-tight text-primary-foreground shadow-[0_16px_48px_-20px_oklch(0.55_0.14_180_/_0.55),inset_0_1px_0_0_oklch(1_0_0/0.12)] ring-1 ring-white/10 sm:text-xl"
            >
              {"</>"}
            </motion.div>
          </div>
        </motion.div>

        {/* 2 — Terminal */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.52, delay: 0.08, ease: EASE_OUT }}
          style={{
            boxShadow: fadeOut
              ? "0 18px 56px -36px rgba(0,0,0,0.5)"
              : "0 24px 80px -40px rgba(0,0,0,0.65), 0 0 0 1px oklch(1 0 0 / 0.04)",
          }}
          className="glass-card w-full max-w-[22rem] rounded-2xl border border-white/[0.08] bg-card/40 p-6 backdrop-blur-xl sm:max-w-[24rem] sm:p-7"
        >
          <div className="mb-5 flex items-center gap-2 border-b border-white/[0.06] pb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-sm ring-1 ring-black/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-sm ring-1 ring-black/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-sm ring-1 ring-black/20" />
            <span className="ml-2 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              devspace.sh
            </span>
          </div>

          <TerminalBootLog
            settledLines={boot.settledLines}
            commandLineActive={boot.commandLineActive}
            typingCmdSuffix={boot.typingCmdSuffix}
            pendingDoneLine={boot.pendingDoneLine}
            typingPersonalitySuffix={boot.typingPersonalitySuffix}
            showCursor={showTypingCursor}
          />
        </motion.div>

        {/* 3 — Progress */}
        <motion.div
          className="w-full max-w-[17rem] sm:max-w-[20rem]"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14, ease: EASE_OUT }}
        >
          <div className="mb-2 flex items-center justify-between px-0.5">
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              System
            </span>
            <span className="font-mono text-[10px] text-primary/85 tabular-nums">{pctLabel}%</span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary/90 ring-1 ring-white/[0.06]">
            <motion.div
              className={
                barPulse
                  ? "animate-loader-bar-pulse relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary/85 via-primary to-primary/90"
                  : "relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary/85 via-primary to-primary/90"
              }
              initial={false}
              style={{ width: barWidth }}
            >
              {!reduce ? (
                <div
                  className="animate-loader-shimmer pointer-events-none absolute inset-y-0 w-[45%] bg-gradient-to-r from-transparent via-white/28 to-transparent"
                  aria-hidden
                />
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ErrorScreen({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="glass-card w-full max-w-md rounded-2xl p-8 text-center">
        <div className="mb-4 font-mono text-5xl text-destructive">{"</>"}</div>
        <h2 className="mb-2 text-xl font-bold text-foreground">Connection Failed</h2>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
