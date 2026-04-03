"use client"

import { useCallback, useRef, useState, type ComponentType } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Brain, Bug, GitBranch, RefreshCw, Sparkles, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"

type IconKey = "branch" | "bug" | "spark" | "wrench"

const PAIRS: IconKey[] = ["branch", "bug", "spark", "wrench"]

const ICONS: Record<
  IconKey,
  { Icon: ComponentType<{ className?: string }>; label: string; className: string }
> = {
  branch: { Icon: GitBranch, label: "branch", className: "text-emerald-400" },
  bug: { Icon: Bug, label: "fix", className: "text-rose-400" },
  spark: { Icon: Sparkles, label: "feat", className: "text-amber-300" },
  wrench: { Icon: Wrench, label: "chore", className: "text-sky-400" },
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(dealKey: number): { id: string; kind: IconKey }[] {
  const doubled: IconKey[] = [...PAIRS, ...PAIRS]
  return shuffle(doubled).map((kind, i) => ({
    id: `m-${dealKey}-${i}-${kind}`,
    kind,
  }))
}

export function PlaygroundMemoryMatch() {
  const reduce = useReducedMotion()
  const dealRef = useRef(0)
  const [deck, setDeck] = useState(() => buildDeck(0))
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<Set<IconKey>>(() => new Set())
  const [moves, setMoves] = useState(0)
  const [lock, setLock] = useState(false)

  const won = matched.size === PAIRS.length

  const reset = useCallback(() => {
    dealRef.current += 1
    setDeck(buildDeck(dealRef.current))
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLock(false)
  }, [])

  const onFlip = (id: string, kind: IconKey) => {
    if (lock || won) return
    if (flipped.includes(id)) return
    const card = deck.find((c) => c.id === id)
    if (!card || matched.has(card.kind)) return

    if (flipped.length === 0) {
      setFlipped([id])
      return
    }
    if (flipped.length === 1) {
      const firstId = flipped[0]
      const first = deck.find((c) => c.id === firstId)
      if (!first) return
      setMoves((m) => m + 1)
      setFlipped([firstId, id])
      setLock(true)

      if (first.kind === kind) {
        globalThis.setTimeout(() => {
          setMatched((s) => new Set(s).add(kind))
          setFlipped([])
          setLock(false)
        }, 420)
      } else {
        globalThis.setTimeout(() => {
          setFlipped([])
          setLock(false)
        }, 650)
      }
    }
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[oklch(0.11_0.02_260)] shadow-[0_12px_40px_-28px_rgba(0,0,0,0.55)]"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-black/20 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex gap-1.5 opacity-90">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </span>
          <div className="min-w-0">
            <h4 className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
              <Brain className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              Commit match
            </h4>
            <p className="truncate text-xs text-muted-foreground">
              Flip two cards — pair the same change type. Fewer moves wins.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-primary/90">
          memory
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
          <span>
            moves <span className="font-semibold text-primary tabular-nums">{moves}</span>
          </span>
          <span>
            pairs{" "}
            <span className="font-semibold text-zinc-300 tabular-nums">
              {matched.size}/{PAIRS.length}
            </span>
          </span>
          {won && <span className="text-emerald-400/90">workspace clean ✓</span>}
        </div>

        <fieldset className="grid min-h-[8.5rem] grid-cols-4 gap-2 border-0 p-0 sm:min-h-[9.5rem] sm:gap-2.5">
          <legend className="sr-only">Memory cards</legend>
          {deck.map((card) => {
            const isFaceUp = flipped.includes(card.id) || matched.has(card.kind)
            const { Icon, label, className } = ICONS[card.kind]

            return (
              <motion.button
                key={card.id}
                type="button"
                disabled={lock || matched.has(card.kind)}
                onClick={() => onFlip(card.id, card.kind)}
                whileHover={reduce || lock ? undefined : { scale: 1.03 }}
                whileTap={reduce || lock ? undefined : { scale: 0.97 }}
                className={`relative flex aspect-square min-h-[4.25rem] items-center justify-center rounded-xl border text-center transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:min-h-[4.75rem] ${
                  matched.has(card.kind)
                    ? "border-emerald-500/35 bg-emerald-500/10"
                    : "border-white/[0.1] bg-black/40 hover:border-primary/25"
                }`}
                aria-label={isFaceUp ? `${label} matched` : "Hidden card"}
              >
                <span
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 ${
                    isFaceUp ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={!isFaceUp}
                >
                  <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${className}`} />
                  <span className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
                    {label}
                  </span>
                </span>
                <span
                  className={`font-mono text-xs font-medium text-zinc-500 transition-opacity duration-200 ${
                    isFaceUp ? "opacity-0" : "opacity-100"
                  }`}
                >
                  ?
                </span>
              </motion.button>
            )
          })}
        </fieldset>

        {won && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Nice — <span className="font-mono text-emerald-400">{moves}</span> moves.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 shrink-0 border-white/15 px-2.5"
              onClick={reset}
            >
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Shuffle
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
