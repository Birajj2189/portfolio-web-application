"use client"

import { useMemo, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Braces } from "lucide-react"
import type { HeroProfileSummary } from "@/lib/hero-profile-summary"

/** Simple tokenizer for read-only JSON display (trusted stringify output). */
function highlightJsonText(json: string): { key: number; node: ReactNode }[] {
  const out: { key: number; node: ReactNode }[] = []
  let i = 0
  let k = 0

  const push = (text: string, className: string) => {
    if (!text) return
    out.push({ key: k++, node: <span className={className}>{text}</span> })
  }

  while (i < json.length) {
    const c = json[i]

    if (c === '"') {
      const start = i
      i += 1
      while (i < json.length) {
        if (json[i] === "\\") {
          i += 2
          continue
        }
        if (json[i] === '"') break
        i += 1
      }
      i += 1
      const token = json.slice(start, i)
      const after = json.slice(i, i + 12)
      const isKey = /^\s*:/.test(after)
      push(token, isKey ? "text-emerald-400/95" : "text-amber-200/88")
      continue
    }

    if (/[-\d]/.test(c ?? "")) {
      const start = i
      while (i < json.length && /[-\d.eE+]/.test(json[i] ?? "")) i += 1
      push(json.slice(start, i), "text-violet-300/90")
      continue
    }

    const rest = json.slice(i)
    if (rest.startsWith("true")) {
      push("true", "text-sky-400/85")
      i += 4
      continue
    }
    if (rest.startsWith("false")) {
      push("false", "text-sky-400/85")
      i += 5
      continue
    }
    if (rest.startsWith("null")) {
      push("null", "text-zinc-500")
      i += 4
      continue
    }

    if (/\s/.test(c ?? "")) {
      const start = i
      while (i < json.length && /\s/.test(json[i] ?? "")) i += 1
      push(json.slice(start, i), "text-zinc-600/90")
      continue
    }

    push(c ?? "", "text-zinc-500/90")
    i += 1
  }

  return out
}

interface HeroProfileJsonPanelProps {
  summary: HeroProfileSummary
}

export function HeroProfileJsonPanel({ summary }: Readonly<HeroProfileJsonPanelProps>) {
  const reduceMotion = useReducedMotion()
  const jsonString = useMemo(() => JSON.stringify(summary, null, 2), [summary])
  const highlighted = useMemo(() => highlightJsonText(jsonString), [jsonString])

  return (
    <motion.aside
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.2, duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
      aria-label="Profile summary as JSON"
    >
      <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[oklch(0.1_0.02_260)] shadow-[0_24px_64px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_40px_-10px_oklch(0.55_0.12_180_/_0.2)] ring-1 ring-primary/15">
        <div className="flex items-center gap-2 border-b border-white/10 bg-black/45 px-3 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <Braces className="h-3.5 w-3.5 shrink-0 text-primary/75" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-mono text-[10px] tracking-wide text-zinc-500">
            ~/portfolio/profile.json
          </span>
          <span className="shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
            read-only
          </span>
        </div>

        <pre
          className="max-h-[min(52vh,420px)] overflow-auto overscroll-contain p-4 font-mono text-[11px] leading-relaxed text-zinc-400 sm:text-xs md:max-h-[min(48vh,380px)]"
          tabIndex={0}
        >
          {highlighted.map(({ key, node }) => (
            <span key={key}>{node}</span>
          ))}
        </pre>

        <div className="border-t border-white/10 bg-black/50 px-3 py-2 font-mono text-[10px] text-zinc-600">
          <span className="text-zinc-500">{"// "}</span>
          <span className="text-primary/70">summary</span>
          <span className="text-zinc-600"> · not editable · sourced from portfolio data</span>
        </div>
      </div>
    </motion.aside>
  )
}
