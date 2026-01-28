import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"

export type Direction = "left" | "right" | "forward" | "back" | "stop" | null
export type FighterAction =
  | "Idle"
  | "walk"
  | "punch"
  | "kick"
  | "block"
  | "hit"
  | "fightstance"
interface FighterProps {
  name: string
  modelPath: string
  position: [number, number, number]
  isPlayer1?: boolean
  direction: Direction
  action: FighterAction
}

export function Fighter({
  name,
  modelPath,
  position,
  isPlayer1 = true,
  direction,
  action,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)

  /* ---------- LOAD MODEL ---------- */
  const { scene, animations } = useGLTF(modelPath)
  const { actions, mixer } = useAnimations(animations, groupRef)

  /* ---------- STATE ---------- */
  const [currentAction, setCurrentAction] = useState<FighterAction>("Idle")

  /* ---------- DEBUG: LOG AVAILABLE ACTIONS ---------- */
  useEffect(() => {
    if (!actions) return
    const actionNames = Object.keys(actions)
    if (actionNames.length === 0) return
    console.log(`[${name}] available animation actions:`, actionNames)
  }, [actions, name])

  /* ---------- INITIAL SETUP ---------- */
  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.position.set(...position)
    groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI
  }, [position, isPlayer1])

  /* ---------- MOVEMENT LOOP ---------- */
  useFrame((_, delta) => {
    if (!groupRef.current || !direction) return
    const speed = 3
    const p = groupRef.current.position

    switch (direction) {
      case "left":
        p.x -= speed * delta
        break
      case "right":
        p.x += speed * delta
        break
      case "forward":
        p.z -= speed * delta
        break
      case "back":
        p.z += speed * delta
        break
      case "stop":
        p.x = p.x
        p.z = p.z
        break
      default:
        break
    }
  })

  /* ---------- ANIMATION STATE MACHINE ---------- */
  useEffect(() => {
    if (!actions || !mixer) return
    if (currentAction === action) return

    // Fade out all animations
    Object.values(actions).forEach((a) => a?.fadeOut(0.15))

    const play = (
      animName: string,
      loop: THREE.AnimationActionLoopStyles,
      clamp = false
    ) => {
      const anim = actions[animName]
      if (!anim) return
      anim.reset()
      anim.setLoop(loop, loop === THREE.LoopOnce ? 1 : Infinity)
      anim.fadeIn(0.15)
      anim.play()
      anim.clampWhenFinished = clamp
    }

    switch (action) {
      case "fightstance":
        play("fightstance", THREE.LoopRepeat)
        break
      case "Idle":
        play("Idle", THREE.LoopRepeat)
        break
      case "walk":
        play("Walk", THREE.LoopRepeat)
        break
      case "punch":
        play("Punch", THREE.LoopOnce, true)
        break
      case "kick":
        play("Kick", THREE.LoopOnce, true)
        break
      case "block":
        play("Block", THREE.LoopRepeat)
        break
      case "hit":
        play("Hit", THREE.LoopOnce, true)
        break
    }

    setCurrentAction(action)
  }, [action, actions, mixer, currentAction])

  /* ---------- RENDER ---------- */
  useEffect(() => {
    if (actions && mixer && !currentAction) {
      // Default to Idle animation on initial load
      actions["fightstance"]
        ?.reset()
        .setLoop(THREE.LoopRepeat, Infinity)
        .fadeIn(0.15)
        .play()
        setCurrentAction("fightstance")
    }
  }, [actions, mixer, currentAction])

  /* ---------- RETURN TO Idle AFTER ONE-SHOTS ---------- */
  useEffect(() => {
    if (!mixer) return

    const onFinish = () => setCurrentAction("fightstance")
    mixer.addEventListener("finished", onFinish)
    return () => mixer.removeEventListener("finished", onFinish)
  }, [mixer])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

/* ---------- PRELOAD MODEL ---------- */
// useGLTF.preload("/anime/1a.glb")
// cant preload because it is a single file
/* ---------------------------------------- */