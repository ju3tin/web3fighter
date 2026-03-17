// app/marketplace/page.tsx
import CategoryNav from "@/components/CategoryNav";
import ItemCard from "@/components/ItemCard";
import { ITEMS } from "@/data/items";

export default function Marketplace() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Fighting Game Asset Marketplace
        </h1>
        <p className="text-zinc-400 mb-10 max-w-2xl">
          Buy & sell characters, individual moves, and cinematic finishing moves for your indie fighter.
        </p>

        <CategoryNav />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ITEMS.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}