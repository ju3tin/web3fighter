"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"

/* ---------------- TYPES ---------------- */

export type Direction = "left" | "right" | "forward" | "back" | null
export type FighterAction =
  | "idle"
  | "walk"
  | "punch"
  | "kick"
  | "block"
  | "hit"

interface FighterProps {
  name: string
  modelPath: string
  position: [number, number, number]
  isPlayer1?: boolean

  /* Controlled externally by your game logic */
  direction: Direction
  action: FighterAction
}

/* ---------------- COMPONENT ---------------- */

export function Fighter({
  name,
  modelPath,
  position,
  isPlayer1 = true,
  direction,
  action,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)

  // If you want preloading, it has to happen in component scope
  // (modelPath is a prop, not a module-level variable).
  useEffect(() => {
    useGLTF.preload(modelPath)
  }, [modelPath])

  /* ---------- LOAD MODEL ---------- */
  const { scene, animations } = useGLTF(modelPath)
  const { actions, mixer } = useAnimations(animations, groupRef)

  /* ---------- INTERNAL STATE ---------- */
  const [currentAction, setCurrentAction] =
    useState<FighterAction>("idle")

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
    }
  })

  /* ---------- ANIMATION STATE MACHINE ---------- */
  useEffect(() => {
    if (!actions || !mixer) return
    if (currentAction === action) return

    /* Fade out everything */
    Object.values(actions).forEach((a) => a?.fadeOut(0.15))

    const play = (
      name: string,
      loop: THREE.AnimationActionLoopStyles,
      clamp = false
    ) => {
      const anim = actions[name]
      if (!anim) return

      anim.reset()
      anim.setLoop(loop, loop === THREE.LoopOnce ? 1 : Infinity)
      anim.fadeIn(0.15)
      anim.play()
      anim.clampWhenFinished = clamp
    }

    switch (action) {
      case "idle":
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

  /* ---------- RETURN TO IDLE AFTER ONE-SHOTS ---------- */
  useEffect(() => {
    if (!mixer) return

    const onFinish = () => {
      setCurrentAction("idle")
    }

    mixer.addEventListener("finished", onFinish)
    return () => mixer.removeEventListener("finished", onFinish)
  }, [mixer])

  /* ---------- RENDER ---------- */
  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}
