// app/marketplace/characters/[slug]/page.tsx
import { ITEMS } from "@/data/items";
import { notFound } from "next/navigation";
import Image from "next/image";

interface Props {
  params: { slug: string };
}

export default function CharacterDetail({ params }: Props) {
  const item = ITEMS.find(
    (i) => i.type === "character" && i.slug === params.slug
  );

  if (!item) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          {item.previewGif && (
            <Image
              src={item.previewGif}
              alt={item.title}
              width={800}
              height={450}
              className="rounded-xl shadow-2xl"
            />
          )}
        </div>

        <div>
          <h1 className="text-5xl font-black mb-4">{item.title}</h1>
          <p className="text-3xl text-green-400 mb-6">${item.price.toFixed(2)}</p>

          <p className="text-zinc-300 text-lg mb-8">{item.description}</p>

          <div className="space-y-4">
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-xl transition">
              Buy Now
            </button>
            <p className="text-center text-sm text-zinc-500">
              Instant digital download • Compatible with Unity / Godot
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}