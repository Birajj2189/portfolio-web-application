/**
 * Strapi: separate Collection Types (adjust API IDs to match your Strapi admin).
 *
 * | Collection API ID           | Purpose              | Suggested fields |
 * |----------------------------|----------------------|------------------|
 * | playground-tool-games    | Mini-games & tools   | title, description, url, cover, tags, order |
 * | playground-blogs           | Blogs / articles     | title, description, url, cover, tags, order |
 * | playground-snippets        | Code snippets        | title, description, url, code, language, tags, order |
 * | playground-cheatsheets     | Cheatsheets / refs   | title, description, url, cover, tags, order |
 * | playground-jobs            | Job openings         | title, description, url, company, location, remote, tags, order |
 *
 * Single Type `playground-hub` (optional): header only — title, subtitle, description
 * GET /api/playground-hub?populate=deep
 */
import type { StrapiImage } from "@/types/gallery"

export type PlaygroundKind = "TOOL_GAME" | "BLOG" | "SNIPPET" | "CHEATSHEET" | "JOB"

export interface PlaygroundHubHeader {
  title: string
  subtitle: string
  description?: string
}

export interface PlaygroundShelfEntry {
  id: number
  kind: PlaygroundKind
  title: string
  description: string
  url: string
  cover?: StrapiImage | null
  tags?: string[]
  order?: number
  /** Snippet */
  code?: string
  language?: string
  /** Job */
  company?: string
  location?: string
  remote?: boolean
}

export interface PlaygroundShelfData {
  header: PlaygroundHubHeader
  tools: PlaygroundShelfEntry[]
  blogs: PlaygroundShelfEntry[]
  snippets: PlaygroundShelfEntry[]
  cheatsheets: PlaygroundShelfEntry[]
  jobs: PlaygroundShelfEntry[]
}

/** Which Strapi collection UIDs failed (for dev messaging) */
export type PlaygroundFetchWarnings = Partial<Record<string, string>>
