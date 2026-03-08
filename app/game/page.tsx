// app/game/page.tsx
"use client";

import { Suspense } from "react";
import TekkenGame from "@/components/TekkenGame1";
import { useEffect, useState } from "react";
// Optional but recommended for real-time games
export const dynamic = "force-dynamic";
// Or use: export const revalidate = 0;

export default function GamePage() {

  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  if (isPortrait) {
    return (
      <div style={{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center"}}>
        Rotate your device to landscape
      </div>
    );
  }
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
