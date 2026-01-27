"use client"

import { useRef, useEffect, useMemo } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"   // ← Change to non-type import for runtime constants

interface FighterProps {
  position: [number, number, number]
  color?: string
  name: string
  isPlayer1?: boolean
  modelPath: string
  animationPath?: string
}

export function Fighter1({
  position,
  color,
  name,
  isPlayer1 = true,
  modelPath,
  animationPath,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)

  /* ---------- MODEL ---------- */
  const { scene } = useGLTF(modelPath)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  /* ---------- ANIMATIONS (OPTIONAL) ---------- */
  const animationGltf = animationPath ? useGLTF(animationPath) : null
  const { actions, mixer } = useAnimations(
    animationGltf?.animations ?? [],
    groupRef
  )


  /* ---------- COLOR ---------- */
  useEffect(() => {
    if (!color) return
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = (mesh.material as THREE.Material).clone()
        ;(mesh.material as THREE.MeshStandardMaterial).color.set(color)
      }
    })
  }, [color, clonedScene])

  /* ---------- FACING ---------- */
  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI
  }, [isPlayer1])

  /* ---------- ANIMATION CONTROL (works even if no animations) ---------- */
  useEffect(() => {
    if (!mixer) return

    const fadeTo = (animName: string, loop: THREE.AnimationActionLoopStyles) => {
      const action = actions[animName]
      if (!action) {
        console.warn(`Animation "${animName}" not found for ${name}`)
        return undefined
      }
      Object.values(actions).forEach((a) => a?.fadeOut(0.2))
      action.reset().fadeIn(0.2).setLoop(loop, Infinity).play()
      return action
    }

    const playOnce = (animName: string) => {
      const action = fadeTo(animName, THREE.LoopOnce)
      if (!action) return

      action.clampWhenFinished = true
      const onFinish = () => {
        if (actions.Idle) fadeTo("Idle", THREE.LoopRepeat)
        mixer.removeEventListener("finished", onFinish)
      }
      mixer.addEventListener("finished", onFinish)
    }

    /* Dynamic event names – fixed syntax */
    const events: Record<string, () => void> = {
      [`${name}-idle`]: () => fadeTo("Idle", THREE.LoopRepeat),
      [`${name}-walk`]: () => fadeTo("Walk", THREE.LoopRepeat),
      [`${name}-punch`]: () => playOnce("Punch"),
      [`${name}-kick`]: () => playOnce("Kick"),
      [`${name}-hit`]: () => playOnce("Hit"),
      [`${name}-block`]: () => fadeTo("Block", THREE.LoopRepeat),
    }

    // Attach all listeners
    Object.entries(events).forEach(([event, handler]) => {
      window.addEventListener(event, handler)
    })

    // Start idle ONLY if it actually exists (otherwise model stays in bind pose)
    if (actions.Idle) {
      fadeTo("Idle", THREE.LoopRepeat)
    } else {
      console.warn(`No "Idle" animation found for ${name} – using default model pose`)
    }

    return () => {
      Object.entries(events).forEach(([event, handler]) =>
        window.removeEventListener(event, handler)
      )
    }
  }, [mixer, actions, name])   // actions is safe here (stable reference from drei)

  /* ---------- RENDER ---------- */
  return (
    <group ref={groupRef} position={position} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}
