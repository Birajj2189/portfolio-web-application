import {
  Layout,
  Layers,
  Server,
  Database,
  Container,
  Code2,
  Rocket,
  Briefcase,
  Award,
  GraduationCap,
  Lightbulb,
  BookOpen,
  FileText,
  Globe,
  Cpu,
  GitBranch,
  Cloud,
  Zap,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Layout,
  Layers,
  Server,
  Database,
  Container,
  Code2,
  Rocket,
  Briefcase,
  Award,
  GraduationCap,
  Lightbulb,
  BookOpen,
  FileText,
  Globe,
  Cpu,
  GitBranch,
  Cloud,
  Zap,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Code2
}
