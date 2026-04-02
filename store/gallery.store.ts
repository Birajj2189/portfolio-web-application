import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { fetchGallery } from "@/lib/gallery"
import type { GalleryData } from "@/types/gallery"

type FetchStatus = "idle" | "loading" | "success" | "error"

interface GalleryState {
  data: GalleryData | null
  status: FetchStatus
  errorMessage: string | null
  fetch: () => Promise<void>
}

export const useGalleryStore = create<GalleryState>()(
  devtools(
    (set, get) => ({
      data: null,
      status: "idle",
      errorMessage: null,

      fetch: async () => {
        if (get().status === "loading") return
        set({ status: "loading", errorMessage: null }, false, "gallery/fetch/start")
        try {
          const data = await fetchGallery()
          set({ data, status: "success" }, false, "gallery/fetch/success")
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load gallery"
          set({ status: "error", errorMessage: message }, false, "gallery/fetch/error")
        }
      },
    }),
    { name: "GalleryStore" }
  )
)
