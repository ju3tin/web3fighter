"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  ShoppingCart,
  Flame,
  Snowflake,
  Wind,
  Shield,
  Target,
  Sparkles,
} from "lucide-react"

const moves = [
  {
    id: 1,
    name: "Dragon Fury",
    type: "Ultimate",
    category: "offensive",
    damage: 450,
    cooldown: 12,
    price: 8.5,
    element: "fire",
    description: "Unleash a devastating dragon breath attack",
    rarity: "Legendary",
    owned: 23,
  },
  {
    id: 2,
    name: "Frost Shield",
    type: "Special",
    category: "defensive",
    damage: 0,
    cooldown: 8,
    price: 4.2,
    element: "ice",
    description: "Create an impenetrable ice barrier",
    rarity: "Epic",
    owned: 89,
  },
  {
    id: 3,
    name: "Lightning Strike",
    type: "Ultimate",
    category: "offensive",
    damage: 380,
    cooldown: 10,
    price: 6.8,
    element: "lightning",
    description: "Call down lightning from the heavens",
    rarity: "Epic",
    owned: 56,
  },
  {
    id: 4,
    name: "Shadow Step",
    type: "Utility",
    category: "utility",
    damage: 50,
    cooldown: 4,
    price: 2.5,
    element: "dark",
    description: "Teleport behind your enemy instantly",
    rarity: "Rare",
    owned: 234,
  },
  {
    id: 5,
    name: "Whirlwind Slash",
    type: "Special",
    category: "offensive",
    damage: 280,
    cooldown: 6,
    price: 3.8,
    element: "wind",
    description: "Spin and slash all nearby enemies",
    rarity: "Rare",
    owned: 167,
  },
  {
    id: 6,
    name: "Earth Shatter",
    type: "Ultimate",
    category: "offensive",
    damage: 520,
    cooldown: 15,
    price: 12.0,
    element: "earth",
    description: "Shatter the ground beneath your foes",
    rarity: "Legendary",
    owned: 12,
  },
  {
    id: 7,
    name: "Healing Aura",
    type: "Support",
    category: "utility",
    damage: -200,
    cooldown: 10,
    price: 5.5,
    element: "light",
    description: "Restore health to you and allies",
    rarity: "Epic",
    owned: 78,
  },
  {
    id: 8,
    name: "Inferno Combo",
    type: "Special",
    category: "offensive",
    damage: 320,
    cooldown: 7,
    price: 4.5,
    element: "fire",
    description: "Execute a rapid 5-hit fire combo",
    rarity: "Epic",
    owned: 102,
  },
]

const rarityColors: Record<string, string> = {
  Legendary: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  Epic: "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400",
  Rare: "border-blue-500/50 bg-blue-500/10 text-blue-400",
  Common: "border-border bg-muted text-muted-foreground",
}

const elementIcons: Record<string, React.ReactNode> = {
  fire: <Flame className="h-5 w-5 text-orange-400" />,
  ice: <Snowflake className="h-5 w-5 text-cyan-400" />,
  lightning: <Zap className="h-5 w-5 text-yellow-400" />,
  dark: <Sparkles className="h-5 w-5 text-purple-400" />,
  wind: <Wind className="h-5 w-5 text-emerald-400" />,
  earth: <Shield className="h-5 w-5 text-amber-600" />,
  light: <Sparkles className="h-5 w-5 text-white" />,
}

const typeStyles: Record<string, string> = {
  Ultimate: "bg-gradient-to-r from-amber-500 to-orange-500",
  Special: "bg-gradient-to-r from-fuchsia-500 to-pink-500",
  Utility: "bg-gradient-to-r from-cyan-500 to-blue-500",
  Support: "bg-gradient-to-r from-emerald-500 to-green-500",
}

export function MovesSection() {
  const [filter, setFilter] = useState("all")

  const filteredMoves =
    filter === "all" ? moves : moves.filter((m) => m.category === filter)

  return (
    <section id="moves" className="relative bg-background py-24">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Combat Moves
            </h2>
            <p className="text-muted-foreground">
              Equip your fighter with powerful moves to dominate battles
            </p>
          </div>

          {/* Category Filters */}
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="offensive">Offensive</TabsTrigger>
              <TabsTrigger value="defensive">Defensive</TabsTrigger>
              <TabsTrigger value="utility">Utility</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Moves Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredMoves.map((move) => (
            <MoveCard key={move.id} move={move} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-accent/50 text-accent hover:bg-accent/10"
          >
            View All Moves
          </Button>
        </div>
      </div>
    </section>
  )
}

function MoveCard({ move }: { move: (typeof moves)[0] }) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              {elementIcons[move.element]}
            </div>
            <div>
              <h3 className="font-bold text-foreground">{move.name}</h3>
              <Badge className={`text-xs ${typeStyles[move.type]} text-white`}>
                {move.type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground">{move.description}</p>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <Target className="mx-auto mb-1 h-4 w-4 text-accent" />
            <div className="text-xs text-muted-foreground">Damage</div>
            <div className="font-bold text-foreground">
              {move.damage > 0 ? move.damage : `+${Math.abs(move.damage)} HP`}
            </div>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <Zap className="mx-auto mb-1 h-4 w-4 text-primary" />
            <div className="text-xs text-muted-foreground">Cooldown</div>
            <div className="font-bold text-foreground">{move.cooldown}s</div>
          </div>
        </div>

        {/* Rarity and Owned */}
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="outline" className={rarityColors[move.rarity]}>
            {move.rarity}
          </Badge>
          <span className="text-xs text-muted-foreground">{move.owned} owned</span>
        </div>

        {/* Price and Buy */}
        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <div className="flex items-center gap-1 font-bold text-foreground">
            <Zap className="h-4 w-4 text-primary" />
            {move.price} SOL
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingCart className="h-3 w-3" />
            Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
