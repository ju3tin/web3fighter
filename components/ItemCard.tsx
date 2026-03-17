// components/ItemCard.tsx
import { MarketplaceItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  item: MarketplaceItem;
}

export default function ItemCard({ item }: Props) {
  const href =
    item.type === "character"
      ? `/marketplace/characters/${item.slug}`
      : item.type === "move"
      ? `/marketplace/moves/${item.id}`
      : `/marketplace/finishing-moves/${item.id}`;

  const typeLabel =
    item.type === "character"
      ? "Character"
      : item.type === "move"
      ? "Move"
      : "Finisher";

  return (
    <Link href={href} className="group block">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-600/50 transition-all hover:shadow-xl hover:shadow-blue-900/20">
        <div className="aspect-video relative">
          {item.previewGif ? (
            <Image
              src={item.previewGif}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src={item.previewImage}
              alt={item.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold group-hover:text-blue-400 transition">
              {item.title}
            </h3>
            <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full">
              {typeLabel}
            </span>
          </div>

          <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-400">
              ${item.price.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500">by {item.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}