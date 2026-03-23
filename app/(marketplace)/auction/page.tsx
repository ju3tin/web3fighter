"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Timer,
  Zap,
  Users,
  Flame,
  Snowflake,
  Wind,
  Shield,
  Sparkles,
  TrendingUp,
  Gavel,
  Clock,
  Filter,
} from "lucide-react"

interface Auction {
  id: number
  name: string
  type: "character" | "move"
  tier: string
  element: string
  currentBid: number
  minIncrement: number
  bidders: number
  endTime: { h: number; m: number; s: number }
  description: string
  seller: string
}

const auctions: Auction[] = [
  {
    id: 1,
    name: "Omega Destroyer",
    type: "character",
    tier: "Legendary",
    element: "dark",
    currentBid: 125.5,
    minIncrement: 2.5,
    bidders: 47,
    endTime: { h: 2, m: 45, s: 30 },
    description: "The rarest fighter in Web3Fighter. Only 1 in existence. Unmatched power.",
    seller: "0x7a2...f4d",
  },
  {
    id: 2,
    name: "Dragon Fury",
    type: "move",
    tier: "Legendary",
    element: "fire",
    currentBid: 18.8,
    minIncrement: 0.5,
    bidders: 23,
    endTime: { h: 5, m: 12, s: 8 },
    description: "Unleash a devastating dragon breath attack dealing 450 damage.",
    seller: "0x3b1...e8c",
  },
  {
    id: 3,
    name: "Frost Queen",
    type: "character",
    tier: "Legendary",
    element: "ice",
    currentBid: 52.0,
    minIncrement: 1.0,
    bidders: 31,
    endTime: { h: 8, m: 0, s: 0 },
    description: "Ice-element fighter with unmatched defense. Limited to 25 editions.",
    seller: "0x9c4...a2b",
  },
  {
    id: 4,
    name: "Earth Shatter",
    type: "move",
    tier: "Legendary",
    element: "earth",
    currentBid: 14.2,
    minIncrement: 0.5,
    bidders: 18,
    endTime: { h: 1, m: 20, s: 45 },
    description: "Shatter the ground beneath your foes for 520 damage.",
    seller: "0x1f8...d3e",
  },
  {
    id: 5,
    name: "Thunder Fist",
    type: "character",
    tier: "Epic",
    element: "lightning",
    currentBid: 29.5,
    minIncrement: 0.5,
    bidders: 14,
    endTime: { h: 12, m: 30, s: 0 },
    description: "Lightning-powered brawler with devastating combo potential.",
    seller: "0x5e2...c7f",
  },
  {
    id: 6,
    name: "Void Blade",
    type: "move",
    tier: "Epic",
    element: "dark",
    currentBid: 9.4,
    minIncrement: 0.2,
    bidders: 9,
    endTime: { h: 3, m: 55, s: 20 },
    description: "A dark energy blade that bypasses armor entirely.",
    seller: "0x8d6...b1a",
  },
]

const tierColors: Record<string, string> = {
  Legendary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Epic: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  Rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

const elementIcons: Record<string, React.ReactNode> = {
  dark: <Sparkles className="h-5 w-5 text-purple-400" />,
  lightning: <Zap className="h-5 w-5 text-yellow-400" />,
  ice: <Snowflake className="h-5 w-5 text-cyan-400" />,
  fire: <Flame className="h-5 w-5 text-orange-400" />,
  wind: <Wind className="h-5 w-5 text-emerald-400" />,
  earth: <Shield className="h-5 w-5 text-amber-600" />,
}

function useCountdown(initial: { h: number; m: number; s: number }) {
  const [time, setTime] = useState(initial)
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 0; m = 0; s = 0 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return time
}

function AuctionCard({ auction }: { auction: Auction }) {
  const time = useCountdown(auction.endTime)
  const [bidAmount, setBidAmount] = useState(
    (auction.currentBid + auction.minIncrement).toFixed(1)
  )
  const [hasBid, setHasBid] = useState(false)
  const isUrgent = time.h === 0 && time.m < 30

  return (
    <Card className="group flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      {/* NFT Visual */}
      <div className={`relative flex aspect-square items-center justify-center border-b border-border/50 bg-gradient-to-br from-secondary via-background to-secondary`}>
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
          {elementIcons[auction.element]}
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
        </div>

        {/* Badges */}
        <Badge className={`absolute left-3 top-3 border text-xs ${tierColors[auction.tier]}`}>
          {auction.tier}
        </Badge>
        <Badge
          variant="outline"
          className="absolute right-3 top-3 border-border/50 bg-background/60 text-xs text-foreground backdrop-blur-sm"
        >
          {auction.type === "character" ? "Fighter" : "Move"}
        </Badge>

        {/* Urgency pulse */}
        {isUrgent && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
              </span>
              Ending Soon
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        {/* Name & Seller */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground">{auction.name}</h3>
          <p className="text-xs text-muted-foreground">by {auction.seller}</p>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">{auction.description}</p>

        {/* Countdown */}
        <div className="mb-4 flex items-center gap-3">
          <Clock className={`h-4 w-4 shrink-0 ${isUrgent ? "text-red-400" : "text-muted-foreground"}`} />
          <div className="flex items-center gap-1 font-mono tabular-nums">
            <span className={`rounded bg-secondary px-2 py-0.5 text-sm font-bold ${isUrgent ? "text-red-400" : "text-foreground"}`}>
              {String(time.h).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground">:</span>
            <span className={`rounded bg-secondary px-2 py-0.5 text-sm font-bold ${isUrgent ? "text-red-400" : "text-foreground"}`}>
              {String(time.m).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground">:</span>
            <span className={`rounded bg-secondary px-2 py-0.5 text-sm font-bold ${isUrgent ? "text-red-400" : "text-foreground"}`}>
              {String(time.s).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Current Bid */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-secondary/50 p-3">
          <div>
            <div className="text-xs text-muted-foreground">Current Bid</div>
            <div className="flex items-center gap-1 text-xl font-bold text-foreground">
              <Zap className="h-4 w-4 text-primary" />
              {auction.currentBid} SOL
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Bidders</div>
            <div className="flex items-center justify-end gap-1 font-bold text-foreground">
              <Users className="h-4 w-4 text-accent" />
              {auction.bidders}
            </div>
          </div>
        </div>

        {/* Bid Input */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Zap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="border-border/50 bg-input pl-9 text-foreground"
                step={auction.minIncrement}
                min={auction.currentBid + auction.minIncrement}
              />
            </div>
            <Button
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setHasBid(true)}
            >
              <Gavel className="h-4 w-4" />
              {hasBid ? "Raise Bid" : "Place Bid"}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Min increment: {auction.minIncrement} SOL
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuctionPage() {
  const [filter, setFilter] = useState("all")

  const filtered =
    filter === "all" ? auctions : auctions.filter((a) => a.type === filter)

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-border/50 bg-background py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {auctions.length} Live Auctions
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Live Auctions
              </h1>
              <p className="max-w-xl text-muted-foreground">
                Bid on the rarest fighters and moves before time runs out. Every auction is settled on-chain.
              </p>
            </div>

            {/* Stats bar */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">24h Volume:</span>
                <span className="font-bold text-foreground">1,248 SOL</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Active Bidders:</span>
                <span className="font-bold text-foreground">342</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Gavel className="h-4 w-4 text-gold" />
                <span className="text-muted-foreground">Total Bids Today:</span>
                <span className="font-bold text-foreground">2,891</span>
              </div>
            </div>
          </div>
        </section>

        {/* Auctions Grid */}
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs defaultValue="all" onValueChange={setFilter}>
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="all">All ({auctions.length})</TabsTrigger>
                <TabsTrigger value="character">
                  Fighters ({auctions.filter((a) => a.type === "character").length})
                </TabsTrigger>
                <TabsTrigger value="move">
                  Moves ({auctions.filter((a) => a.type === "move").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" className="gap-2 border-border/50 text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" />
              Sort by: Ending Soon
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
