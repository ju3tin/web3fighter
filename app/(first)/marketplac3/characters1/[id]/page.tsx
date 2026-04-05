import { notFound } from "next/navigation";
import Image from "next/image";
import { ITEMS } from "@/data/items";           // adjust path
import { MarketplaceItem } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;

  console.log(`[Character Detail] Requested ID: ${id}`);

  const character = ITEMS.find(
    (item): item is MarketplaceItem & { type: "character" } =>
      item.type === "character" && item.id === id
  );

  if (!character) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      <div className="max-w-7xl mx-auto px-5 py-12 md:py-20">
        <a
          href="/marketplace/characters"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 text-lg"
        >
          ← Back to Characters
        </a>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/60 bg-zinc-900">
            {character.previewGif ? (
              <Image
                src={character.previewGif}
                alt={`${character.title} preview`}
                fill
                className="object-cover"
                unoptimized // for GIFs
              />
            ) : (
              <Image src={character.previewImage} alt={character.title} fill className="object-cover" />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{character.title}</h1>
            <div className="text-4xl font-bold text-emerald-400 mb-6">
              ${character.price.toFixed(2)}
            </div>
            <p className="text-zinc-300 text-lg leading-relaxed mb-8">
              {character.description}
            </p>

            {/* Tags, compatibility, buy button... same as before */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 py-5 rounded-xl font-bold text-lg">
                Buy Now – ${character.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
