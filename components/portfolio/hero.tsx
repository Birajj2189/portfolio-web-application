"use client"

import { useMemo, useState, useEffect, useCallback, useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion"
import { ArrowDown, Sparkles, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
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

// Deterministic “random” particle layout — stable across renders
const PARTICLE_SEEDS = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  x: ((i * 47) % 100) / 100,
  y: ((i * 73 + 19) % 100) / 100,
  size: 1 + (i % 3),
  duration: 14 + (i % 5) * 2,
}))

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
            className="absolute inset-x-0 font-mono text-xl text-muted-foreground sm:text-2xl"
          >
            {lines[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <span className="font-mono text-xl text-muted-foreground sm:text-2xl">
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
// Interactive playful terminal
// ─────────────────────────────────────────────────────────────────────────────
type LogLine = { id: string; kind: "sys" | "cmd" | "out" | "err"; text: string; className?: string }

type EvalResult = { lines: Omit<LogLine, "id">[]; clear?: boolean }

function evalPortfolioCommand(raw: string, displayName: string): EvalResult {
  const cmd = raw.trim().toLowerCase()
  const rest = raw
    .trim()
    .slice(cmd.split(/\s+/)[0]?.length ?? 0)
    .trim()

  if (cmd === "clear" || cmd === "cls") return { clear: true, lines: [] }
  if (!cmd) return { lines: [] }

  const o = (text: string, className?: string): Omit<LogLine, "id"> => ({
    kind: "out",
    text,
    className,
  })

  if (cmd === "help" || cmd === "?") {
    return {
      lines: [
        o("Commands worth your keystrokes:", "text-zinc-400"),
        o(
          "  whoami · pwd · ls · coffee · sudo … · rm -rf / · git · npm · date · uname\n  echo · touch grass · grep · 42 · motivation · hack · exit",
          "whitespace-pre-wrap text-zinc-500"
        ),
        o("(It’s a toy shell. Real bugs are in production.)", "text-primary/80 italic"),
      ],
    }
  }

  if (cmd === "whoami") {
    return {
      lines: [
        o(displayName, "font-semibold text-primary"),
        o("…also: human, typo enthusiast, occasional 3am debugger.", "text-zinc-500"),
      ],
    }
  }

  if (cmd === "pwd") {
    return { lines: [o("/home/creativity/projects/please-hire-me", "text-emerald-400/90")] }
  }

  if (cmd.startsWith("ls")) {
    return {
      lines: [
        o(
          "ideas/   side-projects/   node_modules/  (send help)\n" +
            "dreams.tar.gz   todo-never.md   one-more-tweak.sh",
          "whitespace-pre-wrap text-zinc-300"
        ),
      ],
    }
  }

  if (cmd.startsWith("cat ")) {
    const target = rest.toLowerCase() || "file"
    return {
      lines: [
        o(
          `cat: ${target}: No such file — try opening the real portfolio sections below.`,
          "text-amber-400/90"
        ),
      ],
    }
  }

  if (cmd === "cat") {
    return {
      lines: [o("cat: purring not implemented. Try `cat readme.md` for drama.", "text-zinc-400")],
    }
  }

  if (cmd.includes("coffee") || cmd === "brew" || cmd.startsWith("brew ")) {
    return {
      lines: [
        o("☕ Starting brew…", "text-zinc-400"),
        o(
          "Error: out of beans. Substituting optimism. Exit code: still tired.",
          "text-rose-300/90"
        ),
      ],
    }
  }

  if (cmd.startsWith("sudo")) {
    const wish = raw.replace(/^\s*sudo\s+/i, "").trim() || "be awesome"
    return {
      lines: [
        o(`sudo: nice try — this kiosk runs in user space only.`, "text-amber-400/90"),
        o(`(If I could, I’d run: ${wish})`, "text-zinc-500 italic"),
      ],
    }
  }

  if (cmd.includes("rm") && cmd.includes("-rf")) {
    return {
      lines: [
        o("rm: refusing to delete reality. This portfolio likes existing.", "text-red-400/90"),
        o(
          "…use the dismiss button on the greeting bubble instead. /s",
          "text-zinc-500 text-[10px]"
        ),
      ],
    }
  }

  if (cmd.startsWith("git ")) {
    if (cmd.includes("push")) {
      return {
        lines: [
          o("Enumerating hype… counting stars…", "text-zinc-400"),
          o("✓ Pushed to origin/main — metaphorically. You’ve got this.", "text-emerald-400/90"),
        ],
      }
    }
    if (cmd.includes("status")) {
      return {
        lines: [
          o(
            "On branch main\nYou: unstaged enthusiasm, staged imposter syndrome\nnothing to commit (lies — you’re shipping)",
            "whitespace-pre-wrap text-zinc-400"
          ),
        ],
      }
    }
    if (cmd.includes("commit")) {
      return { lines: [o('git: "fix: everything" — if only it were that easy.', "text-zinc-400")] }
    }
    return { lines: [o("git: that’s valid git energy. Keep going.", "text-primary/80")] }
  }

  if (cmd.startsWith("npm ")) {
    if (cmd.includes("install")) {
      return {
        lines: [
          o(
            "added 847 packages in 42 minutes\nfound 0 vulnerabilities (unrealistic fanfic mode: on)",
            "whitespace-pre-wrap text-zinc-400"
          ),
        ],
      }
    }
    if (cmd.includes("run")) {
      return {
        lines: [
          o(
            "> portfolio@1.0.0 scroll\n✓ You’re already running — keep exploring.",
            "whitespace-pre-wrap text-emerald-400/90"
          ),
        ],
      }
    }
    if (cmd.includes("start")) {
      return {
        lines: [o("Server already started… it’s called your curiosity. 🔥", "text-primary/90")],
      }
    }
    return { lines: [o("npm: sounds productive. Hydrate first.", "text-zinc-400")] }
  }

  if (cmd === "date") {
    return {
      lines: [
        o(`${new Date().toString()} — statistically, a good day to refactor.`, "text-zinc-300"),
      ],
    }
  }

  if (cmd.startsWith("uname")) {
    return {
      lines: [
        o("PortfolioOS 1.0 (hype_arm64) — built with caffeine & TypeScript", "text-zinc-300"),
      ],
    }
  }

  if (cmd.startsWith("echo ")) {
    const said = raw.replace(/^\s*echo\s+/i, "").replace(/^["']|["']$/g, "")
    return { lines: [o(said || "…", "text-zinc-200")] }
  }

  if (cmd === "touch grass") {
    return {
      lines: [
        o("touch: cannot create 'grass': Outside not found in $PATH", "text-amber-400/90"),
        o("(Go for a walk after this scroll, yeah?)", "text-zinc-500"),
      ],
    }
  }

  if (cmd.startsWith("grep ")) {
    return {
      lines: [
        o(
          "grep: motivation found in ./you — use -i for self-doubt (case insensitive)",
          "text-emerald-400/85"
        ),
      ],
    }
  }

  if (cmd === "42") {
    return { lines: [o("You read Hitchhiker’s Guide. The answer checks out.", "text-primary/90")] }
  }

  if (cmd === "motivation" || cmd === "hype") {
    return {
      lines: [
        o("Your future self is already proud you opened the terminal.", "text-emerald-400/90"),
        o("Now close it and ship one small thing. 🚀", "text-zinc-400"),
      ],
    }
  }

  if (cmd === "hack" || cmd === "hack the planet") {
    return {
      lines: [
        o("ACCESS GRANTED… to the public README.", "text-red-400/80"),
        o("(Just kidding. Be kind to APIs.)", "text-zinc-500"),
      ],
    }
  }

  if (cmd === "exit" || cmd === "quit") {
    return {
      lines: [
        o("There is no escape — only smooth scroll. Try #about.", "text-zinc-400"),
        o("^D not wired. This is the web; we use anchors here.", "text-zinc-500 italic"),
      ],
    }
  }

  if (cmd === "skill issue") {
    return {
      lines: [
        o("git gud — but gently. Everyone’s faking it until the tests pass.", "text-primary/85"),
      ],
    }
  }

  const unknown = [
    `command not found: ${raw.trim()} — try \`help\` before blaming npm`,
    `zsh: ${raw.trim()}: not found (skill issue? jk… try \`whoami\`)`,
    `bash: ${raw.trim()}: Permission denied — emotionally, not legally`,
  ]
  return { lines: [o(unknown[cmd.length % unknown.length]!, "text-rose-300/85")] }
}

function HeroTerminal({ name }: Readonly<{ name: string }>) {
  const reduceMotion = useReducedMotion()
  const [log, setLog] = useState<LogLine[]>([])
  const [input, setInput] = useState("")
  const lineId = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const nextId = useCallback(() => {
    lineId.current += 1
    return `t-${lineId.current}`
  }, [])

  const pushLines = useCallback(
    (entries: Omit<LogLine, "id">[]) => {
      if (entries.length === 0) return
      setLog((prev) => [...prev, ...entries.map((e) => ({ ...e, id: nextId() }))])
    },
    [nextId]
  )

  const resetToIntro = useCallback(() => {
    setLog([
      { id: nextId(), kind: "sys", text: "Portfolio shell · type `help` for silly commands." },
      {
        id: nextId(),
        kind: "sys",
        text: "Try: coffee · sudo make sandwich · rm -rf / · motivation",
      },
    ])
  }, [nextId])

  // Boot intro (staggered or instant)
  useEffect(() => {
    if (reduceMotion) {
      const id = globalThis.requestAnimationFrame(() => resetToIntro())
      return () => cancelAnimationFrame(id)
    }
    const t1 = globalThis.setTimeout(() => {
      setLog([
        { id: nextId(), kind: "sys", text: "Portfolio shell · type `help` for silly commands." },
      ])
    }, 450)
    const t2 = globalThis.setTimeout(() => {
      setLog((prev) => [
        ...prev,
        {
          id: nextId(),
          kind: "sys",
          text: "Try: coffee · sudo make sandwich · rm -rf / · motivation",
        },
      ])
    }, 1000)
    return () => {
      globalThis.clearTimeout(t1)
      globalThis.clearTimeout(t2)
    }
  }, [reduceMotion, resetToIntro, nextId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [log])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = input.trim()
    setInput("")
    if (!raw) return

    pushLines([{ kind: "cmd", text: `$ ${raw}` }])

    const result = evalPortfolioCommand(raw, name)
    if (result.clear) {
      globalThis.setTimeout(() => resetToIntro(), 0)
      return
    }
    pushLines(result.lines)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 28, rotateY: -6 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ delay: 0.9, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      role="region"
      aria-label="Playful command terminal"
      onClick={() => inputRef.current?.focus()}
      className="glass-card absolute right-6 bottom-24 z-20 hidden w-[min(92vw,340px)] cursor-text overflow-hidden rounded-xl border border-primary/15 shadow-[0_0_40px_rgba(20,184,166,0.08)] lg:block xl:right-10 xl:bottom-28"
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-black/30 px-3 py-2">
        <Terminal className="h-3.5 w-3.5 shrink-0 text-primary/80" />
        <span className="font-mono text-[10px] tracking-wide text-muted-foreground">
          zsh — portfolio (interactive)
        </span>
        <div className="ml-auto flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
          <span className="h-2 w-2 rounded-full bg-green-500/80" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[200px] space-y-1.5 overflow-y-auto overscroll-contain p-3 font-mono text-[11px] leading-relaxed sm:max-h-[220px] sm:text-xs"
      >
        {log.map((line) => (
          <motion.div
            key={line.id}
            initial={reduceMotion ? false : { opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={
              line.kind === "sys"
                ? "text-zinc-500 italic"
                : line.kind === "cmd"
                  ? "text-zinc-400"
                  : line.kind === "err"
                    ? "text-red-400/90"
                    : (line.className ?? "text-zinc-200")
            }
          >
            <span className="break-words whitespace-pre-wrap">{line.text}</span>
          </motion.div>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-white/8 bg-black/40 px-2 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="hero-terminal-input" className="sr-only">
          Terminal command
        </label>
        <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs">
          <span className="shrink-0 text-primary">$</span>
          <input
            id="hero-terminal-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="help"
            className="min-w-0 flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
      </form>
    </motion.div>
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

  const nameEase: [number, number, number, number] = [0.19, 1, 0.22, 1]
  const letterStagger = 0.036
  const letterBaseDelay = 0.2

  const gradientNameClass =
    "bg-gradient-to-r from-primary via-cyan-300/95 to-accent bg-[length:220%_auto] bg-clip-text text-transparent [text-shadow:0_0_48px_oklch(0.72_0.14_180_/_0.22)]"

  const shimmerTransition = { duration: 6.5, repeat: Infinity, ease: "linear" as const }

  return (
    <div className="relative flex flex-col items-center gap-1 sm:gap-2">
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[min(28rem,120%)] w-[min(42rem,140%)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.28, duration: 1.15, ease: nameEase }}
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.72 0.14 180 / 0.2), oklch(0.65 0.18 330 / 0.08) 45%, transparent 70%)",
          }}
        />
      ) : null}

      <motion.div
        className="mb-1 font-mono text-[11px] font-medium tracking-[0.25em] text-primary/80 uppercase sm:text-xs"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02, duration: 0.55, ease: nameEase }}
      >
        Hi, I&apos;m
      </motion.div>

      <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:gap-4 md:gap-5">
        {last ? (
          <>
            <motion.span
              className="block text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
              initial={reduceMotion ? false : { opacity: 0, y: 28, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.08, duration: 0.78, ease: nameEase }}
            >
              {first}
            </motion.span>

            <motion.span
              aria-hidden
              className="hidden font-light text-primary/40 select-none sm:inline sm:text-4xl md:text-5xl"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.35 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.55, ease: nameEase }}
            >
              ·
            </motion.span>

            <motion.span
              className={`relative inline-block text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${gradientNameClass}`}
              animate={reduceMotion ? {} : { backgroundPosition: ["0% center", "200% center"] }}
              transition={shimmerTransition}
            >
              {!reduceMotion ? (
                <span className="inline-flex flex-wrap justify-center gap-y-0.5">
                  {last.split("").map((char, i) => (
                    <motion.span
                      key={`${i}-${char}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: letterBaseDelay + i * letterStagger,
                        duration: 0.52,
                        ease: nameEase,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              ) : (
                last
              )}
              {!reduceMotion ? (
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-1/2 h-px w-[min(100%,11rem)] max-w-full origin-center -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/55 to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    delay: letterBaseDelay + last.length * letterStagger + 0.12,
                    duration: 0.88,
                    ease: nameEase,
                  }}
                />
              ) : null}
            </motion.span>
          </>
        ) : (
          <motion.span
            className={`block text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${gradientNameClass}`}
            initial={reduceMotion ? false : { opacity: 0, y: 26, filter: "blur(10px)" }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    backgroundPosition: ["0% center", "200% center"],
                  }
            }
            transition={{
              opacity: { delay: 0.08, duration: 0.75, ease: nameEase },
              y: { delay: 0.08, duration: 0.75, ease: nameEase },
              filter: { delay: 0.08, duration: 0.75, ease: nameEase },
              backgroundPosition: { ...shimmerTransition, delay: 0.08 },
            }}
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
  const reduceMotion = useReducedMotion()

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      mouseX.set((e.clientX - r.left) / r.width)
      mouseY.set((e.clientY - r.top) / r.height)
    },
    [mouseX, mouseY]
  )

  const handleLeave = useCallback(() => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  const normX = useTransform(mouseX, [0, 1], [-1, 1])
  const normY = useTransform(mouseY, [0, 1], [-1, 1])
  const springConfig = { stiffness: 26, damping: 22, mass: 0.4 }
  const px = useSpring(normX, springConfig)
  const py = useSpring(normY, springConfig)

  const gridX = useTransform(px, (v) => (reduceMotion ? 0 : v * 36))
  const gridY = useTransform(py, (v) => (reduceMotion ? 0 : v * 22))
  const orbX = useTransform(px, (v) => (reduceMotion ? 0 : v * -20))
  const orbY = useTransform(py, (v) => (reduceMotion ? 0 : v * -14))
  const particleX = useTransform(px, (v) => (reduceMotion ? 0 : v * 12))
  const particleY = useTransform(py, (v) => (reduceMotion ? 0 : v * 8))

  return (
    <motion.section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Animated mesh gradient (alive, low contrast) */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40"
        animate={
          reduceMotion
            ? {}
            : {
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 20% 30%, oklch(0.75 0.15 180 / 0.22), transparent 55%),
            radial-gradient(ellipse 70% 50% at 80% 70%, oklch(0.72 0.2 330 / 0.18), transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.55 0.12 260 / 0.12), transparent 45%)
          `,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Dot grid + parallax */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: gridX, y: gridY }}>
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </motion.div>

      {/* Soft orbs — counter-parallax */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: orbX, y: orbY }}>
        <div className="animate-pulse-glow absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/18 blur-3xl" />
        <div
          className="animate-pulse-glow absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-accent/16 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </motion.div>

      {/* Subtle floating particles */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: particleX, y: particleY }}
      >
        {PARTICLE_SEEDS.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/25"
            style={{
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              width: p.size,
              height: p.size,
            }}
            animate={
              reduceMotion
                ? {}
                : {
                    y: [0, -10, 0],
                    opacity: [0.12, 0.35, 0.12],
                  }
            }
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.id * 0.08,
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {data.available && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Available for new opportunities</span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <HeroDisplayName name={data.name} reduceMotion={!!reduceMotion} />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <motion.span
            className="h-px w-12 bg-gradient-to-r from-transparent to-border"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          />
          <DynamicRole lines={roleLines} />
          <motion.span
            className="h-px w-12 bg-gradient-to-l from-transparent to-border"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.55 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {data.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.55 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="glow-teal bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {data.ctaPrimaryLabel}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="border-border px-8 hover:border-accent hover:text-accent"
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {data.ctaSecondaryLabel}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={reduceMotion ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <a
          href="#about"
          className="group glass-card flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
        >
          <span className="font-medium tracking-wide">Scroll to explore</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 transition-colors group-hover:bg-primary/40">
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          </span>
        </a>
      </motion.div>

      <HeroTerminal name={data.name} />
    </motion.section>
  )
}
