import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import {
  fetchMe,
  loginUser,
  logoutUser,
  refreshTokens,
  signupUser,
  type AuthUser,
  type LoginPayload,
  type SignupPayload,
} from "@/lib/api"

// Re-export so consumers don't need to import from two places
export type { AuthUser }

type AuthStatus = "idle" | "loading" | "error"

interface AuthState {
  // Session — persisted to localStorage so UI stays consistent across refreshes.
  // The actual session validity is always determined by the HTTP-only cookies;
  // this is purely display state.
  user: AuthUser | null

  // Ephemeral
  status: AuthStatus
  errorMessage: string | null

  // Modal
  isAuthModalOpen: boolean
  authModalTab: "login" | "signup"

  // Actions
  openAuthModal: (tab?: "login" | "signup") => void
  closeAuthModal: () => void
  setAuthModalTab: (tab: "login" | "signup") => void
  clearError: () => void

  signup: (payload: SignupPayload) => Promise<boolean>
  login: (payload: LoginPayload) => Promise<boolean>
  logout: () => Promise<void>

  /** Call on app mount — validates the stored session via /auth/me.
   *  Silently attempts a token refresh on 401 before giving up. */
  rehydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        status: "idle",
        errorMessage: null,

        isAuthModalOpen: false,
        authModalTab: "login",

        openAuthModal: (tab = "login") =>
          set(
            { isAuthModalOpen: true, authModalTab: tab, errorMessage: null },
            false,
            "auth/openModal"
          ),

        closeAuthModal: () =>
          set({ isAuthModalOpen: false, errorMessage: null }, false, "auth/closeModal"),

        setAuthModalTab: (tab) =>
          set({ authModalTab: tab, errorMessage: null }, false, "auth/setTab"),

        clearError: () => set({ errorMessage: null }, false, "auth/clearError"),

        // ── Signup ────────────────────────────────────────────────────────────
        signup: async (payload) => {
          set({ status: "loading", errorMessage: null }, false, "auth/signup/start")
          try {
            await signupUser(payload)
            // Cookies are set — redirect to login tab so user explicitly signs in
            set({ status: "idle", authModalTab: "login" }, false, "auth/signup/success")
            return true
          } catch (err) {
            const message = err instanceof Error ? err.message : "Signup failed"
            set({ status: "error", errorMessage: message }, false, "auth/signup/error")
            return false
          }
        },

        // ── Login ─────────────────────────────────────────────────────────────
        login: async (payload) => {
          set({ status: "loading", errorMessage: null }, false, "auth/login/start")
          try {
            const user = await loginUser(payload)
            set({ status: "idle", user, isAuthModalOpen: false }, false, "auth/login/success")
            return true
          } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed"
            set({ status: "error", errorMessage: message }, false, "auth/login/error")
            return false
          }
        },

        // ── Logout ────────────────────────────────────────────────────────────
        logout: async () => {
          set({ status: "loading" }, false, "auth/logout/start")
          try {
            await logoutUser()
          } catch {
            // Swallow — clear client state regardless
          } finally {
            set({ user: null, status: "idle", errorMessage: null }, false, "auth/logout/done")
          }
        },

        // ── Rehydrate ─────────────────────────────────────────────────────────
        rehydrate: async () => {
          try {
            const user = await fetchMe()
            set({ user }, false, "auth/rehydrate/ok")
          } catch {
            // Access token may be expired — try a silent refresh first
            try {
              await refreshTokens()
              const user = await fetchMe()
              set({ user }, false, "auth/rehydrate/refreshed")
            } catch {
              // Refresh token also invalid — session is gone
              set({ user: null }, false, "auth/rehydrate/expired")
            }
          }
        },
      }),
      {
        name: "portfolio-auth",
        // Only persist the display user — actual auth lives in HTTP-only cookies
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: "AuthStore" }
  )
)
