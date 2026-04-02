"use client"

import { useEffect, useRef, useState } from "react"
import { X, Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth.store"

// ─── tiny inline field wrapper ───────────────────────────────────────────────
function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  autoFocus,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
  autoFocus?: boolean
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={isPassword ? "current-password" : id === "email" ? "email" : "username"}
          className={`w-full rounded-xl border bg-secondary px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none ${
            error
              ? "border-destructive focus:border-destructive"
              : "border-border focus:border-primary"
          } ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ─── Login form ──────────────────────────────────────────────────────────────
function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const { login, status, errorMessage, clearError } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errors: typeof fieldErrors = {}
    if (!email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email"
    if (!password) errors.password = "Password is required"
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    await login({ email: email.trim(), password })
  }

  const loading = status === "loading"

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <Field
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        error={fieldErrors.email}
        autoFocus
      />
      <Field
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        error={fieldErrors.password}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary py-6 text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}

// ─── Signup form ─────────────────────────────────────────────────────────────
function SignupForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { signup, status, errorMessage, clearError } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
    confirm?: string
  }>({})
  const [signedUp, setSignedUp] = useState(false)

  const validate = () => {
    const errors: typeof fieldErrors = {}
    if (!email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email"
    if (!password) errors.password = "Password is required"
    else if (password.length < 8) errors.password = "At least 8 characters"
    if (!confirm) errors.confirm = "Please confirm your password"
    else if (confirm !== password) errors.confirm = "Passwords do not match"
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    const ok = await signup({ email: email.trim(), password })
    if (ok) setSignedUp(true)
  }

  const loading = status === "loading"

  if (signedUp) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle className="h-14 w-14 text-primary" />
        <h3 className="text-xl font-semibold">Account created!</h3>
        <p className="text-sm text-muted-foreground">Your account is ready. Sign in to continue.</p>
        <Button
          onClick={onSwitchToLogin}
          className="w-full bg-primary py-6 text-primary-foreground hover:bg-primary/90"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Go to Sign In
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <Field
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        error={fieldErrors.email}
        autoFocus
      />
      <Field
        id="signup-password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Min. 8 characters"
        error={fieldErrors.password}
      />
      <Field
        id="confirm"
        label="Confirm Password"
        type="password"
        value={confirm}
        onChange={setConfirm}
        placeholder="••••••••"
        error={fieldErrors.confirm}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary py-6 text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <UserPlus className="mr-2 h-5 w-5" />
            Create Account
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}

// ─── Modal shell ─────────────────────────────────────────────────────────────
export function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, setAuthModalTab, clearError } =
    useAuthStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isAuthModalOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isAuthModalOpen, closeAuthModal])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isAuthModalOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isAuthModalOpen])

  if (!isAuthModalOpen) return null

  const switchToLogin = () => {
    clearError()
    setAuthModalTab("login")
  }
  const switchToSignup = () => {
    clearError()
    setAuthModalTab("signup")
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) closeAuthModal()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Card */}
      <div className="glass-card animate-slide-up relative w-full max-w-md rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {authModalTab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {authModalTab === "login"
                ? "Sign in to personalise your experience"
                : "Join to leave your mark"}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-secondary p-1">
          {(["login", "signup"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                clearError()
                setAuthModalTab(tab)
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                authModalTab === tab
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        {authModalTab === "login" ? (
          <LoginForm onSwitchToSignup={switchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  )
}
