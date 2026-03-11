"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Fighter, FighterAction, Direction } from "@/components/fighter8"
import { Button } from "@/components/ui/button"

export default function AnimationPlayground() {
  const [action, setAction] = useState<FighterAction>("fightstance")
  const [direction, setDirection] = useState<Direction>(null)

  useEffect(() => {
    // Set action to "idle" when the page loads
    setAction("fightstance")
  }, [setAction])

  return (
    <div className="w-full h-screen bg-black flex">
      {/* --------- CANVAS --------- */}
      <div className="flex-1">
        <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} />

          <Environment preset="studio" />
          <OrbitControls enablePan={false} />

          <Fighter
            name="Player1"
            modelPath="/anime/1abc.glb"
            position={[0, 0, 0]}
            isPlayer1
            direction={direction}
            action={action}
          />
        </Canvas>
      </div>

      {/* --------- UI --------- */}
      <div className="w-80 bg-zinc-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Animation Controls</h2>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setAction("Idle")}>Idle</Button>
          <Button onClick={() => setAction("walk")}>Walk</Button>
          <Button onClick={() => setAction("punch")}>Punch</Button>
          <Button onClick={() => setAction("kick")}>Kick</Button>
          <Button onClick={() => setAction("block")}>Block</Button>
          <Button onClick={() => setAction("hit")}>Hit</Button>
          <Button onClick={() => setAction("fightstance")}>Fight Stance</Button>
        </div>

        <hr className="border-zi  nc-700" />

        <h3 className="font-semibold">Movement</h3>
        <div className="grid grid-cols-3 gap-2">
          <div />
          <Button onClick={() => setDirection("forward")}>↑</Button>
          <div />

          <Button onClick={() => setDirection("left")}>←</Button>
          <Button onClick={() => setDirection(null)}>STOP</Button>
          <Button onClick={() => setDirection("right")}>→</Button>

          <div />
          <Button onClick={() => setDirection("back")}>↓</Button>
          <div />
        </div>
      </div>
    </div>
  )
}
