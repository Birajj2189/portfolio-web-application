import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer Playground | DevSpace",
  description: "Public mini-games, tools, and blogs — a living shelf of digital experiments.",
}

export default function PlaygroundLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>
}
