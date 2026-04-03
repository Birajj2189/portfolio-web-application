import type {
  PlaygroundHubHeader,
  PlaygroundKind,
  PlaygroundShelfData,
  PlaygroundShelfEntry,
  PlaygroundFetchWarnings,
} from "@/types/playground-shelf"
import type { StrapiImage } from "@/types/gallery"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1330"

const COLLECTIONS: { uid: string; kind: PlaygroundKind }[] = [
  { uid: "playground-tool-games", kind: "TOOL_GAME" },
  { uid: "playground-blogs", kind: "BLOG" },
  { uid: "playground-snippets", kind: "SNIPPET" },
  { uid: "playground-cheatsheets", kind: "CHEATSHEET" },
  { uid: "playground-jobs", kind: "JOB" },
]

function unwrapAttributes(item: unknown): Record<string, unknown> {
  if (!item || typeof item !== "object") return {}
  const o = item as Record<string, unknown>
  const inner = o.attributes
  if (inner && typeof inner === "object") {
    return { id: o.id, ...(inner as Record<string, unknown>) }
  }
  return o
}

function pickImage(raw: unknown): StrapiImage | null {
  if (!raw || typeof raw !== "object") return null
  const d = raw as Record<string, unknown>
  const data = d.data
  if (data && typeof data === "object") {
    const img = unwrapAttributes(data)
    if (img.url) return img as unknown as StrapiImage
  }
  if (d.url) return d as unknown as StrapiImage
  return null
}

function normalizeEntry(raw: unknown, kind: PlaygroundKind): PlaygroundShelfEntry | null {
  const a = unwrapAttributes(raw)
  const id = typeof a.id === "number" ? a.id : Number(a.id)
  if (!Number.isFinite(id)) return null
  const title = String(a.title ?? "").trim()
  if (!title) return null
  const url = String(a.url ?? "#").trim() || "#"
  const description = String(a.description ?? a.summary ?? "").trim()
  const tags = Array.isArray(a.tags)
    ? (a.tags as unknown[]).map((t) => String(t)).filter(Boolean)
    : typeof a.tags === "string"
      ? a.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined

  return {
    id,
    kind,
    title,
    description,
    url,
    cover: pickImage(a.cover),
    tags,
    order: typeof a.order === "number" ? a.order : Number(a.order) || 0,
    code: typeof a.code === "string" ? a.code : undefined,
    language: typeof a.language === "string" ? a.language : undefined,
    company: typeof a.company === "string" ? a.company : undefined,
    location: typeof a.location === "string" ? a.location : undefined,
    remote: typeof a.remote === "boolean" ? a.remote : undefined,
  }
}

async function fetchCollection(
  uid: string,
  kind: PlaygroundKind
): Promise<{ entries: PlaygroundShelfEntry[]; error?: string }> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${uid}?populate=deep&sort=order:asc`, {
      cache: "no-store",
    })
    if (!res.ok) {
      return { entries: [], error: `${res.status}` }
    }
    const json = (await res.json()) as { data?: unknown[] }
    const rows = Array.isArray(json?.data) ? json.data : []
    const entries = rows
      .map((row) => normalizeEntry(row, kind))
      .filter((e): e is PlaygroundShelfEntry => e !== null)
    return { entries }
  } catch {
    return { entries: [], error: "network" }
  }
}

async function fetchHubHeader(): Promise<PlaygroundHubHeader> {
  const fallback: PlaygroundHubHeader = {
    title: "Developer Playground",
    subtitle: "A shelf of public experiments, writing & tools",
    description:
      "Everything here links out to real projects, posts, and resources — curated from Strapi collections.",
  }
  try {
    const res = await fetch(`${STRAPI_URL}/api/playground-hub?populate=deep`, { cache: "no-store" })
    if (!res.ok) return fallback
    const json = await res.json()
    const raw = json?.data ?? json
    const attrs = (raw?.attributes ?? raw) as Partial<PlaygroundHubHeader>
    return {
      title: attrs.title ?? fallback.title,
      subtitle: attrs.subtitle ?? fallback.subtitle,
      description: attrs.description ?? fallback.description,
    }
  } catch {
    return fallback
  }
}

export async function fetchPlaygroundShelf(): Promise<{
  data: PlaygroundShelfData
  warnings: PlaygroundFetchWarnings
}> {
  const [header, ...collectionResults] = await Promise.all([
    fetchHubHeader(),
    ...COLLECTIONS.map((c) => fetchCollection(c.uid, c.kind)),
  ])

  const warnings: PlaygroundFetchWarnings = {}
  COLLECTIONS.forEach((c, i) => {
    const r = collectionResults[i]
    if (r?.error) warnings[c.uid] = r.error
  })

  const data: PlaygroundShelfData = {
    header,
    tools: collectionResults[0]?.entries ?? [],
    blogs: collectionResults[1]?.entries ?? [],
    snippets: collectionResults[2]?.entries ?? [],
    cheatsheets: collectionResults[3]?.entries ?? [],
    jobs: collectionResults[4]?.entries ?? [],
  }

  return { data, warnings }
}
