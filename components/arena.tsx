"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type ArenaProps = {
  arena?: string;   // ← This allows dynamic arena (e.g. "arena01", "boxing_ring", etc.)
};

export default function Arena({ arena = "arena01" }: ArenaProps) {
  // Dynamically load the correct .glb file
  const modelPath = `/models/${arena}.glb`;

  const { scene } = useGLTF(modelPath);

  // Clone the scene to avoid mutating the cached GLTF
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Enable shadows on all meshes
  useMemo(() => {
    clonedScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <group position={[0, -0.1, 0]} rotation={[0, Math.PI, 0]} scale={1}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload common arenas for better performance
useGLTF.preload("/models/arena01.glb");
useGLTF.preload("/models/boxing_ring.glb");
// Add more arenas you plan to use:
useGLTF.preload("/models/mishima_dojo.glb");
useGLTF.preload("/models/arena_of_embers.glb");
useGLTF.preload("/models/tokyo_stadium.glb");
