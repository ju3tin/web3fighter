"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Timer, Zap, Users, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export function FeaturedSection() {
  return (
    <section className="relative bg-background py-24">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Featured NFT Card */}
          <FeaturedAuctionCard />

          {/* Live Activity Feed */}
          <LiveActivityFeed />
        </div>
      </div>
    </section>
  )
}

function FeaturedAuctionCard() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 0
              minutes = 0
              seconds = 0
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6">
      {/* Glow effect */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative">
        {/* Label */}
        <Badge className="mb-4 bg-accent text-accent-foreground">
          <Timer className="mr-1 h-3 w-3" />
          Live Auction
        </Badge>

        {/* NFT Preview */}
        <div className="mb-6 flex aspect-video items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-secondary via-background to-secondary">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
            <div className="relative rounded-full border-4 border-primary/50 bg-primary/10 p-8">
              <Zap className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Info */}
        <h3 className="mb-2 text-2xl font-bold text-foreground">
          Omega Destroyer
        </h3>
        <p className="mb-4 text-muted-foreground">
          The rarest fighter in Web3Fighter. Only 1 in existence.
        </p>

        {/* Timer */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Minutes" />
          <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Bid Info */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-secondary/50 p-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Bid</div>
            <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              125.5 SOL
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Bidders</div>
            <div className="flex items-center gap-1 text-lg font-bold text-foreground">
              <Users className="h-4 w-4 text-accent" />
              47
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Place Bid
        </Button>
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-secondary p-3 text-center">
      <div className="text-3xl font-bold tabular-nums text-foreground">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function LiveActivityFeed() {
  const activities = [
    {
      type: "sale",
      item: "Shadow Striker",
      price: 45.5,
      user: "0x7a2...f4d",
      time: "2 min ago",
    },
    {
      type: "bid",
      item: "Dragon Fury",
      price: 8.2,
      user: "0x3b1...e8c",
      time: "5 min ago",
    },
    {
      type: "list",
      item: "Frost Queen",
      price: 52.0,
      user: "0x9c4...a2b",
      time: "8 min ago",
    },
    {
      type: "sale",
      item: "Lightning Strike",
      price: 6.5,
      user: "0x1f8...d3e",
      time: "12 min ago",
    },
    {
      type: "bid",
      item: "Omega Destroyer",
      price: 124.0,
      user: "0x5e2...c7f",
      time: "15 min ago",
    },
    {
      type: "sale",
      item: "Wind Dancer",
      price: 12.5,
      user: "0x8d6...b1a",
      time: "18 min ago",
    },
  ]

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Live Activity</h3>
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} />
        ))}
      </div>

      <Button
        variant="ghost"
        className="mt-4 w-full text-muted-foreground hover:text-foreground"
      >
        View All Activity
      </Button>
    </div>
  )
}

function ActivityItem({
  activity,
}: {
  activity: {
    type: string
    item: string
    price: number
    user: string
    time: string
  }
}) {
  const typeStyles = {
    sale: { icon: TrendingUp, color: "text-emerald-400", label: "Sold" },
    bid: { icon: Zap, color: "text-primary", label: "New Bid" },
    list: { icon: TrendingUp, color: "text-accent", label: "Listed" },
  }

  const style = typeStyles[activity.type as keyof typeof typeStyles]
  const Icon = style.icon

  return (
    <div className="flex items-center gap-4 rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
      <div className={`rounded-full bg-secondary p-2 ${style.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">{activity.item}</span>
          <Badge variant="outline" className="text-xs">
            {style.label}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          by {activity.user}
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 font-bold text-foreground">
          <Zap className="h-3 w-3 text-primary" />
          {activity.price}
        </div>
        <div className="text-xs text-muted-foreground">{activity.time}</div>
      </div>
    </div>
  )
}
