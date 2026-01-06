"use client"

import { useRef, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import type * as THREE from "three"

interface FighterProps {
  position: [number, number, number]
  color?: string // Optional: if you want to tint the model
  name: string
  isPlayer1?: boolean
  modelPath: string
  animationPath: string
}

export function Fighter1({ position, color, name, isPlayer1 = true, modelPath, animationPath }: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Load the GLB model
  const { scene, animations } = useGLTF(modelPath)
  
  // Get animation actions
  const { actions, names } = useAnimations(animations, groupRef)

  // Clone scene to avoid sharing state between instances
  const clonedScene = scene.clone()

  // Apply color tint if provided
  useEffect(() => {
 //   console.log('fuck this'+animationPath)
    if (color) {
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          ;(child as THREE.Mesh).material = (child as THREE.Mesh).material.clone()
          ;((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(color)
        }
      })
    }
  }, [color, clonedScene])

  // Face the correct direction (Player 2 faces opposite)
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI
    }
  }, [isPlayer1])

  // External animation control via custom events (same as before)
  useEffect(() => {
    const playAnimation = (animName: string, loop: boolean = false) => {
      // Stop all others
      Object.values(actions).forEach((action) => {
        if (action.isRunning()) action.fadeOut(0.2)
      })

      const action = actions[animName]
      if (action) {
        action
          .reset()
          .fadeIn(0.2)
          .setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce)
          .play()

        // For one-shot animations (punch, kick, hit), go back to idle when done
        if (!loop) {
          action.clampWhenFinished = true
          const onFinished = () => {
            action.fadeOut(0.2)
            actions["Idle"]?.reset().fadeIn(0.2).play()
            action.getMixer().removeEventListener("finished", onFinished)
          }
          action.getMixer().addEventListener("finished", onFinished)
        }
      } else {
        console.warn(`Animation "${animName}" not found. Available:`, names)
        // Fallback to idle
        actions["Idle"]?.play()
      }
    }

    const handlePunch = () => playAnimation("Punch", false)
    const handleKick = () => playAnimation("Kick", false)
    const handleBlock = () => playAnimation("Block", true) // loop while blocking
    const handleHit = () => playAnimation("Hit", false)
    const handleWalk = () => playAnimation("Walk", true)
    const handleIdle = () => playAnimation("Idle", true)

    window.addEventListener(`${name}-punch`, handlePunch)
    window.addEventListener(`${name}-kick`, handleKick)
    window.addEventListener(`${name}-block`, handleBlock)
    window.addEventListener(`${name}-hit`, handleHit)
    window.addEventListener(`${name}-walk`, handleWalk)
    window.addEventListener(`${name}-idle`, handleIdle)

    // Start with idle
    playAnimation("Idle", true)

    return () => {
      window.removeEventListener(`${name}-punch`, handlePunch)
      window.removeEventListener(`${name}-kick`, handleKick)
      window.removeEventListener(`${name}-block`, handleBlock)
      window.removeEventListener(`${name}-hit`, handleHit)
      window.removeEventListener(`${name}-walk`, handleWalk)
      window.removeEventListener(`${name}-idle`, handleIdle)
    }
  }, [name, actions, names])

  return (
    <group ref={groupRef} position={position} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}
