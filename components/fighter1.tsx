"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface FighterProps {
  position: [number, number, number]
  color: string
  name: string
  isPlayer1: true
}

type AnimationState = "idle" | "punch" | "kick" | "block" | "hit" | "walk"

export function Fighter({ position, color, name, isPlayer1 = true }: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)

  const [animation, setAnimation] = useState<AnimationState>("idle")
  const [animationTime, setAnimationTime] = useState(0)

  // Animation logic
  useFrame((state, delta) => {
    if (!groupRef.current) return

    setAnimationTime((prev) => prev + delta)

    // Idle animation - slight breathing motion
    if (animation === "idle") {
      if (groupRef.current) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02
      }
      // Reset limb positions
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0
    }

    // Punch animation
    if (animation === "punch") {
      const progress = Math.min(animationTime / 0.3, 1)
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = (-Math.PI / 2) * Math.sin(progress * Math.PI)
        rightArmRef.current.position.z = Math.sin(progress * Math.PI) * 0.3 * (isPlayer1 ? 1 : -1)
      }
      if (progress >= 1) {
        setAnimation("idle")
        setAnimationTime(0)
      }
    }

    // Kick animation
    if (animation === "kick") {
      const progress = Math.min(animationTime / 0.4, 1)
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = (-Math.PI / 3) * Math.sin(progress * Math.PI)
        rightLegRef.current.position.z = Math.sin(progress * Math.PI) * 0.5 * (isPlayer1 ? 1 : -1)
      }
      if (progress >= 1) {
        setAnimation("idle")
        setAnimationTime(0)
      }
    }

    // Block animation
    if (animation === "block") {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 4
        leftArmRef.current.position.z = 0.2
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 4
        rightArmRef.current.position.z = 0.2
      }
    }

    // Hit animation - knockback
    if (animation === "hit") {
      const progress = Math.min(animationTime / 0.2, 1)
      if (groupRef.current) {
        groupRef.current.position.z = position[2] + Math.sin(progress * Math.PI) * 0.3 * (isPlayer1 ? -1 : 1)
        groupRef.current.rotation.z = Math.sin(progress * Math.PI) * 0.2 * (isPlayer1 ? 1 : -1)
      }
      if (progress >= 1) {
        setAnimation("idle")
        setAnimationTime(0)
        if (groupRef.current) {
          groupRef.current.rotation.z = 0
        }
      }
    }

    // Walk animation
    if (animation === "walk") {
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.5
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -Math.sin(state.clock.elapsedTime * 8) * 0.5
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(state.clock.elapsedTime * 8) * 0.3
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.3
      }
    }
  })

  // Expose animation control via custom events
  useEffect(() => {
    const handlePunch = () => {
      setAnimation("punch")
      setAnimationTime(0)
    }
    const handleKick = () => {
      setAnimation("kick")
      setAnimationTime(0)
    }
    const handleBlock = () => setAnimation("block")
    const handleHit = () => {
      setAnimation("hit")
      setAnimationTime(0)
    }
    const handleWalk = () => setAnimation("walk")
    const handleIdle = () => setAnimation("idle")

    window.addEventListener(`${name}-punch`, handlePunch)
    window.addEventListener(`${name}-kick`, handleKick)
    window.addEventListener(`${name}-block`, handleBlock)
    window.addEventListener(`${name}-hit`, handleHit)
    window.addEventListener(`${name}-walk`, handleWalk)
    window.addEventListener(`${name}-idle`, handleIdle)

    return () => {
      window.removeEventListener(`${name}-punch`, handlePunch)
      window.removeEventListener(`${name}-kick`, handleKick)
      window.removeEventListener(`${name}-block`, handleBlock)
      window.removeEventListener(`${name}-hit`, handleHit)
      window.removeEventListener(`${name}-walk`, handleWalk)
      window.removeEventListener(`${name}-idle`, handleIdle)
    }
  }, [name])

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh ref={bodyRef} castShadow position={[0, 1, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Eyes - white dots */}
      <mesh position={[-0.1, 1.85, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.1, 1.85, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.5, 0.8, 0]}>
        <mesh ref={leftArmRef} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.5, 0.8, 0]}>
        <mesh ref={rightArmRef} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.2, 0.2, 0]}>
        <mesh ref={leftLegRef} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.2, 0.2, 0]}>
        <mesh ref={rightLegRef} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
    </group>
  )
}
