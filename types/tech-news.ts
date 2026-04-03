export interface TechNewsItem {
  id: string
  source: string
  title: string
  url: string
  publishedAt?: string
  author?: string
  points?: number
  excerpt?: string
  image?: string | null
}
