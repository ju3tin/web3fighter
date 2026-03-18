"use client"

import { Suspense, useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, useAnimations, Environment, ContactShadows, Html } from "@react-three/drei"
import * as THREE from "three"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "./ui/button"
import { GameController1 } from "./game-controller1"

interface CharacterModelProps {
  modelPath: string
  animationPath?: string
  isPlaying: boolean
}

function CharacterModel({ modelPath, isPlaying }: CharacterModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(modelPath)
  const { actions, names } = useAnimations(animations, group)

  

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]]
      if (isPlaying) {
        action?.reset().fadeIn(0.2).play()
      } else {
        action?.fadeOut(0.2)
      }
    }
  }, [isPlaying, actions, names])

  useFrame((state) => {
    if (group.current && !isPlaying) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={group} position={[0, -1.5, 0]} scale={1.2}>
      <primitive object={scene} />
    </group>
  )
}
const maximize1 = () => {
  const element = document.getElementById("moves-list");
  if (element) {
    //element.style.display = "none";
    element.style.removeProperty("display");
    element.style.removeProperty("width");
    element.removeAttribute("style");
    element.classList.add("w-[380px]", "lg:w-[420px]", "shrink-0", "transform", "transition-transform", "duration-300", "translate-x-0");
    // w-[380px] lg:w-[420px] shrink-0 transform transition-transform duration-300 translate-x-0
  }
  const maximizeButton = document.getElementById("maximize-button");
  if (maximizeButton) {
    maximizeButton.style.removeProperty("display");
  }
}
function LoadingFallback() { 
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="text-primary" />
        <span className="text-muted-foreground text-sm">Loading model...</span>
      </div>
    </Html>
  )
}

interface CharacterViewerProps {
  modelPath: string
  animationPath?: string
  isPlaying: boolean
}

export function CharacterViewer({ modelPath, isPlaying }: CharacterViewerProps) {
  
const [open, setOpen] = useState(true);
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a12"]} />
        
        <ambientLight intensity={0.4} />
        <spotLight
          position={[5, 8, 5]}
          angle={0.4}
          penumbra={0.5}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          position={[-5, 5, -5]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.5}
          color="#ff6b35"
        />
        <pointLight position={[0, 2, -3]} intensity={0.3} color="#4a90d9" />

        <Suspense fallback={<LoadingFallback />}>
          <CharacterModel
            modelPath={modelPath}
            isPlaying={isPlaying}
          />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.6}
            scale={10}
            blur={2}
            far={4}
          />
          <Environment preset="night" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />

        <gridHelper args={[20, 20, "#1a1a2e", "#1a1a2e"]} position={[0, -1.5, 0]} />
      </Canvas>
<Button id="maximize-button" style={{zIndex: 1000, position: "absolute", top: "10px", right: "10px", display: "none" }} color="secondary" onClick={() => {maximize1(); setOpen(!open)}}>Maximize</Button>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-muted-foreground text-xs">
        <span className="bg-secondary/80 px-2 py-1 rounded">Drag to rotate</span>
        <span className="bg-secondary/80 px-2 py-1 rounded">Scroll to zoom</span>
      </div>
      <GameController1 onPlayer1Move={() => {}} onPlayer1Action={() => {}} />
    </div>
  )
}
