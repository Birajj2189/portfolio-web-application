"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  BookOpen,
  Boxes,
  Briefcase,
  Calculator,
  Check,
  Code2,
  Copy,
  FileSpreadsheet,
  Gamepad2,
  Palette,
  Terminal,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TechNewsSection } from "@/components/portfolio/tech-news-section"
import {
  SECTION_EASE,
  sectionGrid,
  sectionGridItemScale,
  sectionIntro,
  sectionIntroLine,
  sectionViewport,
} from "@/lib/section-motion"

const codeSnippets = [
  {
    title: "React Custom Hook",
    description: "Async state with loading and errors in one hook.",
    code: `const useAsync = (asyncFn) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (...args) => {
    setState({ loading: true });
    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false });
    } catch (error) {
      setState({ error, loading: false });
    }
  };

  return { ...state, execute };
};`,
    language: "ts",
  },
  {
    title: "Debounce",
    description: "Delay execution until the user pauses typing.",
    code: `const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};`,
    language: "ts",
  },
] as const

const shelfTiles = [
  { label: "Tools & games", Icon: Gamepad2 },
  { label: "Blogs", Icon: BookOpen },
  { label: "Snippets", Icon: Code2 },
  { label: "Jobs", Icon: Briefcase },
  { label: "Cheatsheets", Icon: FileSpreadsheet },
] as const

const tileContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.25 },
  },
}

const tileItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: SECTION_EASE },
  },
}

const labSection = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.03 } },
}

const labRow = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SECTION_EASE } },
}

const labGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.06 } },
}

const labCol = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.82, ease: SECTION_EASE } },
}

export function Playground() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [colors, setColors] = useState(["#14b8a6", "#ec4899", "#f97316", "#eab308", "#8b5cf6"])
  const [text, setText] = useState("")
  const reduce = useReducedMotion()

  const copyToClipboard = (code: string, index: number) => {
    void navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const generateColors = () => {
    const newColors = Array.from(
      { length: 5 },
      () =>
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
    )
    setColors(newColors)
  }

  const hoverLift = reduce
    ? undefined
    : { y: -3, transition: { type: "spring" as const, stiffness: 420, damping: 28 } }

  return (
    <section
      id="playground"
      className="relative flex min-h-screen scroll-mt-24 flex-col justify-center overflow-hidden px-4 pt-16 pb-24 md:pt-20 md:pb-28"
    >
      <div className="dot-pattern pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-[320px] w-[320px] rounded-full bg-primary/6 blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Intro copy — staggered on scroll */}
        <motion.div
          variants={reduce ? undefined : sectionIntro}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
          className="mb-10 md:mb-12"
        >
          <motion.div variants={reduce ? undefined : sectionIntroLine}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.2em] text-primary uppercase sm:text-[11px]">
              <Boxes className="h-3.5 w-3.5 opacity-90" />
              Lab · Shelf · Signal
            </div>
          </motion.div>
          <motion.h2
            variants={reduce ? undefined : sectionIntroLine}
            className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-[2.65rem] lg:leading-[1.12]"
          >
            Developer playground
          </motion.h2>
          <motion.p
            variants={reduce ? undefined : sectionIntroLine}
            className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base"
          >
            Experiments, live headlines, and small utilities in one calm layout. The full shelf
            opens on its own page when you want to go deeper.
          </motion.p>
        </motion.div>

        {/* Bento row */}
        <motion.div
          variants={reduce ? undefined : sectionGrid}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
          className="grid gap-5 lg:grid-cols-12 lg:gap-6"
        >
          <motion.div
            variants={reduce ? undefined : sectionGridItemScale}
            className="lg:col-span-5"
          >
            <motion.div
              whileHover={reduce ? undefined : { transition: { duration: 0.35 } }}
              className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-card/35 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-primary/20 hover:shadow-[0_28px_90px_-28px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex h-full flex-col p-6 md:p-7">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                    <Beaker className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Public asset shelf</p>
                    <p className="text-xs text-muted-foreground">Strapi-backed · always current</p>
                  </div>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  Tools, posts, snippets, cheatsheets, and roles — organized as a single hub.
                </p>

                <motion.div
                  className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3"
                  variants={reduce ? undefined : tileContainer}
                  initial={reduce ? false : "hidden"}
                  whileInView={reduce ? undefined : "visible"}
                  viewport={{ ...sectionViewport, amount: 0.35 }}
                >
                  {shelfTiles.map(({ label, Icon }) => (
                    <motion.div key={label} variants={reduce ? undefined : tileItem}>
                      <div className="flex cursor-default items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-primary/20 hover:bg-primary/[0.06] hover:text-foreground">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                        <span className="line-clamp-2 leading-tight">{label}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div className="mt-auto" whileHover={hoverLift}>
                  <Link
                    href="/playground"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/15 transition-[filter] duration-300 hover:brightness-110 active:brightness-95"
                  >
                    Open full playground
                    <ArrowUpRight className="h-4 w-4 opacity-90" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : sectionGridItemScale}
            className="flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-card/25 p-5 shadow-[0_20px_70px_-36px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-6 lg:col-span-7"
          >
            <TechNewsSection variant="compact" newsCardScrollStagger />
          </motion.div>
        </motion.div>

        {/* Lab */}
        <motion.div
          variants={reduce ? undefined : labSection}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
          className="mt-12 md:mt-16"
        >
          <motion.div
            variants={reduce ? undefined : labRow}
            className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                On this page
              </p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Snippets & micro-lab
              </h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Copy a pattern or try a tiny widget — no extra navigation.
            </p>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : labGrid}
            className="grid gap-8 lg:grid-cols-2 lg:gap-10"
          >
            <motion.div variants={reduce ? undefined : labCol} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                Code snippets
              </div>
              <div className="space-y-4">
                {codeSnippets.map((snippet, index) => (
                  <motion.div
                    key={snippet.title}
                    initial={reduce ? false : { opacity: 0, y: 22 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
                    transition={{
                      delay: reduce ? 0 : 0.08 + index * 0.1,
                      duration: 0.75,
                      ease: SECTION_EASE,
                    }}
                    whileHover={reduce ? undefined : { transition: { duration: 0.35 } }}
                    className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[oklch(0.11_0.02_260)] shadow-lg transition-[border-color,box-shadow] duration-300 hover:border-white/10 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-black/20 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex gap-1.5 opacity-90">
                          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                        </span>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-medium text-foreground">
                            {snippet.title}
                          </h4>
                          <p className="truncate text-xs text-muted-foreground">
                            {snippet.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-primary/90">
                          {snippet.language}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(snippet.code, index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-white/5 hover:text-primary"
                          aria-label="Copy snippet"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <pre className="max-h-[200px] overflow-x-auto overflow-y-auto p-4 text-[11px] leading-relaxed">
                      <code className="font-mono text-zinc-500">{snippet.code}</code>
                    </pre>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={reduce ? undefined : labCol} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Palette className="h-4 w-4 text-accent" />
                Micro demos
              </div>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: SECTION_EASE }}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40 shadow-lg backdrop-blur-sm transition-[border-color] duration-300 hover:border-white/10"
              >
                <div className="divide-y divide-white/[0.06]">
                  <div className="p-6 md:p-7">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground">Color generator</h4>
                      <span className="text-xs text-muted-foreground">Tap to copy</span>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {colors.map((color, i) => (
                        <motion.button
                          key={`${i}-${color}`}
                          type="button"
                          whileHover={reduce ? undefined : { scale: 1.08 }}
                          whileTap={reduce ? undefined : { scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 500, damping: 26 }}
                          className="h-10 w-10 cursor-pointer rounded-lg ring-2 ring-transparent transition-shadow hover:ring-primary/35 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            void navigator.clipboard.writeText(color)
                          }}
                          title={`Copy ${color}`}
                          aria-label={`Copy color ${color}`}
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateColors}
                      className="w-full border-white/10 bg-transparent hover:border-primary/30 hover:bg-primary/5"
                    >
                      Shuffle palette
                    </Button>
                  </div>
                  <div className="p-6 md:p-7">
                    <div className="mb-4 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-foreground">Character counter</h4>
                    </div>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type something…"
                      className="h-28 w-full resize-none rounded-xl border border-white/[0.08] bg-background/60 p-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-primary/25 focus:outline-none"
                    />
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4 text-sm">
                      <span className="text-muted-foreground">
                        Chars{" "}
                        <span className="font-mono font-semibold text-primary tabular-nums">
                          {text.length}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Words{" "}
                        <span className="font-mono font-semibold text-accent tabular-nums">
                          {text.trim() ? text.trim().split(/\s+/).length : 0}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={hoverLift}>
                <Link
                  href="/playground"
                  className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3.5 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:border-primary/25 hover:bg-primary/[0.04] hover:text-primary"
                >
                  Explore the complete shelf
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
