import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface UIState {
  isCommandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isCommandPaletteOpen: false,
      openCommandPalette: () => set({ isCommandPaletteOpen: true }, false, "ui/openCommandPalette"),
      closeCommandPalette: () =>
        set({ isCommandPaletteOpen: false }, false, "ui/closeCommandPalette"),
    }),
    { name: "UIStore" }
  )
)
