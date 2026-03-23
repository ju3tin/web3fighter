"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  Search,
  Zap,
  Shield,
  Swords,
  Users,
  Wallet,
  HelpCircle,
  MessageSquare,
} from "lucide-react"

const categories = [
  { id: "all", label: "All", icon: HelpCircle },
  { id: "getting-started", label: "Getting Started", icon: Zap },
  { id: "nfts", label: "NFTs", icon: Shield },
  { id: "gameplay", label: "Gameplay", icon: Swords },
  { id: "wallet", label: "Wallet & Payments", icon: Wallet },
  { id: "marketplace", label: "Marketplace", icon: Users },
]

const faqs = [
  {
    id: 1,
    category: "getting-started",
    question: "What is Web3Fighter?",
    answer:
      "Web3Fighter is a 3D blockchain-based fighting game built on the Solana network. Players can collect unique fighter NFTs and combat move NFTs, battle other players in real time, and trade their assets on the marketplace. Every fighter and move is a true digital asset owned by you on-chain.",
  },
  {
    id: 2,
    category: "getting-started",
    question: "How do I get started?",
    answer:
      "To get started, you need a Solana-compatible wallet (such as Phantom or Solflare). Connect your wallet using the 'Connect Wallet' button in the navigation. Once connected, you can browse the marketplace, place bids in auctions, and purchase your first fighter NFT to begin playing.",
  },
  {
    id: 3,
    category: "wallet",
    question: "Which wallets are supported?",
    answer:
      "Web3Fighter supports all major Solana wallets including Phantom, Solflare, Backpack, and Glow. We recommend Phantom for the best experience. Make sure your wallet has SOL loaded before making any purchases. A small amount of SOL is also needed for transaction fees (typically less than $0.01).",
  },
  {
    id: 4,
    category: "nfts",
    question: "What types of NFTs are available?",
    answer:
      "There are two main types of NFTs in Web3Fighter: Fighter NFTs (characters you use in battle, each with unique stats like Power, Defense, and Speed) and Move NFTs (combat abilities you equip to your fighter). Each NFT has a rarity tier: Common, Rare, Epic, or Legendary — with Legendary being the rarest and most powerful.",
  },
  {
    id: 5,
    category: "nfts",
    question: "What do rarity tiers mean?",
    answer:
      "Rarity tiers determine how rare and powerful an NFT is. Legendary NFTs have the highest stats and are the fewest in existence (as few as 1). Epic NFTs have strong stats and limited supply. Rare NFTs are more accessible but still provide competitive performance. Higher rarity generally means higher value on the marketplace.",
  },
  {
    id: 6,
    category: "gameplay",
    question: "How does combat work?",
    answer:
      "Combat in Web3Fighter is turn-based with real-time elements. Your fighter's base stats (Power, Defense, Speed) determine your performance. You equip Move NFTs to your fighter before each match — moves have damage values, cooldown timers, and elemental types. Element matchups matter: fire beats wind, ice beats fire, etc. Winning battles earns you SOL rewards.",
  },
  {
    id: 7,
    category: "gameplay",
    question: "How many moves can I equip?",
    answer:
      "Each fighter can have up to 4 moves equipped simultaneously. You can mix and match any Move NFTs you own regardless of element type, though combining moves that match your fighter's element will grant a damage bonus. You can change your move loadout between battles from your profile page.",
  },
  {
    id: 8,
    category: "marketplace",
    question: "How do I list an NFT for sale?",
    answer:
      "Navigate to your Profile page and select the NFT you want to sell. Click the 'List' button and set your desired price in SOL. Listings are stored on-chain. You can also choose to list it as an auction with a minimum bid and duration. A 2.5% marketplace fee is deducted from the sale price upon completion.",
  },
  {
    id: 9,
    category: "marketplace",
    question: "How do auctions work?",
    answer:
      "Auctions run for a set period of time (typically 1–24 hours). Any user can place a bid above the current highest bid plus the minimum increment. If you are outbid, your SOL is automatically returned to your wallet. When the auction ends, the highest bidder receives the NFT and the seller receives the SOL minus the platform fee.",
  },
  {
    id: 10,
    category: "wallet",
    question: "What are the transaction fees?",
    answer:
      "Solana network fees are extremely low — typically less than $0.001 per transaction. The Web3Fighter marketplace charges a 2.5% fee on all completed sales and auction settlements. There are no fees for listing, bidding, or browsing. Royalties of 5% go back to the original creator on secondary sales.",
  },
  {
    id: 11,
    category: "nfts",
    question: "Can I use my NFTs outside of Web3Fighter?",
    answer:
      "Yes. All Web3Fighter NFTs follow the Solana SPL token standard and are fully compatible with any Solana-based marketplace or wallet. You can trade them on platforms like Magic Eden or Tensor. Your NFTs are yours to hold, sell, or use anywhere in the Solana ecosystem.",
  },
  {
    id: 12,
    category: "getting-started",
    question: "Is there a free-to-play option?",
    answer:
      "Yes. New players receive a free Starter Fighter NFT upon wallet connection. This gives you a Common-tier character to begin playing ranked matches. While the starter fighter has limited stats, you can earn SOL through wins and use it to upgrade to more powerful NFTs from the marketplace.",
  },
]

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition-all duration-200 ${
        isOpen
          ? "border-primary/40 bg-primary/5"
          : "border-border/50 bg-card/50 hover:border-border"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground">{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-border/50 px-6 pb-5 pt-4">
          <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(1)
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === "all" || f.category === activeCategory
    const matchSearch =
      search === "" ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-border/50 bg-background py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-1/4 top-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mb-8 text-muted-foreground">
              Everything you need to know about Web3Fighter. Can't find your answer? Reach out to our support team.
            </p>

            {/* Search */}
            <div className="relative mx-auto max-w-lg">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-border/50 bg-secondary/50 pl-11 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
          {/* Category Filters */}
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "border-border/50 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                  {cat.id !== "all" && (
                    <Badge
                      variant="outline"
                      className={`ml-1 text-xs ${
                        activeCategory === cat.id
                          ? "border-primary-foreground/30 text-primary-foreground"
                          : "border-border/50 text-muted-foreground"
                      }`}
                    >
                      {faqs.filter((f) => f.category === cat.id).length}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          {/* FAQ Accordion */}
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filtered.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No questions found matching your search.</p>
              <Button
                variant="outline"
                className="border-border/50 text-muted-foreground hover:text-foreground"
                onClick={() => { setSearch(""); setActiveCategory("all") }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Still need help */}
          <Card className="mt-16 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-bold text-foreground">Still have questions?</h3>
                <p className="text-muted-foreground">
                  Can't find what you're looking for? Our support team is available 24/7 to help you out.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-border/50 text-muted-foreground hover:text-foreground">
                  Discord
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  )
}
