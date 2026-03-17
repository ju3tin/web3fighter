// lib/types.ts
export type ItemType = "character" | "move" | "finishing-move";

export interface MarketplaceItem {
  id: string;
  type: ItemType;
  title: string;
  slug?: string;           // mainly for characters
  description: string;
  price: number;           // in USD or your currency
  previewImage: string;    // URL to sprite / gif / thumbnail
  previewGif?: string;     // optional short animation preview
  author: string;
  createdAt: string;
  tags?: string[];         // e.g. ["fire", "projectile", "overhead"]
  compatibility?: string[]; // e.g. ["Unity", "Godot", "Custom Engine"]
}