"use client"
import { Environment, ContactShadows } from "@react-three/drei"
import { Fighter } from "./fighter6"
import { Fighter1 } from "./fighter6"
import { Arena } from "./arena"
import { GameCamera } from "./game-camera"

interface GameSceneProps {
  player1Position: [number, number, number]
  player2Position: [number, number, number]
  p1: string
  model: string
  animelist: string
}

export function GameScene({ player1Position, player2Position, p1, model, animelist }: GameSceneProps) {
  console.log(p1+' dude its cool '+animelist)
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight position={[-5, 10, -5]} intensity={0.5} angle={0.3} penumbra={1} />

      {/* Game Camera */}
      <GameCamera />

      {/* Arena/Stage */}
      <Arena />

      {/* Fighters */}
      <Fighter1 position={player1Position} color="#ff0000" name={p1} isPlayer1={true} modelPath={model} animationPath={animelist}  />
      <Fighter1 position={player2Position} color="#0066ff" name="Player 2" isPlayer1={false} modelPath="/anime/1a.glb"  animationPath="/anime/1a.glb" />

      {/* Ground Shadows */}
      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={20} blur={2} far={4} />

      {/* Environment for reflections */}
      <Environment preset="sunset" />
    </>
  )
}
