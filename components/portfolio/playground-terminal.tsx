"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

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

export interface PlaygroundShellTerminalProps {
  displayName: string
  className?: string
}

export function PlaygroundShellTerminal({
  displayName,
  className,
}: Readonly<PlaygroundShellTerminalProps>) {
  const reduceMotion = useReducedMotion()
  const [log, setLog] = useState<LogLine[]>([])
  const [input, setInput] = useState("")
  const lineId = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const raw = input.trim()
    setInput("")
    if (!raw) return

    pushLines([{ kind: "cmd", text: `$ ${raw}` }])

    const result = evalPortfolioCommand(raw, displayName)
    if (result.clear) {
      globalThis.setTimeout(() => resetToIntro(), 0)
      return
    }
    pushLines(result.lines)
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      role="region"
      aria-label="Playful command terminal"
      className={cn(
        "flex min-h-[11rem] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[oklch(0.11_0.02_260)] shadow-[0_16px_48px_-24px_rgba(0,0,0,0.65)] transition-[border-color,box-shadow] duration-300 hover:border-white/10 hover:shadow-[0_20px_56px_-20px_rgba(0,0,0,0.55)]",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.06] bg-black/30 px-4 py-2.5">
        <Terminal className="h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden />
        <span className="font-mono text-[10px] tracking-wide text-muted-foreground">
          zsh — micro-lab (interactive)
        </span>
        <div className="ml-auto flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/90" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/90" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/85" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain p-3 font-mono text-[11px] leading-relaxed sm:text-xs"
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
        className="shrink-0 border-t border-white/[0.06] bg-black/40 px-3 py-2.5"
      >
        <label htmlFor="playground-terminal-input" className="sr-only">
          Terminal command
        </label>
        <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs">
          <span className="shrink-0 text-primary">$</span>
          <input
            id="playground-terminal-input"
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
