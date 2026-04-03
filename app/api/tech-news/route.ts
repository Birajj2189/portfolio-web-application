import { NextResponse } from "next/server"
import type { TechNewsItem } from "@/types/tech-news"

export const revalidate = 600

interface DevToArticle {
  id: number
  title: string
  url: string
  published_at?: string
  description?: string
  cover_image?: string | null
  user?: { name?: string }
}

interface HNHit {
  objectID: string
  title: string
  url?: string
  points?: number
  author?: string
  created_at_i?: number
  story_text?: string
}

interface NewsApiArticle {
  title: string
  url: string
  publishedAt?: string
  author?: string
  description?: string
  urlToImage?: string | null
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

async function loadDevTo(): Promise<TechNewsItem[]> {
  const r = await fetch("https://dev.to/api/articles?per_page=7&tag=webdev", {
    next: { revalidate: 600 },
    headers: { "User-Agent": "PortfolioFE/1.0" },
  })
  if (!r.ok) return []
  const arr = (await r.json()) as DevToArticle[]
  if (!Array.isArray(arr)) return []
  return arr.map((a) => ({
    id: `devto-${a.id}`,
    source: "Dev.to",
    title: a.title,
    url: a.url,
    publishedAt: a.published_at,
    author: a.user?.name,
    image: a.cover_image ?? null,
    excerpt: a.description ? stripHtml(a.description).slice(0, 180) : undefined,
  }))
}

async function loadHN(): Promise<TechNewsItem[]> {
  const r = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=6&query=programming",
    { next: { revalidate: 600 } }
  )
  if (!r.ok) return []
  const json = (await r.json()) as { hits?: HNHit[] }
  const hits = json.hits ?? []
  return hits.map((h) => ({
    id: `hn-${h.objectID}`,
    source: "Hacker News",
    title: h.title,
    url:
      h.url && h.url.startsWith("http")
        ? h.url
        : `https://news.ycombinator.com/item?id=${h.objectID}`,
    points: h.points,
    author: h.author,
    publishedAt: h.created_at_i ? new Date(h.created_at_i * 1000).toISOString() : undefined,
    excerpt: h.story_text ? stripHtml(h.story_text).slice(0, 140) : undefined,
  }))
}

async function loadNewsApi(): Promise<TechNewsItem[]> {
  const key = process.env.NEWS_API_KEY
  if (!key) return []
  const r = await fetch(
    `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=5&apiKey=${key}`,
    { next: { revalidate: 900 } }
  )
  if (!r.ok) return []
  const json = (await r.json()) as { articles?: NewsApiArticle[] }
  const articles = json.articles ?? []
  return articles
    .filter((a) => a.title && a.url)
    .map((a, i) => ({
      id: `newsapi-${i}-${a.url.slice(-20)}`,
      source: "News",
      title: a.title,
      url: a.url,
      publishedAt: a.publishedAt,
      author: a.author,
      excerpt: a.description ? stripHtml(a.description).slice(0, 160) : undefined,
      image: a.urlToImage ?? null,
    }))
}

export async function GET() {
  const [devto, hn, news] = await Promise.all([loadDevTo(), loadHN(), loadNewsApi()])
  const merged = [...devto, ...hn, ...news]
  return NextResponse.json({ items: merged })
}
