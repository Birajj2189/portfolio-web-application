"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowUpRight, Loader2, Newspaper, Radio } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { SECTION_EASE } from "@/lib/section-motion"
import type { TechNewsItem } from "@/types/tech-news"

function formatDate(iso?: string) {
  if (!iso) return ""
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
      new Date(iso)
    )
  } catch {
    return ""
  }
}

function NewsCard({
  item,
  index,
  smoothScroll,
}: Readonly<{ item: TechNewsItem; index: number; smoothScroll?: boolean }>) {
  const reduce = useReducedMotion()
  const t = smoothScroll
    ? {
        delay: reduce ? 0 : index * 0.07,
        duration: 0.78,
        ease: SECTION_EASE,
      }
    : {
        delay: reduce ? 0 : index * 0.05,
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: smoothScroll ? 28 : 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={t}
      whileHover={
        reduce
          ? undefined
          : {
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 28 },
            }
      }
      className="group relative flex max-w-[300px] min-w-[280px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-card/70 shadow-sm backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-lg md:min-w-[280px]"
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[16/9] bg-secondary">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="300px"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-secondary to-accent/10">
              <Newspaper className="h-10 w-10 text-muted-foreground/35" />
            </div>
          )}
          <span className="absolute top-2 left-2 rounded-full bg-background/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase backdrop-blur-sm">
            {item.source}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          {item.excerpt ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {item.excerpt}
            </p>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-muted-foreground">
            <span className="truncate">
              {item.author ?? ""}
              {item.points != null ? ` · ${item.points} pts` : ""}
            </span>
            <span className="shrink-0 tabular-nums">{formatDate(item.publishedAt)}</span>
          </div>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Read
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </a>
    </motion.article>
  )
}

interface TechNewsSectionProps {
  /** Tighter typography and spacing when nested inside another section (e.g. Playground). */
  variant?: "default" | "compact"
  className?: string
  /** Softer, longer scroll-in + spring hover (used beside playground bento). */
  newsCardScrollStagger?: boolean
}

export function TechNewsSection({
  variant = "default",
  className,
  newsCardScrollStagger = false,
}: Readonly<TechNewsSectionProps> = {}) {
  const [items, setItems] = useState<TechNewsItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const reduce = useReducedMotion()
  const compact = variant === "compact"

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/tech-news")
        if (!res.ok) throw new Error("Could not load news")
        const json = (await res.json()) as { items?: TechNewsItem[] }
        if (!cancelled) setItems(Array.isArray(json.items) ? json.items : [])
      } catch {
        if (!cancelled) {
          setError("Tech headlines are unavailable right now.")
          setItems([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={compact ? className : `mb-12 ${className ?? ""}`.trim()}>
      <div
        className={`flex flex-wrap items-end justify-between gap-4 ${compact ? "mb-4" : "mb-6"}`}
      >
        <div>
          <div className={`mb-2 flex items-center gap-2 text-primary ${compact ? "gap-1.5" : ""}`}>
            <Radio className={compact ? "h-4 w-4" : "h-5 w-5"} />
            <span className="font-mono text-[10px] font-semibold tracking-widest uppercase sm:text-xs">
              Live from the ecosystem
            </span>
          </div>
          <h3
            className={`font-bold tracking-tight text-foreground ${compact ? "text-lg md:text-xl" : "text-xl md:text-2xl"}`}
          >
            Dev & tech signal
          </h3>
          {!compact ? (
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Curated headlines from public APIs — no account required. Refreshes on a gentle cache
              cadence.
            </p>
          ) : (
            <p className="mt-1 max-w-lg text-xs leading-relaxed text-muted-foreground">
              Headlines from Dev.to, Hacker News, and optional NewsAPI — cached server-side.
            </p>
          )}
        </div>
      </div>

      {items === null ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 px-6 py-10 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm">Pulling the latest stories…</span>
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
          {error ?? "No articles returned. Try again later."}
        </p>
      ) : (
        <div className="relative">
          <div
            className="-mx-1 flex gap-4 overflow-x-auto overflow-y-visible pt-1 pb-4 [scrollbar-width:thin] md:mx-0 md:pb-2"
            style={{
              scrollSnapType: reduce ? undefined : "x mandatory",
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                className="snap-start"
                style={{ scrollSnapAlign: reduce ? undefined : "start" }}
              >
                <NewsCard item={item} index={i} smoothScroll={newsCardScrollStagger} />
              </div>
            ))}
          </div>
          {/* Edge fades */}
          <div className="pointer-events-none absolute top-0 right-0 z-[1] h-full w-12 bg-gradient-to-l from-background to-transparent md:w-16" />
          <div className="pointer-events-none absolute top-0 left-0 z-[1] h-full w-8 bg-gradient-to-r from-background to-transparent md:w-12" />
        </div>
      )}
    </div>
  )
}
