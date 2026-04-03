import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { PlaygroundShelfData, PlaygroundFetchWarnings } from "@/types/playground-shelf"

type FetchStatus = "idle" | "loading" | "success" | "error"

interface PlaygroundShelfState {
  data: PlaygroundShelfData | null
  warnings: PlaygroundFetchWarnings
  status: FetchStatus
  errorMessage: string | null
  fetch: () => Promise<void>
}

export const usePlaygroundShelfStore = create<PlaygroundShelfState>()(
  devtools(
    (set, get) => ({
      data: null,
      warnings: {},
      status: "idle",
      errorMessage: null,

      fetch: async () => {
        if (get().status === "loading") return
        set({ status: "loading", errorMessage: null }, false, "playgroundShelf/fetch/start")
        try {
          const res = await fetch("/api/playground-shelf", { cache: "no-store" })
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { error?: string }
            throw new Error(body.error ?? `HTTP ${res.status}`)
          }
          const json = (await res.json()) as {
            data: PlaygroundShelfData
            warnings?: PlaygroundFetchWarnings
          }
          set(
            {
              data: json.data,
              warnings: json.warnings ?? {},
              status: "success",
            },
            false,
            "playgroundShelf/fetch/success"
          )
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load playground"
          set({ status: "error", errorMessage: message }, false, "playgroundShelf/fetch/error")
        }
      },
    }),
    { name: "PlaygroundShelfStore" }
  )
)
