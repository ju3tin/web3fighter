// app/game/page.tsx
import { Suspense } from "react";
import TekkenGame from "@/components/TekkenGame";

// Optional but recommended for real-time games
export const dynamic = "force-dynamic";
// Or use: export const revalidate = 0;

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen bg-black text-white text-3xl font-bold">
          Loading Tekken Game...
        </div>
      }
    >
      <TekkenGame />
    </Suspense>
  );
}
