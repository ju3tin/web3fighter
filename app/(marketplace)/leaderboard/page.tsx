"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Zap,
  TrendingUp,
  Flame,
  Snowflake,
  Wind,
  Shield,
  Sparkles,
  Crown,
  Star,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react"

const fighters = [
  {
    rank: 1,
    prev: 1,
    name: "Shadow Striker",
    owner: "0x7a2...f4d",
    wins: 342,
    losses: 28,
    winRate: 92.4,
    totalEarned: 1240.5,
    tier: "Legendary",
    element: "dark",
    power: 92,
  },
  {
    rank: 2,
    prev: 3,
    name: "Omega Destroyer",
    owner: "0x3b1...e8c",
    wins: 298,
    losses: 34,
    winRate: 89.8,
    totalEarned: 980.2,
    tier: "Legendary",
    element: "lightning",
    power: 97,
  },
  {
    rank: 3,
    prev: 2,
    name: "Frost Queen",
    owner: "0x9c4...a2b",
    wins: 276,
    losses: 42,
    winRate: 86.8,
    totalEarned: 820.7,
    tier: "Legendary",
    element: "ice",
    power: 90,
  },
  {
    rank: 4,
    prev: 6,
    name: "Blaze Warrior",
    owner: "0x1f8...d3e",
    wins: 234,
    losses: 51,
    winRate: 82.1,
    totalEarned: 612.3,
    tier: "Epic",
    element: "fire",
    power: 88,
  },
  {
    rank: 5,
    prev: 4,
    name: "Thunder Fist",
    owner: "0x5e2...c7f",
    wins: 218,
    losses: 59,
    winRate: 78.7,
    totalEarned: 540.8,
    tier: "Epic",
    element: "lightning",
    power: 85,
  },
  {
    rank: 6,
    prev: 5,
    name: "Iron Guardian",
    owner: "0x8d6...b1a",
    wins: 201,
    losses: 72,
    winRate: 73.6,
    totalEarned: 418.5,
    tier: "Epic",
    element: "earth",
    power: 83,
  },
  {
    rank: 7,
    prev: 8,
    name: "Wind Dancer",
    owner: "0x2c9...e5f",
    wins: 187,
    losses: 84,
    winRate: 69.0,
    totalEarned: 312.4,
    tier: "Rare",
    element: "wind",
    power: 78,
  },
  {
    rank: 8,
    prev: 7,
    name: "Void Walker",
    owner: "0x4a1...b3c",
    wins: 174,
    losses: 91,
    winRate: 65.7,
    totalEarned: 276.9,
    tier: "Epic",
    element: "dark",
    power: 81,
  },
  {
    rank: 9,
    prev: 10,
    name: "Magma Titan",
    owner: "0x6d7...f2a",
    wins: 156,
    losses: 98,
    winRate: 61.4,
    totalEarned: 198.3,
    tier: "Rare",
    element: "fire",
    power: 76,
  },
  {
    rank: 10,
    prev: 9,
    name: "Storm Caller",
    owner: "0x0e3...c8b",
    wins: 142,
    losses: 104,
    winRate: 57.7,
    totalEarned: 167.6,
    tier: "Rare",
    element: "lightning",
    power: 74,
  },
]

const topPlayers = [
  { rank: 1, name: "CryptoKing_Sol", totalEarned: 3480.2, fighters: 12, wins: 892 },
  { rank: 2, name: "SolWarrior99", totalEarned: 2910.7, fighters: 9, wins: 741 },
  { rank: 3, name: "NFTChampion", totalEarned: 2340.5, fighters: 7, wins: 618 },
  { rank: 4, name: "BlockchainBrawler", totalEarned: 1890.3, fighters: 5, wins: 502 },
  { rank: 5, name: "DeFiDestroyer", totalEarned: 1450.8, fighters: 8, wins: 431 },
]

const tierColors: Record<string, string> = {
  Legendary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Epic: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  Rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

const elementIcons: Record<string, React.ReactNode> = {
  dark: <Sparkles className="h-4 w-4 text-purple-400" />,
  lightning: <Zap className="h-4 w-4 text-yellow-400" />,
  ice: <Snowflake className="h-4 w-4 text-cyan-400" />,
  fire: <Flame className="h-4 w-4 text-orange-400" />,
  wind: <Wind className="h-4 w-4 text-emerald-400" />,
  earth: <Shield className="h-4 w-4 text-amber-600" />,
}

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
}

function RankChange({ current, prev }: { current: number; prev: number }) {
  const diff = prev - current
  if (diff > 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-emerald-400">
        <ChevronUp className="h-3 w-3" />
        {diff}
      </span>
    )
  if (diff < 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-400">
        <ChevronDown className="h-3 w-3" />
        {Math.abs(diff)}
      </span>
    )
  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />
    </span>
  )
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState("fighters")

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-border/50 bg-background py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-yellow-500/5 blur-3xl" />
            <div className="absolute right-1/4 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400">
                <Trophy className="h-4 w-4" />
                Season 3 Rankings
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Global Leaderboard
              </h1>
              <p className="max-w-xl text-muted-foreground">
                The top fighters and players competing across the Web3Fighter arena. Rankings update in real time.
              </p>
            </div>

            {/* Podium Top 3 */}
            <div className="mt-12 flex items-end justify-center gap-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-400/50 bg-slate-400/10">
                  <Shield className="h-8 w-8 text-slate-300" />
                </div>
                <div className="w-28 rounded-t-xl border-t border-x border-border/50 bg-card/50 px-3 pt-4 pb-6 text-center backdrop-blur-sm">
                  <Crown className="mx-auto mb-1 h-5 w-5 text-slate-300" />
                  <div className="text-2xl font-bold text-slate-300">2</div>
                  <div className="truncate text-xs font-medium text-foreground">{fighters[1].name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{fighters[1].wins}W</div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-500/50 bg-yellow-500/10">
                  <Sparkles className="h-10 w-10 text-yellow-400" />
                  <div className="absolute -top-2 -right-2 rounded-full bg-yellow-500 p-1">
                    <Star className="h-3 w-3 text-black" />
                  </div>
                </div>
                <div className="w-32 rounded-t-xl border-t border-x border-yellow-500/30 bg-yellow-500/5 px-3 pt-4 pb-8 text-center backdrop-blur-sm">
                  <Crown className="mx-auto mb-1 h-5 w-5 text-yellow-400" />
                  <div className="text-3xl font-bold text-yellow-400">1</div>
                  <div className="truncate text-xs font-medium text-foreground">{fighters[0].name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{fighters[0].wins}W</div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-600/50 bg-amber-600/10">
                  <Flame className="h-7 w-7 text-amber-600" />
                </div>
                <div className="w-28 rounded-t-xl border-t border-x border-border/50 bg-card/50 px-3 pt-4 pb-4 text-center backdrop-blur-sm">
                  <Crown className="mx-auto mb-1 h-5 w-5 text-amber-600" />
                  <div className="text-2xl font-bold text-amber-600">3</div>
                  <div className="truncate text-xs font-medium text-foreground">{fighters[2].name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{fighters[2].wins}W</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <Tabs defaultValue="fighters" onValueChange={setTab} className="mb-8">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="fighters">Top Fighters</TabsTrigger>
              <TabsTrigger value="players">Top Players</TabsTrigger>
            </TabsList>
          </Tabs>

          {tab === "fighters" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="grid grid-cols-[3rem_1fr_6rem_6rem_6rem_7rem_7rem] items-center gap-4 border-b border-border/50 px-6 py-3 text-xs font-medium text-muted-foreground">
                  <div>RANK</div>
                  <div>FIGHTER</div>
                  <div className="text-right">WIN RATE</div>
                  <div className="text-right">WINS</div>
                  <div className="text-right">LOSSES</div>
                  <div className="text-right">POWER</div>
                  <div className="text-right">EARNED</div>
                </div>

                {fighters.map((fighter) => (
                  <div
                    key={fighter.rank}
                    className={`grid grid-cols-[3rem_1fr_6rem_6rem_6rem_7rem_7rem] items-center gap-4 border-b border-border/50 px-6 py-4 transition-colors last:border-0 hover:bg-secondary/20 ${fighter.rank <= 3 ? "bg-yellow-500/2" : ""}`}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-bold tabular-nums ${rankColors[fighter.rank] ?? "text-muted-foreground"}`}>
                        {fighter.rank}
                      </span>
                    </div>

                    {/* Fighter */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        {elementIcons[fighter.element]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-bold text-foreground">{fighter.name}</span>
                          <RankChange current={fighter.rank} prev={fighter.prev} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs text-muted-foreground">{fighter.owner}</span>
                          <Badge variant="outline" className={`text-xs ${tierColors[fighter.tier]}`}>
                            {fighter.tier}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Win Rate */}
                    <div className="text-right">
                      <span className="font-bold text-emerald-400">{fighter.winRate}%</span>
                    </div>

                    {/* Wins */}
                    <div className="text-right font-medium text-foreground">{fighter.wins}</div>

                    {/* Losses */}
                    <div className="text-right font-medium text-red-400">{fighter.losses}</div>

                    {/* Power */}
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${fighter.power}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-sm font-medium text-foreground">{fighter.power}</span>
                    </div>

                    {/* Earned */}
                    <div className="flex items-center justify-end gap-1 font-bold text-foreground">
                      <Zap className="h-3 w-3 text-primary" />
                      {fighter.totalEarned.toFixed(1)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {tab === "players" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-[3rem_1fr_6rem_6rem_7rem] items-center gap-4 border-b border-border/50 px-6 py-3 text-xs font-medium text-muted-foreground">
                  <div>RANK</div>
                  <div>PLAYER</div>
                  <div className="text-right">FIGHTERS</div>
                  <div className="text-right">TOTAL WINS</div>
                  <div className="text-right">TOTAL EARNED</div>
                </div>
                {topPlayers.map((player) => (
                  <div
                    key={player.rank}
                    className="grid grid-cols-[3rem_1fr_6rem_6rem_7rem] items-center gap-4 border-b border-border/50 px-6 py-4 transition-colors last:border-0 hover:bg-secondary/20"
                  >
                    <span className={`text-lg font-bold tabular-nums ${rankColors[player.rank] ?? "text-muted-foreground"}`}>
                      {player.rank}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {player.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-foreground">{player.name}</span>
                    </div>
                    <div className="text-right font-medium text-foreground">{player.fighters}</div>
                    <div className="text-right font-medium text-foreground">{player.wins}</div>
                    <div className="flex items-center justify-end gap-1 font-bold text-foreground">
                      <Zap className="h-3 w-3 text-primary" />
                      {player.totalEarned.toFixed(1)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing top 10 of 4,200+ fighters
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <TrendingUp className="h-4 w-4" />
              Updates every 5 minutes
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
