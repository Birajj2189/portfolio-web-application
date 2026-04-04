import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { fetchPortfolio } from "@/lib/portfolio"
import type { PortfolioData } from "@/types/portfolio"

type FetchStatus = "idle" | "loading" | "success" | "error"

interface PortfolioState {
  data: PortfolioData | null
  status: FetchStatus
  errorMessage: string | null
  /** Use `{ force: true }` after a timeout or stuck request so a new fetch can start. */
  fetch: (opts?: { force?: boolean }) => Promise<void>
}

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    (set, get) => ({
      data: null,
      status: "idle",
      errorMessage: null,

      fetch: async (opts) => {
        if (get().status === "loading" && !opts?.force) return
        set({ status: "loading", errorMessage: null }, false, "portfolio/fetch/start")
        try {
          const data = await fetchPortfolio()
          set({ data, status: "success" }, false, "portfolio/fetch/success")
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load portfolio"
          set({ status: "error", errorMessage: message }, false, "portfolio/fetch/error")
        }
      },
    }),
    { name: "PortfolioStore" }
  )
)
