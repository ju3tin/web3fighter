"use client"

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

export function Arena() {
  const { scene } = useGLTF("/models/boxing_ring.glb")

  // Clone so multiple renders don't mutate shared GLTF scene.
  const ring = useMemo(() => scene.clone(true), [scene])

  useMemo(() => {
    // Enable shadows on all meshes inside the ring.
    ring.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    return null
  }, [ring])

  return (
    <group position={[0, -0.1, 0]} rotation={[0, Math.PI, 0]} scale={1}>
      <primitive object={ring} />
    </group>
  )
}

useGLTF.preload("/models/boxing_ring.glb")
