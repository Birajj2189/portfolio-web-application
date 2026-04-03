"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowUpRight,
  Beaker,
  BookOpen,
  Briefcase,
  Code2,
  Copy,
  Check,
  FileSpreadsheet,
  Gamepad2,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { usePlaygroundShelfStore } from "@/store/playground-shelf.store"
import { strapiImageUrl } from "@/lib/gallery"
import type {
  PlaygroundKind,
  PlaygroundShelfData,
  PlaygroundShelfEntry,
} from "@/types/playground-shelf"

type Filter = "all" | PlaygroundKind

const KIND_META: Record<
  PlaygroundKind,
  {
    label: string
    short: string
    sectionTitle: string
    Icon: typeof Gamepad2
    chip: string
    accent: string
    sectionBg: string
  }
> = {
  TOOL_GAME: {
    label: "Tools & games",
    short: "Tool",
    sectionTitle: "Interactive shelf",
    Icon: Gamepad2,
    chip: "bg-violet-500/15 text-violet-300 ring-violet-500/25",
    accent: "from-violet-500/20 to-transparent",
    sectionBg: "border-violet-500/10",
  },
  BLOG: {
    label: "Blogs",
    short: "Blog",
    sectionTitle: "Writing & longform",
    Icon: BookOpen,
    chip: "bg-sky-500/15 text-sky-300 ring-sky-500/25",
    accent: "from-sky-500/20 to-transparent",
    sectionBg: "border-sky-500/10",
  },
  SNIPPET: {
    label: "Code snippets",
    short: "Snippet",
    sectionTitle: "Copy-paste friendly",
    Icon: Code2,
    chip: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
    accent: "from-emerald-500/20 to-transparent",
    sectionBg: "border-emerald-500/10",
  },
  CHEATSHEET: {
    label: "Cheatsheets",
    short: "Sheet",
    sectionTitle: "Quick references",
    Icon: FileSpreadsheet,
    chip: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
    accent: "from-amber-500/20 to-transparent",
    sectionBg: "border-amber-500/10",
  },
  JOB: {
    label: "Open roles",
    short: "Job",
    sectionTitle: "Recent openings",
    Icon: Briefcase,
    chip: "bg-rose-500/15 text-rose-300 ring-rose-500/25",
    accent: "from-rose-500/20 to-transparent",
    sectionBg: "border-rose-500/10",
  },
}

const SECTION_ORDER: PlaygroundKind[] = ["JOB", "TOOL_GAME", "BLOG", "SNIPPET", "CHEATSHEET"]

function pickItems(data: PlaygroundShelfData, k: PlaygroundKind) {
  switch (k) {
    case "TOOL_GAME":
      return data.tools
    case "BLOG":
      return data.blogs
    case "SNIPPET":
      return data.snippets
    case "CHEATSHEET":
      return data.cheatsheets
    case "JOB":
      return data.jobs
  }
}

function SnippetActions({ entry }: Readonly<{ entry: PlaygroundShelfEntry }>) {
  const [copied, setCopied] = useState(false)
  const code = entry.code?.trim()
  if (!code) return null
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(code).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        })
      }}
      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-medium text-zinc-300 transition-colors hover:border-primary/40 hover:text-primary"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

function ShelfCard({ entry, index }: Readonly<{ entry: PlaygroundShelfEntry; index: number }>) {
  const meta = KIND_META[entry.kind]
  const Icon = meta.Icon
  const reduce = useReducedMotion()
  const coverSrc = entry.cover?.formats?.small?.url ?? entry.cover?.url ?? ""
  const href = entry.url?.trim() || "#"
  const hasLink = href !== "#"
  const isJob = entry.kind === "JOB"
  const isSnippet = entry.kind === "SNIPPET"

  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : index * 0.04, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-colors hover:border-primary/35 ${
        isJob ? "ring-1 ring-rose-500/10" : ""
      }`}
    >
      {hasLink ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-[1] rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Open ${entry.title}`}
        />
      ) : null}

      <div className="relative z-[2] flex h-full flex-col">
        <div
          className={`relative overflow-hidden ${isSnippet ? "min-h-[120px]" : "aspect-[16/10]"} pointer-events-none bg-secondary`}
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.accent}`}
          />
          {isSnippet && entry.code ? (
            <pre className="relative z-[1] max-h-[140px] overflow-hidden p-4 font-mono text-[11px] leading-relaxed text-zinc-300">
              <code className="line-clamp-6 break-all whitespace-pre-wrap">{entry.code}</code>
            </pre>
          ) : coverSrc ? (
            <Image
              src={strapiImageUrl(coverSrc)}
              alt={entry.cover?.alternativeText ?? entry.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="flex h-full min-h-[140px] w-full items-center justify-center">
              <Icon className="h-14 w-14 text-muted-foreground/30" />
            </div>
          )}
          <span
            className={`absolute top-3 left-3 z-[2] inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${meta.chip}`}
          >
            <Icon className="h-3 w-3" />
            {meta.short}
            {entry.language ? (
              <span className="ml-1 rounded bg-black/25 px-1 font-mono text-[10px]">
                {entry.language}
              </span>
            ) : null}
          </span>
        </div>
        <div className="pointer-events-none flex flex-1 flex-col p-5">
          {isJob && (entry.company || entry.remote != null) ? (
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {entry.company ? (
                <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-foreground">
                  {entry.company}
                </span>
              ) : null}
              {entry.remote ? (
                <span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-primary">
                  Remote
                </span>
              ) : null}
              {entry.location ? (
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {entry.location}
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
              {entry.title}
            </h3>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </div>
          {entry.description ? (
            <p className="mb-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
          ) : (
            <div className="flex-1" />
          )}
          {isSnippet && entry.code?.trim() ? (
            <div className="pointer-events-auto relative z-[3] mb-2">
              <SnippetActions entry={entry} />
            </div>
          ) : null}
          {entry.tags && entry.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

function SectionBlock({
  kind,
  items,
  filter,
}: Readonly<{ kind: PlaygroundKind; items: PlaygroundShelfEntry[]; filter: Filter }>) {
  const reduce = useReducedMotion()
  if (filter !== "all" && filter !== kind) return null
  if (items.length === 0) return null

  const meta = KIND_META[kind]
  const Icon = meta.Icon

  return (
    <motion.section
      id={`play-${kind.toLowerCase().replace("_", "-")}`}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`mb-16 scroll-mt-28 rounded-3xl border bg-card/30 p-6 md:p-8 ${meta.sectionBg}`}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 ring-1 ring-border">
            <Icon className="h-6 w-6 text-primary" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">{meta.sectionTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{meta.label}</p>
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      <ul
        className={`grid gap-5 ${
          kind === "JOB"
            ? "md:grid-cols-2"
            : kind === "SNIPPET"
              ? "md:grid-cols-2 xl:grid-cols-2"
              : "sm:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {items.map((entry, i) => (
          <li key={`${kind}-${entry.id}`}>
            <ShelfCard entry={entry} index={i} />
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

export default function PlaygroundHubPage() {
  const { data, warnings, status, errorMessage, fetch: fetchShelf } = usePlaygroundShelfStore()
  const [filter, setFilter] = useState<Filter>("all")
  const reduce = useReducedMotion()

  useEffect(() => {
    fetchShelf()
  }, [fetchShelf])

  const scrollToKind = useCallback((k: Filter) => {
    setFilter(k)
    if (k === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const id = `play-${k.toLowerCase().replace("_", "-")}`
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const counts = useMemo(() => {
    if (!data) return null
    return {
      all:
        data.tools.length +
        data.blogs.length +
        data.snippets.length +
        data.cheatsheets.length +
        data.jobs.length,
      TOOL_GAME: data.tools.length,
      BLOG: data.blogs.length,
      SNIPPET: data.snippets.length,
      CHEATSHEET: data.cheatsheets.length,
      JOB: data.jobs.length,
    }
  }, [data])

  const header = data?.header
  const warnKeys = Object.keys(warnings ?? {})

  return (
    <div className="dot-pattern min-h-screen bg-background">
      <div className="pointer-events-none fixed top-1/4 -left-32 h-[480px] w-[480px] rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/8 blur-3xl" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/"
          className="glass-card mb-8 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>

        <motion.header
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          className="mb-10 md:mb-14"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Public digital shelf
          </div>
          <div className="flex flex-wrap items-end gap-6">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-3">
                <Beaker className="h-8 w-8 shrink-0 text-primary md:h-9 md:w-9" />
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  {header?.title ?? "Developer Playground"}
                </h1>
              </div>
              <p className="font-mono text-base text-primary md:text-lg">
                {header?.subtitle ?? "Tools, writing, snippets, cheatsheets & roles"}
              </p>
              {header?.description ? (
                <p className="mt-4 max-w-2xl text-muted-foreground">{header.description}</p>
              ) : null}
            </div>
          </div>
        </motion.header>

        {counts && status === "success" ? (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            className="mb-8 flex flex-wrap gap-3"
          >
            <div className="rounded-2xl border border-border bg-card/50 px-4 py-3 backdrop-blur-sm">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Total assets
              </p>
              <p className="text-2xl font-bold text-foreground tabular-nums">{counts.all}</p>
            </div>
            {SECTION_ORDER.map((k) => {
              const n = counts[k]
              if (n === 0) return null
              const m = KIND_META[k]
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => scrollToKind(k)}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-background/40 px-4 py-3 text-left transition-colors hover:border-primary/40"
                >
                  <m.Icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="font-mono text-sm font-semibold tabular-nums">{n}</p>
                  </div>
                </button>
              )
            })}
          </motion.div>
        ) : null}

        {/* Sticky filters */}
        <div className="sticky top-[72px] z-20 -mx-4 mb-10 border-b border-border/60 bg-background/75 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all" as const, label: "All" },
                ...SECTION_ORDER.map((k) => ({ key: k, label: KIND_META[k].label })),
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => scrollToKind(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border border-border bg-card/60 text-muted-foreground hover:border-primary/45 hover:text-primary"
                }`}
              >
                {label}
                {counts && key !== "all" ? (
                  <span className="ml-1.5 font-mono text-[11px] opacity-80">
                    ({counts[key as PlaygroundKind]})
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {warnKeys.length > 0 ? (
          <div className="mb-8 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/90">
            <p className="font-medium text-amber-100">
              Some Strapi collections did not load (check API IDs / permissions):
            </p>
            <ul className="mt-2 list-inside list-disc font-mono text-[11px] opacity-90">
              {warnKeys.map((k) => (
                <li key={k}>
                  {k}: {warnings[k]}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {status === "idle" || status === "loading" ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm">Loading shelf…</p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="glass-card rounded-2xl border border-destructive/30 p-10 text-center">
            <p className="mb-2 text-destructive">{errorMessage}</p>
            <p className="mb-6 text-sm text-muted-foreground">
              The shelf API failed. Ensure Strapi is running and collections match{" "}
              <code className="rounded bg-secondary px-1">types/playground-shelf.ts</code>.
            </p>
            <button
              type="button"
              onClick={fetchShelf}
              className="rounded-xl bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        ) : null}

        {status === "success" && data && counts && counts.all === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground">
            <Beaker className="mx-auto mb-4 h-12 w-12 opacity-40" />
            <p className="font-medium text-foreground">
              Your shelf is ready — add content in Strapi.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm">
              Create collection types such as{" "}
              <code className="rounded bg-secondary px-1">playground-tool-games</code>,{" "}
              <code className="rounded bg-secondary px-1">playground-blogs</code>,{" "}
              <code className="rounded bg-secondary px-1">playground-snippets</code>,{" "}
              <code className="rounded bg-secondary px-1">playground-cheatsheets</code>, and{" "}
              <code className="rounded bg-secondary px-1">playground-jobs</code>. Optional single
              type <code className="rounded bg-secondary px-1">playground-hub</code> for the page
              header.
            </p>
          </div>
        ) : null}

        {status === "success" && data && counts && counts.all > 0
          ? SECTION_ORDER.map((kind) => (
              <SectionBlock key={kind} kind={kind} items={pickItems(data, kind)} filter={filter} />
            ))
          : null}

        <footer className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          <p>
            Assets are public links — curated in Strapi. UI is a static shell; source of truth lives
            in your CMS.
          </p>
        </footer>
      </div>
    </div>
  )
}
