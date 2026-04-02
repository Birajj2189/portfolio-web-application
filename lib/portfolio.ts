import type { PortfolioData } from "@/types/portfolio"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1330"

export async function fetchPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${STRAPI_URL}/api/portfolio?populate=deep`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch portfolio data: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()

  // Strapi v5 returns a flat object: { data: { id, ...fields }, meta: {} }
  // Strapi v4 returns:              { data: { id, attributes: { ...fields } }, meta: {} }
  // Handle both shapes gracefully.
  const raw = json?.data ?? json
  return (raw?.attributes ?? raw) as PortfolioData
}
