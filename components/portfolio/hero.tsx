"use client"

import { ArrowDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HeroData } from "@/types/portfolio"

interface HeroProps {
  data: HeroData
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="dot-pattern relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="animate-pulse-glow absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div
        className="animate-pulse-glow absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Status badge */}
        {data.available && (
          <div className="glass-card animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Available for new opportunities</span>
          </div>
        )}

        {/* Main heading */}
        <h1
          className="animate-slide-up mb-6 text-4xl font-bold sm:text-5xl md:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-foreground">Hi, I&apos;m </span>
          <span className="text-primary">{data.name}</span>
        </h1>

        {/* Role */}
        <div
          className="animate-slide-up mb-6 flex items-center justify-center gap-3"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="h-px w-12 bg-border" />
          <span className="font-mono text-xl text-muted-foreground sm:text-2xl">{data.role}</span>
          <span className="h-px w-12 bg-border" />
        </div>

        {/* Tagline */}
        <p
          className="animate-slide-up mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          style={{ animationDelay: "0.3s" }}
        >
          {data.tagline}
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-slide-up flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            size="lg"
            className="glow-teal bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {data.ctaPrimaryLabel}
          </Button>
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
        </div>
      </div>

      {/* Scroll indicator — anchored to the section bottom */}
      <div className="animate-float absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#about"
          className="group glass-card flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
        >
          <span className="font-medium tracking-wide">Scroll to explore</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 transition-colors group-hover:bg-primary/40">
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          </span>
        </a>
      </div>

      {/* Terminal decoration */}
      <div
        className="glass-card animate-float absolute right-10 bottom-20 hidden rounded-xl p-4 opacity-60 lg:block"
        style={{ animationDelay: "2s" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <code className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">const</span> developer = {"{"}
          <br />
          &nbsp;&nbsp;passion: <span className="text-accent">&quot;building&quot;</span>,<br />
          &nbsp;&nbsp;coffee: <span className="text-chart-3">Infinity</span>
          <br />
          {"}"};
        </code>
      </div>
    </section>
  )
}
