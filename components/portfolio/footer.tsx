"use client"

import { Heart, Code2 } from "lucide-react"
import type { FooterData } from "@/types/portfolio"

interface FooterProps {
  data: FooterData
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="h-4 w-4" />
            <span>Built with</span>
            <Heart className="h-4 w-4 fill-accent text-accent" />
            <span>{data.tagline}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>
              &copy; {new Date().getFullYear()} {data.copyrightName}. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
