"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Swords,
  Users,
  Zap,
  Shield,
  Trophy,
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  ArrowRight,
  Clock,
  Star,
  ChevronRight,
  Gamepad2,
  Target,
  Layers,
  Coins,
} from "lucide-react";

const wikiCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of Web3Fighter",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
    articles: 8,
  },
  {
    id: "fighters",
    title: "Fighters",
    description: "Complete guide to all playable characters",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10",
    articles: 24,
  },
  {
    id: "combat-moves",
    title: "Combat Moves",
    description: "Master every move and combo",
    icon: Swords,
    color: "text-[oklch(0.6_0.2_60)]",
    bgColor: "bg-[oklch(0.6_0.2_60)]/10",
    articles: 56,
  },
  {
    id: "elements",
    title: "Elements",
    description: "Understand elemental advantages",
    icon: Sparkles,
    color: "text-[oklch(0.7_0.15_280)]",
    bgColor: "bg-[oklch(0.7_0.15_280)]/10",
    articles: 6,
  },
  {
    id: "nft-guide",
    title: "NFT Guide",
    description: "Trading, minting, and marketplace tips",
    icon: Coins,
    color: "text-[oklch(0.8_0.15_85)]",
    bgColor: "bg-[oklch(0.8_0.15_85)]/10",
    articles: 12,
  },
  {
    id: "ranked",
    title: "Ranked Mode",
    description: "Climb the competitive ladder",
    icon: Trophy,
    color: "text-[oklch(0.7_0.2_140)]",
    bgColor: "bg-[oklch(0.7_0.2_140)]/10",
    articles: 10,
  },
];

const elements = [
  { name: "Fire", icon: Flame, color: "text-red-500", weakness: "Water", strength: "Wind" },
  { name: "Water", icon: Droplets, color: "text-blue-500", weakness: "Earth", strength: "Fire" },
  { name: "Wind", icon: Wind, color: "text-cyan-400", weakness: "Fire", strength: "Earth" },
  { name: "Earth", icon: Mountain, color: "text-amber-600", weakness: "Wind", strength: "Water" },
];

const featuredArticles = [
  {
    title: "Beginner's Guide to Web3Fighter",
    category: "Getting Started",
    readTime: "10 min",
    views: "15.2K",
    updated: "2 days ago",
  },
  {
    title: "Season 4 Meta Report",
    category: "Ranked",
    readTime: "8 min",
    views: "8.7K",
    updated: "1 day ago",
  },
  {
    title: "How to Trade NFTs Safely",
    category: "NFT Guide",
    readTime: "6 min",
    views: "12.4K",
    updated: "3 days ago",
  },
  {
    title: "Understanding Rarity Tiers",
    category: "NFT Guide",
    readTime: "5 min",
    views: "9.1K",
    updated: "1 week ago",
  },
];

const fighterGuides = [
  {
    name: "Shadow Blade",
    element: "Wind",
    tier: "S",
    difficulty: "Hard",
    image: "SB",
  },
  {
    name: "Inferno Rex",
    element: "Fire",
    tier: "S",
    difficulty: "Medium",
    image: "IR",
  },
  {
    name: "Aqua Storm",
    element: "Water",
    tier: "A",
    difficulty: "Easy",
    image: "AS",
  },
  {
    name: "Terra Golem",
    element: "Earth",
    tier: "A",
    difficulty: "Medium",
    image: "TG",
  },
];

const recentUpdates = [
  {
    title: "New Fighter: Void Walker",
    type: "Addition",
    date: "Mar 15, 2026",
  },
  {
    title: "Shadow Blade combo guide updated",
    type: "Update",
    date: "Mar 14, 2026",
  },
  {
    title: "Season 4 ranked rewards added",
    type: "Addition",
    date: "Mar 12, 2026",
  },
  {
    title: "Element chart corrections",
    type: "Fix",
    date: "Mar 10, 2026",
  },
];

export default function WikiPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "S":
        return "bg-[oklch(0.8_0.15_85)] text-[oklch(0.2_0.05_85)]";
      case "A":
        return "bg-primary text-primary-foreground";
      case "B":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pb-20 pt-28">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Web3Fighter Wiki
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Your comprehensive guide to mastering the arena. Learn about fighters, 
            combat moves, strategies, and everything NFT.
          </p>

          {/* Search */}
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search the wiki..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 bg-secondary/50 pl-12 pr-4 text-base"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-foreground">116</div>
            <div className="text-sm text-muted-foreground">Articles</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-foreground">24</div>
            <div className="text-sm text-muted-foreground">Fighters</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-foreground">86</div>
            <div className="text-sm text-muted-foreground">Combat Moves</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-foreground">4</div>
            <div className="text-sm text-muted-foreground">Elements</div>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Browse by Category
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wikiCategories.map((category) => (
              <Link key={category.id} href={`/wiki/${category.id}`}>
                <Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:bg-card/80">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={`rounded-xl p-3 ${category.bgColor}`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {category.articles} articles
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Element System */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Element System</h2>
            <Button variant="ghost" className="gap-2 text-primary">
              Full Guide <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {elements.map((element) => (
                  <div
                    key={element.name}
                    className="rounded-xl border border-border bg-secondary/30 p-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <element.icon className={`h-8 w-8 ${element.color}`} />
                      <span className="text-lg font-semibold text-foreground">
                        {element.name}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Strong vs</span>
                        <span className="font-medium text-green-500">
                          {element.strength}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weak vs</span>
                        <span className="font-medium text-red-500">
                          {element.weakness}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Elemental advantage grants +25% damage. Use this to your strategic advantage!
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Featured Articles */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Featured Articles
              </h2>
              <Button variant="ghost" className="gap-2 text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {featuredArticles.map((article, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50"
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-secondary text-xs"
                        >
                          {article.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {article.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{article.views} views</span>
                        <span>Updated {article.updated}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fighter Guides */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Top Fighter Guides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fighterGuides.map((fighter, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-bold text-foreground">
                      {fighter.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {fighter.name}
                        </span>
                        <Badge className={`text-xs ${getTierColor(fighter.tier)}`}>
                          {fighter.tier}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                          {fighter.element}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className={getDifficultyColor(fighter.difficulty)}>
                          {fighter.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {update.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-xs ${
                          update.type === "Addition"
                            ? "border-green-500/50 text-green-500"
                            : update.type === "Update"
                            ? "border-blue-500/50 text-blue-500"
                            : "border-yellow-500/50 text-yellow-500"
                        }`}
                      >
                        {update.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {update.date}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Combos
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Layers className="mr-2 h-4 w-4" />
                    Tier List
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Defense
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Zap className="mr-2 h-4 w-4" />
                    Specials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contribute CTA */}
        <section className="mt-16">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  Contribute to the Wiki
                </h3>
                <p className="text-muted-foreground">
                  Help the community by sharing your knowledge. Submit new guides, 
                  correct outdated info, or suggest improvements.
                </p>
              </div>
              <Button className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                Become a Contributor
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
