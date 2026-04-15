"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type GameHubProps = {
  player1Health: number;
  player2Health: number;
  gameTime: number;
  currentRound: number;
  player1Score: number;
  player2Score: number;
  p1Name?: string;
  p2Name?: string;
};

export default function GameHub({
  player1Health,
  player2Health,
  gameTime,
  currentRound,
  player1Score,
  player2Score,
  p1Name = "KEN",
  p2Name = "PAUL",
}: GameHubProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!groupRef.current) return;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Position the HUD slightly in front of the camera
    groupRef.current.position.copy(camera.position).addScaledVector(direction, -9.5);

    // Make it face the camera perfectly (billboard)
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      <Html
        position={[0, 0, 0]}
        style={{
          width: "920px",
          height: "280px",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          userSelect: "none",
        }}
        transform
        occlude // hides HTML when fighters are in front (prevents overlap)
      >
        <div className="fighting-hud relative w-full h-full text-white font-mono">
          {/* Top Bar - Round & Timer */}
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="text-xl tracking-widest">
              ROUND <span className="text-yellow-400 font-bold">{currentRound}</span>
            </div>

            <div className="text-6xl font-bold tabular-nums text-center w-24">
              {gameTime}
            </div>

            <div className="text-xl tracking-widest">
              SCORE{" "}
              <span className="text-yellow-400">
                {player1Score} - {player2Score}
              </span>
            </div>
          </div>

          {/* Player Names + Health Bars */}
          <div className="flex justify-between items-end px-6">
            {/* Player 1 Side */}
            <div className="flex-1">
              <div className="text-2xl font-bold mb-2 text-left">{p1Name}</div>
              <div className="h-8 bg-zinc-900 border border-white/30 rounded overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-200"
                  style={{ width: `${player1Health}%` }}
                />
              </div>
            </div>

            {/* VS */}
            <div className="text-4xl font-black text-yellow-400/80 mx-8 mb-2">VS</div>

            {/* Player 2 Side */}
            <div className="flex-1 text-right">
              <div className="text-2xl font-bold mb-2">{p2Name}</div>
              <div className="h-8 bg-zinc-900 border border-white/30 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-200 ml-auto"
                  style={{ width: `${player2Health}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
