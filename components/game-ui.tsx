"use client"

import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

interface GameUIProps {
  player1Health: number
  player2Health: number
  gameTime: number
  currentRound: number
  player1Score: number
  player2Score: number
  selectedId?: string
}

export function GameUI({
  player1Health,
  player2Health,
  gameTime,
  currentRound,
  player1Score,
  player2Score,
  selectedId 
}: GameUIProps) {
    const searchParams = useSearchParams();
  const p1 = searchParams.get("p1") ?? "jin";

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const res = await fetch("/api/characters");
        const data: Character[] = await res.json();

        const result = data.find(
          (item) => item.id === (selectedId ?? p1)
        );

        setCharacter(result ?? null);
      } catch (err) {
        console.error("Failed to load character", err);
      }
    }

    fetchCharacter();
  }, [p1, selectedId]);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="flex items-start justify-between p-6 gap-4">
        {/* Player 1 Health */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-red-500 font-bold text-xl tracking-wider">{data}</span>
              <div className="flex gap-1">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < player1Score ? "bg-red-500" : "bg-red-500/20"}`}
                  />
                ))}
              </div>
            </div>
            <span className="text-red-500 font-mono text-lg">{player1Health}%</span>
          </div>
          <div className="h-8 bg-black/60 border-2 border-red-500 rounded-sm overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${player1Health}%` }} />
          </div>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-black/80 border-4 border-yellow-400 rounded-lg px-6 py-3">
            <span
              className={`font-bold text-4xl font-mono ${gameTime <= 10 ? "text-red-500 animate-pulse" : "text-yellow-400"}`}
            >
              {gameTime}
            </span>
          </div>
          <div className="text-white font-bold text-sm tracking-widest">ROUND {currentRound}</div>
        </div>

        {/* Player 2 Health */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-500 font-mono text-lg">{player2Health}%</span>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < player2Score ? "bg-blue-500" : "bg-blue-500/20"}`}
                  />
                ))}
              </div>
              <span className="text-blue-500 font-bold text-xl tracking-wider">PLAYER 2</span>
            </div>
          </div>
          <div className="h-8 bg-black/60 border-2 border-blue-500 rounded-sm overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ml-auto"
              style={{ width: `${player2Health}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between text-xs text-white/60 font-mono">
        <div className="bg-black/60 p-3 rounded border border-white/20">
          <div className="font-bold mb-1 text-red-500">P1 CONTROLS</div>
          <div>WASD - Move | J - Punch | K - Kick | L - Block</div>
        </div>
        <div className="bg-black/60 p-3 rounded border border-white/20 text-right">
          <div className="font-bold mb-1 text-blue-500">P2 CONTROLS</div>
          <div>Arrows - Move | 1 - Punch | 2 - Kick | 3 - Block</div>
        </div>
      </div>
    </div>
  )
}
