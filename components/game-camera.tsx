"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect } from "react"

export function GameCamera() {
  const { camera } = useThree()

  useEffect(() => {
    // Set up side-view fighting game camera
    camera.position.set(0, 2, 8)
    camera.lookAt(0, 1, 0)
  }, [camera])

  useFrame(() => {
    // Keep camera focused on the center of the arena
    camera.lookAt(0, 1, 0)
  })

  return null
}
