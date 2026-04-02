import axios from "axios"

// ─────────────────────────────────────────────────────────────────────────────
// General API client  (contact form, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? "An unexpected error occurred"
    return Promise.reject(new Error(message))
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// Auth API client
// - Base URL is configurable via NEXT_PUBLIC_AUTH_API_BASE_URL
//   (defaults to NEXT_PUBLIC_API_BASE_URL)
// - withCredentials: true so the browser sends / stores HTTP-only cookies
//   (access_token, refresh_token) automatically on every request
// ─────────────────────────────────────────────────────────────────────────────
export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
  withCredentials: true, // required for HTTP-only cookie flow
})

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? "An unexpected error occurred"
    return Promise.reject(new Error(message))
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export async function submitContactForm(payload: ContactPayload): Promise<void> {
  await apiClient.post(process.env.NEXT_PUBLIC_CONTACT_PATH ?? "/contact", payload)
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth — types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  role: string
  isAdmin: boolean
  isActive: boolean
  lastSeenAt?: string
  createdAt: string
  updatedAt: string
}

interface AuthApiResponse<T = undefined> {
  success: boolean
  message: string
  data?: T
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth — endpoints
// All paths are configurable via env vars; sane defaults match the API spec.
// Tokens are stored as HTTP-only cookies — never touched by JS.
// ─────────────────────────────────────────────────────────────────────────────

export interface SignupPayload {
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

/** POST /auth/signup — creates account, sets access_token + refresh_token cookies */
export async function signupUser(payload: SignupPayload): Promise<AuthUser> {
  const res = await authClient.post<AuthApiResponse<{ user: AuthUser }>>(
    process.env.NEXT_PUBLIC_AUTH_SIGNUP_PATH ?? "/signup",
    payload
  )
  return res.data.data!.user
}

/** POST /auth/login — authenticates user, sets access_token + refresh_token cookies */
export async function loginUser(payload: LoginPayload): Promise<AuthUser> {
  const res = await authClient.post<AuthApiResponse<{ user: AuthUser }>>(
    process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH ?? "/login",
    payload
  )
  return res.data.data!.user
}

/** POST /auth/logout — revokes refresh token, clears cookies */
export async function logoutUser(): Promise<void> {
  await authClient.post(process.env.NEXT_PUBLIC_AUTH_LOGOUT_PATH ?? "/logout")
}

/** POST /auth/refresh — rotates both tokens silently using refresh_token cookie */
export async function refreshTokens(): Promise<void> {
  await authClient.post(process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH ?? "/refresh")
}

/** GET /auth/me — returns current user from access_token cookie */
export async function fetchMe(): Promise<AuthUser> {
  const res = await authClient.get<AuthApiResponse<{ user: AuthUser }>>(
    process.env.NEXT_PUBLIC_AUTH_ME_PATH ?? "/me"
  )
  return res.data.data!.user
}
