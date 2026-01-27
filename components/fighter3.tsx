"use client"

import { useRef, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"

interface FighterProps {
  position: [number, number, number]
  color?: string
  name: string
  isPlayer1?: boolean
  modelPath: string        // e.g. "/models/fighter-base.glb" (mesh + rig, no anims or default only)
  idlePath: string         // e.g. "/animations/idle.glb"
  // Add more if needed: punchPath, kickPath, etc.
}

export function Fighter1({ 
  position, color, name, isPlayer1 = true, 
  modelPath, idlePath 
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Load base model (scene only)
  const { scene } = useGLTF(modelPath)

  // Load idle animation clip(s)
  const { animations: idleAnims } = useGLTF(idlePath)

  // Combine animations (add more arrays here for other moves)
  const allAnimations = [...idleAnims]  // Add base animations if your modelPath has any: [...baseAnims, ...idleAnims]

  const { actions, names } = useAnimations(allAnimations, groupRef)

  const clonedScene = scene.clone()

  // Tint
  useEffect(() => {
    if (color) {
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          const mat = mesh.material as THREE.MeshStandardMaterial
          // Create a new material to avoid sharing
          mesh.material = mat.clone()
          mesh.material.color = new THREE.Color(color)
        }
      })
    }
  }, [color, clonedScene])

  // Face direction
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI
    }
  }, [isPlayer1])

  // Animation control (same as your improved version)
  useEffect(() => {
    const playAnimation = (animName: string, loop: boolean = true) => {
      Object.values(actions).forEach((a) => a?.fadeOut(0.2))

      const action = actions[animName]
      if (!action) {
        console.warn(`Animation "${animName}" not found. Available:`, names)
        actions["Idle"]?.reset().fadeIn(0.2).play()
        return
      }

      action
        .reset()
        .fadeIn(0.2)
        .setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce)
        .play()

      if (!loop) {
        action.clampWhenFinished = true
        const onFinished = (e: THREE.Event) => {
          if (e.action === action) {
            actions["Idle"]?.reset().fadeIn(0.2).play()
            action.getMixer().removeEventListener("finished", onFinished)
          }
        }
        action.getMixer().addEventListener("finished", onFinished)
      }
    }

    // Your event handlers...
    const handlers: Record<string, () => void> = {
      punch: () => playAnimation("Punch", false),
      kick: () => playAnimation("Kick", false),
      block: () => playAnimation("Block", true),
      hit: () => playAnimation("Hit", false),
      walk: () => playAnimation("Walk", true),
      idle: () => playAnimation("Idle", true),
    }

    Object.entries(handlers).forEach(([event, handler]) => {
      window.addEventListener(`${name}-${event}`, handler as EventListener)
    })

    playAnimation("Idle", true)

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        window.removeEventListener(`${name}-${event}`, handler as EventListener)
      })
    }
  }, [actions, name, names])

  return (
    <group ref={groupRef} position={position}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Preload
useGLTF.preload("/models/fighter-base.glb")
useGLTF.preload("/animations/idle.glb")
