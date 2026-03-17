// data/items.ts
import { MarketplaceItem } from "@/lib/types";

export const ITEMS: MarketplaceItem[] = [
  {
    id: "char-1",
    type: "character",
    title: "Blaze Knight",
    slug: "blaze-knight",
    description: "Fire-based rushdown character with strong mix-ups and anti-air specials.",
    price: 19.99,
    previewImage: "/previews/blaze-knight.png",
    previewGif: "/previews/blaze-combo.gif",
    author: "FightForge",
    createdAt: "2026-02-10",
    tags: ["fire", "rushdown", "mixup"],
    compatibility: ["Unity", "Godot"],
  },
  {
    id: "move-42",
    type: "move",
    title: "Plasma Hadoken",
    description: "Fast projectile with 3 charge levels. Great zoning tool.",
    price: 4.99,
    previewImage: "/previews/plasma-hadoken.jpg",
    previewGif: "/previews/plasma-hadoken.gif",
    author: "PixelStriker",
    createdAt: "2026-01-05",
    tags: ["projectile", "charge"],
  },
  {
    id: "finish-7",
    type: "finishing-move",
    title: "Soul Ripper",
    description: "Brutal fatality — rips opponent's soul out and crushes it.",
    price: 7.99,
    previewImage: "/previews/soul-ripper-pose.jpg",
    previewGif: "/previews/soul-ripper.gif",
    author: "DarkDev",
    createdAt: "2026-03-01",
    tags: ["fatality", "gore"],
  },
  // ... add 20–50 more items
];