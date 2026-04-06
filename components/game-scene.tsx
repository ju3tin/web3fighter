"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { Fighter } from "./fighter9";
import { Arena } from "./arena1";
import { GameCamera } from "./game-camera";

interface GameSceneProps {
  player1Position: [number, number, number];
  player2Position: [number, number, number];
  player1Rotation: [number, number, number];   // ← Added
  player2Rotation: [number, number, number];   // ← Added
  p1: string;
  model: string;
  animelist: string[];                         // Fixed: should be array
}

export function GameScene({
  player1Position,
  player2Position,
  player1Rotation,
  player2Rotation,
  p1,
  model,
  animelist,
}: GameSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight position={[-5, 10, -5]} intensity={0.5} angle={0.3} penumbra={1} />

      {/* Game Camera */}
      <GameCamera />

      {/* Arena/Stage */}
      <Arena />

      {/* Fighters */}
      <Fighter
        position={player1Position}
        rotation={player1Rotation}           // ← This makes Player 1 face Player 2
        name="Player 1"
        isPlayer1={true}
        modelPath={model}
        // animationPath={animelist}        // Uncomment & adjust if your Fighter supports it
        direction="stop"
        action="fightstance"
      />

      <Fighter
        position={player2Position}
        rotation={player2Rotation}           // ← This makes Player 2 face Player 1
        name="Player 2"
        isPlayer1={false}
        modelPath="/anime/1abc.glb"
        // animationPath="/anime/1a.glb"
        direction="stop"
        action="fightstance"
      />

      {/* Ground Shadows */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={4}
      />

      {/* Environment for reflections */}
      <Environment preset="sunset" />
    </>
  );
}
