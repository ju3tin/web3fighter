import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-primary/20" />
                <span className="relative text-xl font-bold text-primary">W3F</span>
              </div>
              <span className="text-lg font-bold tracking-wider text-foreground">
                Web3Fighter
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The ultimate NFT marketplace for Web3Fighter. Trade legendary
              fighters and devastating combat moves on Solana.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/collections" className="transition-colors hover:text-primary">
                  All NFTs
                </Link>
              </li>
              <li>
                <Link href="/#characters" className="transition-colors hover:text-primary">
                  Characters
                </Link>
              </li>
              <li>
                <Link href="/#moves" className="transition-colors hover:text-primary">
                  Combat Moves
                </Link>
              </li>
              <li>
                <Link href="/auction" className="transition-colors hover:text-primary">
                  Auctions
                </Link>
              </li>
              <li>
                <Link href="/collections" className="transition-colors hover:text-primary">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/leaderboard" className="transition-colors hover:text-primary">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="transition-colors hover:text-primary">
                  Wiki
                </Link>
              </li>
              <li>
                <Link href="/profile" className="transition-colors hover:text-primary">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" className="transition-colors hover:text-primary">
                  Settings
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">Stay Updated</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to get the latest drops and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Web3Fighter. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Cookies
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <span className="font-bold text-primary">Solana</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
