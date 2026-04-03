import type { HeroData } from "@/types/portfolio"

/** Shape shown in the hero JSON panel (read-only). */
export interface HeroProfileSummary {
  name: string
  title: string
  skills_summary: string
  core_skills: string[]
  roles: string[]
  cta: {
    primary: string
    secondary: string
  }
}

const DEFAULT_CORE_SKILLS = [
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "Docker",
  "REST APIs",
  "System Design",
] as const

const DEFAULT_ROLES = ["Backend Engineer", "Full Stack Developer"] as const

const FALLBACK_SKILLS_SUMMARY =
  "Backend-focused engineer skilled in building scalable systems using Node.js, PostgreSQL, and Docker. Strong in system design, API development, and clean architecture."

function firstRoleTitle(data: HeroData): string {
  if (data.roleVariants?.length) {
    const t = data.roleVariants[0]?.trim()
    if (t) return t
  }
  const part = data.role.split("|")[0]?.trim()
  return part || data.role.trim() || "Software Development Engineer"
}

export function buildHeroProfileSummary(data: HeroData): HeroProfileSummary {
  const tagline = data.tagline?.trim()
  return {
    name: data.name.trim() || "Biraj Mahanta",
    title: firstRoleTitle(data),
    skills_summary: tagline || FALLBACK_SKILLS_SUMMARY,
    core_skills: [...DEFAULT_CORE_SKILLS],
    roles: [...DEFAULT_ROLES],
    cta: {
      primary: data.ctaPrimaryLabel,
      secondary: data.ctaSecondaryLabel,
    },
  }
}
