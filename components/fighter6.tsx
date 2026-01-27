"use client"

import { useRef, useEffect, useMemo } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"

interface FighterProps {
  position: [number, number, number]
  color?: string
  name: string          // e.g. "Player1" or "Player2"
  isPlayer1?: boolean
  modelPath: string
  animationPath?: string // optional separate animations file
}

export function Fighter1({
  position,
  color,
  name,
  isPlayer1 = true,
  modelPath,
  animationPath,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null!)

  // ── Load & clone the model ──
  const { scene } = useGLTF(modelPath)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  // ── Load animations (from separate file or fallback to model file) ──
  const gltfForAnims = animationPath ? useGLTF(animationPath) : useGLTF(modelPath)
  const { animations } = gltfForAnims
  const { actions, mixer } = useAnimations(animations, groupRef)

  // ── Debug: Log available animations once on load ──
  useEffect(() => {
    if (animations.length > 0) {
      console.log(`Playable animation names for ${name}:`)
      animations.forEach((clip, i) => {
        console.log(`  ${i + 1}. "${clip.name}" (${clip.duration.toFixed(2)}s)`)
      })
    } else {
      console.warn(`No animations loaded for ${name} (${animationPath || modelPath})`)
    }
  }, [animations, name, modelPath, animationPath])

  // ── Apply custom color to all meshes ──
  useEffect(() => {
    if (!color) return
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.Material
        child.material = material.clone()
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.set(color)
        }
      }
    })
  }, [color, clonedScene])

  // ── Face correct direction (Player1 faces +Z, Player2 faces -Z) ──
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI
    }
  }, [isPlayer1])

  // ── Animation control ──
  useEffect(() => {
    if (!mixer || !actions) return

    // Helper: Fade to a looping animation
    const fadeTo = (animName: string, loop: THREE.AnimationActionLoopStyles = THREE.LoopRepeat) => {
      const action = actions[animName]
      if (!action) {
        console.warn(`Animation "${animName}" not found for ${name}`)
        return null
      }

      // Fade out all others
      Object.values(actions).forEach((a) => a?.fadeOut(0.2))

      action
        .reset()
        .fadeIn(0.2)
        .setLoop(loop, Infinity)
        .play()

      return action
    }

    // Helper: Play once, then return to Idle (if exists)
    const playOnce = (animName: string) => {
      const action = fadeTo(animName, THREE.LoopOnce)
      if (!action) return

      action.clampWhenFinished = true

      const onFinished = () => {
        if (actions.Idle) fadeTo("Idle", THREE.LoopRepeat)
        mixer.removeEventListener("finished", onFinished)
      }

      mixer.addEventListener("finished", onFinished)
    }

    // ── Map of event names → animation handlers (matches your 10 animations) ──
    const events: Record<string, () => void> = {
      [`${name}-idle`]:      () => fadeTo("Idle",      THREE.LoopRepeat),
      [`${name}-walk`]:      () => fadeTo("Walk",      THREE.LoopRepeat),
      [`${name}-run`]:       () => fadeTo("run",       THREE.LoopRepeat),
      [`${name}-punch`]:     () => playOnce("Punch"),
      [`${name}-kick`]:      () => playOnce("Kick"),
      [`${name}-block`]:     () => fadeTo("Block",     THREE.LoopRepeat),
      [`${name}-sneak`]:     () => fadeTo("sneak_pose", THREE.LoopRepeat),
      [`${name}-sad`]:       () => fadeTo("sad_pose",   THREE.LoopRepeat),
      [`${name}-headshake`]: () => playOnce("headShake"),
      [`${name}-agree`]:     () => playOnce("agree"),
    }

    // Attach all event listeners
    Object.entries(events).forEach(([eventName, handler]) => {
      window.addEventListener(eventName, handler)
    })

    // Start with Idle if available
    if (actions.Idle) {
      fadeTo("Idle", THREE.LoopRepeat)
    } else {
      console.warn(`No "Idle" animation for ${name} — model stays in bind pose`)
    }

    // Cleanup
    return () => {
      Object.entries(events).forEach(([eventName]) => {
        window.removeEventListener(eventName, events[eventName])
      })
    }
  }, [mixer, actions, name])

  // ── Render ──
  return (
    <group ref={groupRef} position={position} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}
