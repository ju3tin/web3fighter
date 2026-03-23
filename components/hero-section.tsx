"use client"

import { Button } from "@/components/ui/button"
import { Zap, Users, Swords } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-2xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center lg:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live on Solana Mainnet
        </div>

        {/* Main Title */}
        <h1 className="mb-6 max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          <span className="block">Trade Legendary</span>
          <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Fighters & Moves
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          The ultimate NFT marketplace for Web3Fighter. Collect rare characters, unlock devastating
          combat moves, and dominate the arena.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            <Swords className="h-5 w-5" />
            Explore Marketplace
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-border bg-secondary/50 text-foreground hover:bg-secondary"
          >
            <Users className="h-5 w-5" />
            View Collection
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <StatCard value="12.5K" label="Total Items" />
          <StatCard value="4.2K" label="Owners" />
          <StatCard value="89K" label="SOL Volume" />
          <StatCard value="0.85" label="Floor Price" icon="SOL" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary/30 p-2">
          <div className="h-2 w-1 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </section>
  )
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string
  label: string
  icon?: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground sm:text-3xl">
        {icon && <Zap className="h-5 w-5 text-primary" />}
        {value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
