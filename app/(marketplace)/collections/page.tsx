"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Zap,
  TrendingUp,
  Users,
  Flame,
  Snowflake,
  Wind,
  Shield,
  Sparkles,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
} from "lucide-react"

const collections = [
  {
    id: 1,
    name: "Genesis Fighters",
    creator: "Web3Fighter Team",
    items: 50,
    owners: 38,
    floorPrice: 12.5,
    volume: 1240.8,
    change: 24.3,
    description: "The original 50 genesis fighters. The rarest collection in Web3Fighter.",
    type: "characters",
  },
  {
    id: 2,
    name: "Ultimate Moves Vol.1",
    creator: "Web3Fighter Team",
    items: 24,
    owners: 189,
    floorPrice: 4.2,
    volume: 892.3,
    change: 12.8,
    description: "The first volume of ultimate combat moves. Devastating abilities for serious fighters.",
    type: "moves",
  },
  {
    id: 3,
    name: "Elemental Warriors",
    creator: "ElementalDAO",
    items: 120,
    owners: 94,
    floorPrice: 8.8,
    volume: 674.5,
    change: -3.2,
    description: "Warriors infused with the raw power of fire, ice, lightning, and wind.",
    type: "characters",
  },
  {
    id: 4,
    name: "Shadow Clan",
    creator: "ShadowGuild",
    items: 75,
    owners: 61,
    floorPrice: 6.4,
    volume: 524.1,
    change: 8.7,
    description: "Dark-element fighters from the shadow realm. Masters of deception and speed.",
    type: "characters",
  },
  {
    id: 5,
    name: "Combo Masters",
    creator: "Web3Fighter Team",
    items: 48,
    owners: 312,
    floorPrice: 2.8,
    volume: 441.6,
    change: 31.4,
    description: "Multi-hit combo moves that chain together for devastating damage sequences.",
    type: "moves",
  },
  {
    id: 6,
    name: "Cyber Brawlers",
    creator: "CyberPunkDAO",
    items: 200,
    owners: 156,
    floorPrice: 3.1,
    volume: 388.2,
    change: -1.5,
    description: "Tech-enhanced fighters augmented with cybernetic implants and energy weapons.",
    type: "characters",
  },
  {
    id: 7,
    name: "Defense Legends",
    creator: "IronWall Guild",
    items: 36,
    owners: 278,
    floorPrice: 3.9,
    volume: 302.4,
    change: 5.9,
    description: "Impenetrable defensive moves. Turn battles in your favor with superior blocking.",
    type: "moves",
  },
  {
    id: 8,
    name: "Mythic Beasts",
    creator: "MythicDAO",
    items: 30,
    owners: 27,
    floorPrice: 22.0,
    volume: 284.9,
    change: 18.1,
    description: "Rare beast-form fighters channeling ancient power. Among the most powerful in the game.",
    type: "characters",
  },
]

const nfts = [
  { id: 1, name: "Shadow Striker", collection: "Genesis Fighters", price: 45.5, element: "dark", tier: "Legendary" },
  { id: 2, name: "Dragon Fury", collection: "Ultimate Moves Vol.1", price: 8.5, element: "fire", tier: "Legendary" },
  { id: 3, name: "Frost Queen", collection: "Genesis Fighters", price: 52.0, element: "ice", tier: "Legendary" },
  { id: 4, name: "Blaze Warrior", collection: "Elemental Warriors", price: 31.8, element: "fire", tier: "Epic" },
  { id: 5, name: "Lightning Strike", collection: "Ultimate Moves Vol.1", price: 6.8, element: "lightning", tier: "Epic" },
  { id: 6, name: "Wind Dancer", collection: "Elemental Warriors", price: 12.5, element: "wind", tier: "Rare" },
  { id: 7, name: "Void Walker", collection: "Shadow Clan", price: 18.9, element: "dark", tier: "Epic" },
  { id: 8, name: "Earth Shatter", collection: "Ultimate Moves Vol.1", price: 12.0, element: "earth", tier: "Legendary" },
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

const collectionElementMap: Record<string, string> = {
  "Genesis Fighters": "dark",
  "Ultimate Moves Vol.1": "fire",
  "Elemental Warriors": "lightning",
  "Shadow Clan": "dark",
  "Combo Masters": "wind",
  "Cyber Brawlers": "lightning",
  "Defense Legends": "earth",
  "Mythic Beasts": "fire",
}

export default function CollectionsPage() {
  const [view, setView] = useState("collections")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  const filteredCollections = collections.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || c.type === typeFilter
    return matchSearch && matchType
  })

  const filteredNfts = nfts.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-border/50 bg-background py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Collections
              </h1>
              <p className="mb-8 max-w-xl text-muted-foreground">
                Explore all NFT collections in the Web3Fighter universe. From genesis fighters to rare combat moves.
              </p>

              {/* Search */}
              <div className="relative w-full max-w-lg">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search collections or NFTs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-border/50 bg-secondary/50 pl-11 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs defaultValue="collections" onValueChange={setView}>
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="nfts">All NFTs</TabsTrigger>
              </TabsList>
            </Tabs>

            {view === "collections" && (
              <div className="flex items-center gap-3">
                <Tabs defaultValue="all" onValueChange={setTypeFilter}>
                  <TabsList className="bg-secondary/50">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="characters">Fighters</TabsTrigger>
                    <TabsTrigger value="moves">Moves</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm" className="gap-2 border-border/50 text-muted-foreground">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            )}
          </div>

          {view === "collections" && (
            <>
              {/* Featured Top Row */}
              <div className="mb-6 grid gap-6 lg:grid-cols-2">
                {filteredCollections.slice(0, 2).map((col) => (
                  <Card
                    key={col.id}
                    className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="relative flex h-40 items-center justify-center border-b border-border/50 bg-gradient-to-br from-secondary via-background to-secondary">
                      {/* Preview icons */}
                      <div className="flex gap-3">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/50 bg-secondary/80"
                            style={{ opacity: 1 - i * 0.2 }}
                          >
                            {elementIcons[collectionElementMap[col.name]]}
                          </div>
                        ))}
                      </div>
                      <Badge
                        variant="outline"
                        className="absolute right-3 top-3 border-border/50 bg-background/60 text-xs text-foreground backdrop-blur-sm"
                      >
                        {col.type === "characters" ? "Fighters" : "Moves"}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{col.name}</h3>
                          <p className="text-xs text-muted-foreground">by {col.creator}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${col.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          <TrendingUp className="h-3 w-3" />
                          {col.change >= 0 ? "+" : ""}{col.change}%
                        </div>
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">{col.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Items</div>
                          <div className="font-bold text-foreground">{col.items}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Owners</div>
                          <div className="font-bold text-foreground">{col.owners}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Floor</div>
                          <div className="flex items-center gap-0.5 font-bold text-foreground">
                            <Zap className="h-3 w-3 text-primary" />
                            {col.floorPrice} SOL
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Volume</div>
                          <div className="flex items-center gap-0.5 font-bold text-foreground">
                            <Zap className="h-3 w-3 text-primary" />
                            {col.volume.toFixed(0)} SOL
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rest of collections */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCollections.slice(2).map((col) => (
                  <Card
                    key={col.id}
                    className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="relative flex h-28 items-center justify-center border-b border-border/50 bg-gradient-to-br from-secondary via-background to-secondary">
                      <div className="flex gap-2">
                        {[0, 1].map((i) => (
                          <div
                            key={i}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/80"
                            style={{ opacity: 1 - i * 0.3 }}
                          >
                            {elementIcons[collectionElementMap[col.name]]}
                          </div>
                        ))}
                      </div>
                      <Badge
                        variant="outline"
                        className="absolute right-2 top-2 border-border/50 bg-background/60 text-xs text-foreground backdrop-blur-sm"
                      >
                        {col.type === "characters" ? "Fighters" : "Moves"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-1 flex items-start justify-between">
                        <h3 className="font-bold text-foreground">{col.name}</h3>
                        <div className={`flex items-center gap-0.5 text-xs font-medium ${col.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          <TrendingUp className="h-3 w-3" />
                          {col.change >= 0 ? "+" : ""}{col.change}%
                        </div>
                      </div>
                      <p className="mb-3 text-xs text-muted-foreground">by {col.creator}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <div className="text-muted-foreground">Items</div>
                          <div className="font-bold text-foreground">{col.items}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Floor</div>
                          <div className="flex items-center gap-0.5 font-bold text-foreground">
                            <Zap className="h-3 w-3 text-primary" />
                            {col.floorPrice}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Volume</div>
                          <div className="flex items-center gap-0.5 font-bold text-foreground">
                            <Zap className="h-3 w-3 text-primary" />
                            {col.volume.toFixed(0)}
                          </div>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{col.owners}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {view === "nfts" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredNfts.map((nft) => (
                <Card
                  key={nft.id}
                  className="group overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative flex aspect-square items-center justify-center border-b border-border/50 bg-gradient-to-br from-secondary via-background to-secondary">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
                      {elementIcons[nft.element]}
                      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
                    </div>
                    <Badge className={`absolute left-2 top-2 border text-xs ${tierColors[nft.tier]}`}>
                      {nft.tier}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                      onClick={() => setLiked((p) => ({ ...p, [nft.id]: !p[nft.id] }))}
                    >
                      <Heart className={`h-4 w-4 ${liked[nft.id] ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <div className="mb-0.5 font-bold text-foreground">{nft.name}</div>
                    <div className="mb-3 text-xs text-muted-foreground">{nft.collection}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-bold text-foreground">
                        <Zap className="h-3 w-3 text-primary" />
                        <span>{nft.price} SOL</span>
                      </div>
                      <Button size="sm" className="h-7 gap-1 bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/90">
                        <ShoppingCart className="h-3 w-3" />
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
