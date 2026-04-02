// ─────────────────────────────────────────────────────────────────────────────
// Strapi response wrapper
// ─────────────────────────────────────────────────────────────────────────────
export interface StrapiResponse<T> {
  data: {
    id: number
    attributes: T
  }
  meta: Record<string, unknown>
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
export interface HeroData {
  name: string
  /** Primary role; use `|` in the string for multiple rotating lines, or set `roleVariants` */
  role: string
  /** Optional explicit list for rotating role text (Strapi repeatable / JSON) */
  roleVariants?: string[]
  tagline: string
  available: boolean
  ctaPrimaryLabel: string
  ctaSecondaryLabel: string
}

// ─────────────────────────────────────────────────────────────────────────────
// About
// ─────────────────────────────────────────────────────────────────────────────
export interface SkillItem {
  id: number
  name: string
  icon: string // lucide icon name e.g. "Layout"
  color: string // tailwind class e.g. "text-chart-1"
}

export interface AboutData {
  bio: unknown[] // Strapi Blocks (rich text) — rendered via blocks renderer
  techStack: string[]
  skills: SkillItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────
export type ProjectStatus = "COMPLETED" | "IN_PROGRESS" | "LIVE"

export interface ProjectItem {
  id: number
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  demoUrl: string
  status: ProjectStatus
  order: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Journey
// ─────────────────────────────────────────────────────────────────────────────
export interface TimelineItem {
  id: number
  year: string
  title: string
  description: string
  icon: string // lucide icon name
  color: string // tailwind class
}

export interface ExploringItem {
  id: number
  topic: string
  description: string
}

export interface AchievementItem {
  id: number
  title: string
  description: string
}

export interface JourneyData {
  timeline: TimelineItem[]
  exploring: ExploringItem[]
  achievements: AchievementItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Resume
// ─────────────────────────────────────────────────────────────────────────────
export interface ExperienceItem {
  id: number
  company: string
  role: string
  period: string
  description: string
  skills: string[]
}

export interface EducationItem {
  id: number
  institution: string
  degree: string
  period: string
  description: string
}

export interface StatItem {
  id: number
  label: string
  value: string
  color: string // tailwind class
}

export interface ResumeData {
  resumeFileUrl?: string
  experience: ExperienceItem[]
  education: EducationItem[]
  stats: StatItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────────────────────
export interface ContactData {
  email: string
  city: string
  availability: string
  responseTime: string
  quickInfoText: string
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
export interface FooterData {
  copyrightName: string
  tagline: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Root portfolio attributes
// ─────────────────────────────────────────────────────────────────────────────
export interface PortfolioAttributes {
  hero: HeroData
  about: AboutData
  projects: ProjectItem[]
  journey: JourneyData
  resume: ResumeData
  contact: ContactData
  footer: FooterData
}

export type PortfolioResponse = StrapiResponse<PortfolioAttributes>
export type PortfolioData = PortfolioAttributes
