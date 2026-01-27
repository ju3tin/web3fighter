"use client"
import { useRef, useEffect, useMemo } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import type * as THREE from "three"

interface FighterProps {
  position: [number, number, number]
  color?: string
  name: string
  isPlayer1?: boolean
  modelPath: string
  animationPath?: string // ⬅️ optional
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

  const hasAnimations = !!actions && Object.keys(actions).length > 0

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

  /* ---------- ANIMATION CONTROL ---------- */
  useEffect(() => {
    if (!hasAnimations || !mixer) return

    const fadeTo = (
      animName: string,
      loop: THREE.AnimationActionLoopStyles
    ) => {
      const action = actions[animName]
      if (!action) return

      Object.values(actions).forEach((a) => a?.fadeOut(0.2))
      action.reset().fadeIn(0.2).setLoop(loop, Infinity).play()
      return action
    }

    const playOnce = (animName: string) => {
      const action = fadeTo(animName, THREE.LoopOnce)
      if (!action) return

      action.clampWhenFinished = true
      const onFinish = () => {
        fadeTo("Idle", THREE.LoopRepeat)
        mixer.removeEventListener("finished", onFinish)
      }
      mixer.addEventListener("finished", onFinish)
    }

    /* ---- EVENTS ---- */
    const events: Record<string, () => void> = {
      [`${name}-idle`]: () => fadeTo("Idle", THREE.LoopRepeat),
      [`${name}-walk`]: () => fadeTo("Walk", THREE.LoopRepeat),
      [`${name}-punch`]: () => playOnce("Punch"),
      [`${name}-kick`]: () => playOnce("Kick"),
      [`${name}-hit`]: () => playOnce("Hit"),
      [`${name}-block`]: () => fadeTo("Block", THREE.LoopRepeat),
    }

    Object.entries(events).forEach(([event, handler]) =>
      window.addEventListener(event, handler)
    )

    // Start idle ONLY if it exists
    fadeTo("Idle", THREE.LoopRepeat)

    return () => {
      Object.entries(events).forEach(([event, handler]) =>
        window.removeEventListener(event, handler)
      )
    }
  }, [hasAnimations, actions, mixer, name])

  /* ---------- RENDER ---------- */
  return (
    <group ref={groupRef} position={position}>
      <primitive object={clonedScene} />
    </group>
  )
}
