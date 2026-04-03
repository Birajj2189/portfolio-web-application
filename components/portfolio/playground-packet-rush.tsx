"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Gamepad2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type Packet = { id: string; x: number; y: number }

const PADDLE_HALF = 9
const CATCH_LINE = 86
const MISS_LINE = 96
const FALL_PER_TICK = 2.8
const SPAWN_MS_MIN = 700
const SPAWN_MS_MAX = 1400

function randomSpawnDelay() {
  return SPAWN_MS_MIN + Math.random() * (SPAWN_MS_MAX - SPAWN_MS_MIN)
}

export function PlaygroundPacketRush() {
  const reduceMotion = useReducedMotion()
  const labelId = useId()
  const fieldRef = useRef<HTMLDivElement>(null)
  const paddleXRef = useRef(50)
  const packetsRef = useRef<Packet[]>([])
  const [paddleX, setPaddleX] = useState(50)
  const [packets, setPackets] = useState<Packet[]>([])
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [lives, setLives] = useState(3)
  const [phase, setPhase] = useState<"idle" | "running" | "over">("idle")
  const phaseRef = useRef<"idle" | "running" | "over">(phase)
  const [, bump] = useState(0)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  const force = useCallback(() => bump((n) => n + 1), [])

  const syncPaddleFromClientX = useCallback((clientX: number) => {
    const el = fieldRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const pct = ((clientX - r.left) / r.width) * 100
    const clamped = Math.min(100 - PADDLE_HALF, Math.max(PADDLE_HALF, pct))
    paddleXRef.current = clamped
    setPaddleX(clamped)
  }, [])

  const onPointerMove = useCallback(
    (e: { clientX: number }) => {
      if (phaseRef.current !== "running") return
      syncPaddleFromClientX(e.clientX)
    },
    [syncPaddleFromClientX]
  )

  const onPointerDown = useCallback(
    (e: { clientX: number; pointerId: number; currentTarget: HTMLDivElement }) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      if (phaseRef.current === "running") syncPaddleFromClientX(e.clientX)
    },
    [syncPaddleFromClientX]
  )

  const start = useCallback(() => {
    packetsRef.current = []
    setPackets([])
    setScore(0)
    setLives(3)
    setPhase("running")
  }, [])

  const tickFall = reduceMotion ? FALL_PER_TICK * 0.55 : FALL_PER_TICK

  useEffect(() => {
    if (phase !== "running") return

    const id = globalThis.setInterval(() => {
      const paddle = paddleXRef.current
      let caught = 0
      let missed = 0
      const next: Packet[] = []

      for (const p of packetsRef.current) {
        const y = p.y + tickFall
        if (y >= CATCH_LINE && y < MISS_LINE) {
          if (Math.abs(p.x - paddle) <= PADDLE_HALF + 4) {
            caught += 1
            continue
          }
        }
        if (y >= MISS_LINE) {
          missed += 1
          continue
        }
        next.push({ ...p, y })
      }

      packetsRef.current = next
      setPackets(next)

      if (caught > 0) {
        setScore((s) => {
          const n = s + caught
          setBest((b) => Math.max(b, n))
          return n
        })
      }
      if (missed > 0) {
        setLives((l) => {
          const nl = l - missed
          if (nl <= 0) {
            globalThis.setTimeout(() => setPhase("over"), 0)
            return 0
          }
          return nl
        })
      }
      force()
    }, 45)

    return () => globalThis.clearInterval(id)
  }, [phase, force, reduceMotion, tickFall])

  useEffect(() => {
    if (phase !== "running") return

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    const schedule = () => {
      if (cancelled) return
      timeoutId = globalThis.setTimeout(() => {
        if (cancelled || phaseRef.current !== "running") return
        const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const x = 12 + Math.random() * 76
        packetsRef.current = [...packetsRef.current, { id, x, y: 4 }]
        setPackets([...packetsRef.current])
        force()
        schedule()
      }, randomSpawnDelay())
    }

    schedule()
    return () => {
      cancelled = true
      globalThis.clearTimeout(timeoutId)
    }
  }, [phase, force])

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[oklch(0.11_0.02_260)] shadow-[0_12px_40px_-28px_rgba(0,0,0,0.55)]"
      aria-labelledby={labelId}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-black/20 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex gap-1.5 opacity-90">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </span>
          <div className="min-w-0">
            <h4
              id={labelId}
              className="flex items-center gap-2 truncate text-sm font-medium text-foreground"
            >
              <Gamepad2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              Packet rush
            </h4>
            <p className="truncate text-xs text-muted-foreground">
              Catch falling packets on the paddle — mouse or touch.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-accent/90">
          arcade
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
          <span>
            score <span className="font-semibold text-primary tabular-nums">{score}</span>
          </span>
          <span>
            best <span className="font-semibold text-zinc-400 tabular-nums">{best}</span>
          </span>
          <span>
            lives{" "}
            <span className="font-semibold text-rose-300/90 tabular-nums">
              {"◆".repeat(Math.max(0, lives))}
              {"○".repeat(Math.max(0, 3 - lives))}
            </span>
          </span>
        </div>

        <div
          ref={fieldRef}
          role="application"
          aria-label="Packet rush playfield. Move pointer to steer the paddle."
          className="relative isolate aspect-[5/3] w-full cursor-ew-resize touch-none overflow-hidden rounded-xl border border-white/[0.08] bg-black/50"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage: `
                linear-gradient(rgba(20,184,166,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(20,184,166,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "14px 14px",
            }}
          />

          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Packets drop from the top. Slide to catch them on the bar.
              </p>
              <Button
                type="button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={start}
              >
                Start run
              </Button>
            </div>
          )}

          {phase === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 p-4 text-center backdrop-blur-[2px]">
              <p className="font-mono text-sm font-medium text-foreground">Run ended</p>
              <p className="text-xs text-muted-foreground">
                Final score <span className="font-mono text-primary">{score}</span>
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-1 border-white/15"
                onClick={start}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Play again
              </Button>
            </div>
          )}

          {packets.map((p) => (
            <div
              key={p.id}
              className="pointer-events-none absolute flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded border border-primary/40 bg-primary/20 font-mono text-[9px] font-bold text-primary shadow-[0_0_12px_oklch(0.55_0.12_180_/_0.35)]"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-hidden
            >
              1
            </div>
          ))}

          <div
            className="pointer-events-none absolute bottom-[6%] h-2 w-[18%] min-w-[3rem] -translate-x-1/2 rounded-sm bg-gradient-to-r from-primary/80 to-accent/80 shadow-[0_0_16px_oklch(0.55_0.14_180_/_0.4)]"
            style={{ left: `${paddleX}%` }}
          />

          {phase === "running" && (
            <p className="pointer-events-none absolute right-0 bottom-1 left-0 text-center font-mono text-[9px] text-zinc-600">
              drag to move
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
