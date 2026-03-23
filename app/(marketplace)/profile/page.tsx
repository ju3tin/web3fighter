"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  Trophy,
  Flame,
  Snowflake,
  Wind,
  Shield,
  Sparkles,
  Copy,
  Settings,
  TrendingUp,
  ShoppingCart,
  Heart,
  BarChart2,
  Swords,
  Star,
} from "lucide-react"

const userNFTs = [
  { id: 1, name: "Shadow Striker", type: "character", element: "dark", tier: "Legendary", price: 45.5, wins: 342 },
  { id: 2, name: "Dragon Fury", type: "move", element: "fire", tier: "Legendary", price: 8.5, wins: 0 },
  { id: 3, name: "Wind Dancer", type: "character", element: "wind", tier: "Rare", price: 12.5, wins: 187 },
  { id: 4, name: "Frost Shield", type: "move", element: "ice", tier: "Epic", price: 4.2, wins: 0 },
  { id: 5, name: "Blaze Warrior", type: "character", element: "fire", tier: "Epic", price: 31.8, wins: 234 },
  { id: 6, name: "Shadow Step", type: "move", element: "dark", tier: "Rare", price: 2.5, wins: 0 },
]

const activityFeed = [
  { type: "sale", item: "Thunder Fist", price: 28.3, to: "0x3b1...e8c", time: "2 days ago" },
  { type: "purchase", item: "Dragon Fury", price: 8.5, from: "0x9c4...a2b", time: "5 days ago" },
  { type: "bid", item: "Omega Destroyer", price: 118.0, time: "1 week ago" },
  { type: "purchase", item: "Wind Dancer", price: 10.2, from: "0x1f8...d3e", time: "2 weeks ago" },
  { type: "sale", item: "Iron Guardian", price: 35.2, to: "0x5e2...c7f", time: "3 weeks ago" },
  { type: "purchase", item: "Shadow Striker", price: 38.0, from: "0x8d6...b1a", time: "1 month ago" },
]

const achievements = [
  { id: 1, name: "First Blood", description: "Win your first battle", earned: true, icon: Swords },
  { id: 2, name: "Collector", description: "Own 5 or more NFTs", earned: true, icon: Star },
  { id: 3, name: "High Roller", description: "Spend over 100 SOL total", earned: true, icon: Zap },
  { id: 4, name: "Champion", description: "Reach top 10 leaderboard", earned: false, icon: Trophy },
  { id: 5, name: "Legend", description: "Own a Legendary fighter", earned: true, icon: Sparkles },
  { id: 6, name: "Trader", description: "Complete 10 marketplace sales", earned: false, icon: TrendingUp },
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

const activityColors: Record<string, string> = {
  sale: "text-emerald-400",
  purchase: "text-primary",
  bid: "text-accent",
}

const activityLabels: Record<string, string> = {
  sale: "Sold",
  purchase: "Bought",
  bid: "Bid on",
}

export default function ProfilePage() {
  const [tab, setTab] = useState("collection")
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  const address = "0x7a2b4f8d3e1c9a5b6f2d4e8c1a3b7f9e"
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-16">
        {/* Profile Banner */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-r from-primary/20 via-secondary to-accent/20">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(0,255,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.04) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 bg-background/30 text-foreground backdrop-blur-sm hover:bg-background/50"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative -mt-14 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary/30 to-accent/30 shadow-xl">
                <Sparkles className="h-12 w-12 text-primary" />
                <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-background bg-emerald-500 p-1.5">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              </div>

              <div className="pb-2">
                <h1 className="text-2xl font-bold text-foreground">CryptoKing_Sol</h1>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{shortAddress}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {copied && <span className="text-xs text-primary">Copied!</span>}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs">
                    <Trophy className="mr-1 h-3 w-3" />
                    Rank #1
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                    Season 3 Champion
                  </Badge>
                </div>
              </div>
            </div>

            <Button className="self-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:self-auto">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Stats Row */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <StatCard label="NFTs Owned" value="6" icon={<Star className="h-4 w-4 text-primary" />} />
            <StatCard label="Total Value" value="104.5 SOL" icon={<Zap className="h-4 w-4 text-primary" />} />
            <StatCard label="Total Wins" value="763" icon={<Swords className="h-4 w-4 text-accent" />} />
            <StatCard label="Win Rate" value="87.4%" icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} />
            <StatCard label="Volume Traded" value="342 SOL" icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />} />
            <StatCard label="Achievements" value="4 / 6" icon={<Trophy className="h-4 w-4 text-yellow-400" />} />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="collection" onValueChange={setTab} className="mb-8">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="collection">Collection ({userNFTs.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Collection Tab */}
          {tab === "collection" && (
            <div className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
              {userNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="group overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative flex aspect-video items-center justify-center border-b border-border/50 bg-gradient-to-br from-secondary via-background to-secondary">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
                      {elementIcons[nft.element]}
                      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
                    </div>
                    <Badge className={`absolute left-3 top-3 border text-xs ${tierColors[nft.tier]}`}>
                      {nft.tier}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="absolute right-3 top-3 border-border/50 bg-background/60 text-xs text-foreground backdrop-blur-sm"
                    >
                      {nft.type === "character" ? "Fighter" : "Move"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-3 right-3 h-7 w-7 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                      onClick={() => setLiked((p) => ({ ...p, [nft.id]: !p[nft.id] }))}
                    >
                      <Heart
                        className={`h-4 w-4 ${liked[nft.id] ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-bold text-foreground">{nft.name}</h3>
                      {nft.type === "character" && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Swords className="h-3 w-3 text-accent" />
                          {nft.wins}W
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                        <Zap className="h-3 w-3 text-primary" />
                        {nft.price} SOL
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 border-primary/50 px-2 text-xs text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Activity Tab */}
          {tab === "activity" && (
            <div className="pb-12">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-0">
                  {activityFeed.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0 hover:bg-secondary/20"
                    >
                      <div className={`rounded-full bg-secondary p-2 ${activityColors[item.type]}`}>
                        {item.type === "sale" && <TrendingUp className="h-4 w-4" />}
                        {item.type === "purchase" && <ShoppingCart className="h-4 w-4" />}
                        {item.type === "bid" && <Zap className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          <span className={activityColors[item.type]}>
                            {activityLabels[item.type]}
                          </span>{" "}
                          {item.item}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.type === "sale" && `To: ${item.to}`}
                          {item.type === "purchase" && `From: ${item.from}`}
                          {item.type === "bid" && "Outbid"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-bold text-foreground">
                          <Zap className="h-3 w-3 text-primary" />
                          {item.price} SOL
                        </div>
                        <div className="text-xs text-muted-foreground">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Achievements Tab */}
          {tab === "achievements" && (
            <div className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((ach) => {
                const Icon = ach.icon
                return (
                  <Card
                    key={ach.id}
                    className={`border-border/50 bg-card/50 transition-all ${
                      ach.earned
                        ? "border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                        : "opacity-50"
                    }`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                          ach.earned ? "bg-primary/20" : "bg-secondary"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${ach.earned ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{ach.name}</span>
                          {ach.earned && (
                            <Badge className="bg-primary/20 text-primary text-xs border-primary/30">
                              Earned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span className="text-lg font-bold text-foreground">{value}</span>
      </CardContent>
    </Card>
  )
}
