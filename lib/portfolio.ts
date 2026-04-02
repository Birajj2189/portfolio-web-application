import type { PortfolioData, PortfolioResponse } from "@/types/portfolio"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1330"

export async function fetchPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${STRAPI_URL}/api/portfolio?populate=deep`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch portfolio data: ${res.status} ${res.statusText}`)
  }

  const json: PortfolioResponse = await res.json()
  return json.data.attributes
}
