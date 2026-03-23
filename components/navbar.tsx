"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Wallet,
  Search,
  Trophy,
  Gavel,
  BookOpen,
  User,
  HelpCircle,
  Swords,
  ChevronDown,
  Settings,
  FileText,
} from "lucide-react"

const navLinks = [
  {
    label: "Marketplace",
    href: "#",
    icon: Swords,
    children: [
      { label: "Collections", href: "/collections", icon: BookOpen },
      { label: "Auctions", href: "/auction", icon: Gavel },
    ],
  },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Wiki", href: "/wiki", icon: FileText },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-primary/20" />
            <span className="relative text-xl font-bold text-primary">W3F</span>
          </div>
          <span className="hidden text-lg font-bold tracking-wider text-foreground sm:block">
            Web3Fighter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            if (link.children) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-primary">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    <ChevronDown className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-44 overflow-hidden rounded-xl border border-border/50 bg-popover shadow-xl shadow-background/50 backdrop-blur-xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-secondary/50 hover:text-primary ${
                            isActive(child.href) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <child.icon className="h-4 w-4" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 p-4">
            <Link
              href="/collections"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${isActive("/collections") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Collections
            </Link>
            <Link
              href="/auction"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${isActive("/auction") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              <Gavel className="h-4 w-4" />
              Auctions
            </Link>
            <Link
              href="/leaderboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${isActive("/leaderboard") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
            <Link
              href="/wiki"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${isActive("/wiki") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-4 w-4" />
              Wiki
            </Link>
            <Link
              href="/faq"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${isActive("/faq") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              FAQ
            </Link>
            <Link
              href="/profile"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${isActive("/profile") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-primary ${isActive("/settings") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Button className="mt-2 gap-2 bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
