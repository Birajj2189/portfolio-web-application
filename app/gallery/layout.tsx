import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery | DevSpace",
  description: "A visual window into life beyond the code.",
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
