"use client"

import { useRef, useEffect, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"

type Direction = "left" | "right" | "forward" | "back" | null
type AnimationState = "idle" | "walk" | "punch" | "kick" | "block" | "hit"

interface FighterProps {
  position: [number, number, number]
  name: string
  isPlayer1?: boolean
  modelPath: string
  animationPath?: string
}

export function Fighter1({
  position,
  name,
  isPlayer1 = true,
  modelPath,
  animationPath,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)

  /* ---------------- MODEL ---------------- */
  const { scene } = useGLTF(modelPath)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  /* ---------------- ANIMATIONS ---------------- */
  const animGltf = animationPath ? useGLTF(animationPath) : null
  const { actions, mixer } = useAnimations(
    animGltf?.animations ?? [],
    groupRef
  )

  /* ---------------- STATE ---------------- */
  const [animation, setAnimation] = useState<AnimationState>("idle")
  const [direction, setDirection] = useState<Direction>(null)

  /* ---------------- FACING ---------------- */
  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI
  }, [isPlayer1])

  /* ---------------- GAME LOOP (MOVEMENT) ---------------- */
  useFrame((_, delta) => {
    if (!groupRef.current || !direction) return

    const speed = 3
    const pos = groupRef.current.position

    switch (direction) {
      case "left":
        pos.x -= speed * delta
        break
      case "right":
        pos.x += speed * delta
        break
      case "forward":
        pos.z -= speed * delta
        break
      case "back":
        pos.z += speed * delta
        break
    }
  })

  /* ---------------- ANIMATION STATE MACHINE ---------------- */
  useEffect(() => {
    if (!actions) return

    Object.values(actions).forEach((a) => a?.fadeOut(0.2))

    const play = (
      name: string,
      loop: THREE.AnimationActionLoopStyles,
      clamp = false
    ) => {
      const action = actions[name]
      if (!action) return
      action
        .reset()
        .setLoop(loop, loop === THREE.LoopOnce ? 1 : Infinity)
        .fadeIn(0.2)
        .play()
      action.clampWhenFinished = clamp
    }

    switch (animation) {
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
  }, [animation, actions])

  /* ---------------- RETURN TO IDLE AFTER ONE-SHOTS ---------------- */
  useEffect(() => {
    if (!mixer) return

    const onFinish = () => {
      setAnimation("idle")
    }

    mixer.addEventListener("finished", onFinish)
    return () => mixer.removeEventListener("finished", onFinish)
  }, [mixer])

  /* ---------------- EVENT CONTROLS ---------------- */
  useEffect(() => {
    const onWalk = () => setAnimation("walk")
    const onIdle = () => setAnimation("idle")
    const onPunch = () => setAnimation("punch")
    const onKick = () => setAnimation("kick")
    const onBlock = () => setAnimation("block")
    const onHit = () => setAnimation("hit")

    const onMove = (e: CustomEvent<Direction>) => setDirection(e.detail)
    const onStop = () => setDirection(null)

    window.addEventListener(`${name}-walk`, onWalk)
    window.addEventListener(`${name}-idle`, onIdle)
    window.addEventListener(`${name}-punch`, onPunch)
    window.addEventListener(`${name}-kick`, onKick)
    window.addEventListener(`${name}-block`, onBlock)
    window.addEventListener(`${name}-hit`, onHit)

    window.addEventListener(`${name}-move`, onMove as EventListener)
    window.addEventListener(`${name}-stop`, onStop)

    return () => {
      window.removeEventListener(`${name}-walk`, onWalk)
      window.removeEventListener(`${name}-idle`, onIdle)
      window.removeEventListener(`${name}-punch`, onPunch)
      window.removeEventListener(`${name}-kick`, onKick)
      window.removeEventListener(`${name}-block`, onBlock)
      window.removeEventListener(`${name}-hit`, onHit)

      window.removeEventListener(`${name}-move`, onMove as EventListener)
      window.removeEventListener(`${name}-stop`, onStop)
    }
  }, [name])

  /* ---------------- RENDER ---------------- */
  return (
    <group ref={groupRef} position={position} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}
