"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart, Zap, Shield, Flame, Snowflake, Wind } from "lucide-react"

const characters = [
  {
    id: 1,
    name: "Shadow Striker",
    tier: "Legendary",
    price: 45.5,
    image: "/characters/shadow-striker.jpg",
    stats: { power: 92, defense: 78, speed: 95 },
    element: "dark",
    rarity: "1 of 50",
    liked: false,
  },
  {
    id: 2,
    name: "Thunder Fist",
    tier: "Epic",
    price: 28.3,
    image: "/characters/thunder-fist.jpg",
    stats: { power: 88, defense: 82, speed: 79 },
    element: "lightning",
    rarity: "1 of 150",
    liked: true,
  },
  {
    id: 3,
    name: "Frost Queen",
    tier: "Legendary",
    price: 52.0,
    image: "/characters/frost-queen.jpg",
    stats: { power: 85, defense: 90, speed: 88 },
    element: "ice",
    rarity: "1 of 25",
    liked: false,
  },
  {
    id: 4,
    name: "Blaze Warrior",
    tier: "Epic",
    price: 31.8,
    image: "/characters/blaze-warrior.jpg",
    stats: { power: 94, defense: 70, speed: 82 },
    element: "fire",
    rarity: "1 of 100",
    liked: false,
  },
  {
    id: 5,
    name: "Wind Dancer",
    tier: "Rare",
    price: 12.5,
    image: "/characters/wind-dancer.jpg",
    stats: { power: 72, defense: 68, speed: 98 },
    element: "wind",
    rarity: "1 of 500",
    liked: true,
  },
  {
    id: 6,
    name: "Iron Guardian",
    tier: "Epic",
    price: 35.2,
    image: "/characters/iron-guardian.jpg",
    stats: { power: 80, defense: 96, speed: 65 },
    element: "earth",
    rarity: "1 of 120",
    liked: false,
  },
]

const tierColors: Record<string, string> = {
  Legendary: "bg-gradient-to-r from-amber-500 to-yellow-400 text-black",
  Epic: "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white",
  Rare: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
  Common: "bg-muted text-muted-foreground",
}

const elementIcons: Record<string, React.ReactNode> = {
  dark: <Zap className="h-4 w-4" />,
  lightning: <Zap className="h-4 w-4" />,
  ice: <Snowflake className="h-4 w-4" />,
  fire: <Flame className="h-4 w-4" />,
  wind: <Wind className="h-4 w-4" />,
  earth: <Shield className="h-4 w-4" />,
}

export function CharactersSection() {
  const [filter, setFilter] = useState("all")
  const [likedState, setLikedState] = useState<Record<number, boolean>>(
    Object.fromEntries(characters.map((c) => [c.id, c.liked]))
  )

  const filteredCharacters =
    filter === "all" ? characters : characters.filter((c) => c.tier.toLowerCase() === filter)

  const toggleLike = (id: number) => {
    setLikedState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section id="characters" className="relative bg-background py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Fighter Collection
            </h2>
            <p className="text-muted-foreground">
              Discover and collect unique fighters with devastating abilities
            </p>
          </div>

          {/* Filters */}
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="legendary">Legendary</TabsTrigger>
              <TabsTrigger value="epic">Epic</TabsTrigger>
              <TabsTrigger value="rare">Rare</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Characters Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isLiked={likedState[character.id]}
              onToggleLike={() => toggleLike(character.id)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            View All Characters
          </Button>
        </div>
      </div>
    </section>
  )
}

function CharacterCard({
  character,
  isLiked,
  onToggleLike,
}: {
  character: (typeof characters)[0]
  isLiked: boolean
  onToggleLike: () => void
}) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      {/* Character Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-secondary to-background">
        {/* Placeholder for 3D character model */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
            {elementIcons[character.element]}
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
          </div>
        </div>

        {/* Tier Badge */}
        <Badge className={`absolute left-3 top-3 ${tierColors[character.tier]}`}>
          {character.tier}
        </Badge>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={onToggleLike}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isLiked ? "fill-accent text-accent" : "text-muted-foreground"
            }`}
          />
        </Button>

        {/* Rarity tag */}
        <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {character.rarity}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Name and Element */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{character.name}</h3>
          <div className="rounded-full bg-secondary p-1.5">{elementIcons[character.element]}</div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <StatBar label="PWR" value={character.stats.power} color="bg-accent" />
          <StatBar label="DEF" value={character.stats.defense} color="bg-primary" />
          <StatBar label="SPD" value={character.stats.speed} color="bg-chart-3" />
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Current Price</div>
            <div className="flex items-center gap-1 text-lg font-bold text-foreground">
              <Zap className="h-4 w-4 text-primary" />
              {character.price} SOL
            </div>
          </div>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <ShoppingCart className="h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
