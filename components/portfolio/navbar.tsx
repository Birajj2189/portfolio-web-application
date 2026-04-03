"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Command, Menu, X, LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth.store"
import { LogoutConfirm } from "@/components/portfolio/logout-confirm"

interface NavbarProps {
  onOpenCommandPalette: () => void
}

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Journey", href: "#journey" },
  { name: "Playground", href: "/playground" },
  { name: "Gallery", href: "/gallery" },
  { name: "Resume", href: "#resume" },
  { name: "Contact", href: "#contact" },
]

export function Navbar({ onOpenCommandPalette }: Readonly<NavbarProps>) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { user, openAuthModal, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogoutConfirmed = () => {
    setShowLogoutConfirm(false)
    setIsMobileMenuOpen(false)
    logout()
  }

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass py-3" : "py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm text-primary-foreground">
              {"</>"}
            </span>
            <span className="hidden sm:inline">DevSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Command palette */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCommandPalette}
              className="hidden items-center gap-2 border-border text-muted-foreground hover:border-primary hover:text-primary sm:flex"
            >
              <Command className="h-4 w-4" />
              <span className="text-xs">Ctrl+K</span>
            </Button>

            {/* Auth — desktop */}
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="max-w-[140px] truncate font-medium text-foreground">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAuthModal("login")}
                className="hidden items-center gap-2 border-primary/50 text-primary hover:bg-primary/10 md:flex"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="glass animate-slide-up mx-4 mt-2 rounded-xl p-4 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block border-b border-border py-3 text-muted-foreground transition-colors last:border-0 hover:text-foreground"
              >
                {link.name}
              </a>
            ))}

            {/* Auth — mobile */}
            <div className="mt-3 pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2 text-sm">
                    <User className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate font-medium text-foreground">{user.email}</span>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openAuthModal("login")
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex-1 border-border text-muted-foreground"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      openAuthModal("signup")
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <LogoutConfirm
        isOpen={showLogoutConfirm}
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}
