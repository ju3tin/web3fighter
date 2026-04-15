"use client";

import React, { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   FALLBACK ARENA (used if GLB fails or is loading)
========================================================= */
function ArenaFallback() {
  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[10, 0.2, 6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Left Border */}
      <mesh position={[-5, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.6, 6]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Right Border */}
      <mesh position={[5, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.6, 6]} />
        <meshStandardMaterial
          color="#0066ff"
          emissive="#0066ff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Back Border */}
      <mesh position={[0, 0.3, -3]}>
        <boxGeometry args={[10, 0.6, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Front Border */}
      <mesh position={[0, 0.3, 3]}>
        <boxGeometry args={[10, 0.6, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   GLB MODEL LOADER
========================================================= */
function ArenaModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  return <primitive object={clonedScene} />;
}

/* =========================================================
   ERROR BOUNDARY (catches GLB load failure)
========================================================= */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("Arena GLB failed to load, using fallback.", error);
  }

  render() {
    if (this.state.hasError) {
      return <ArenaFallback />;
    }

    return this.props.children;
  }
}

/* =========================================================
   MAIN ARENA COMPONENT
========================================================= */
type ArenaProps = {
  arena?: string;
};

export default function Arena({ arena = "arena01" }: ArenaProps) {
  const modelPath = `/models/${arena}.glb`;

  return (
    <group position={[0, -0.1, 0]} rotation={[0, Math.PI, 0]}>
      <ErrorBoundary>
        <Suspense fallback={<ArenaFallback />}>
          <ArenaModel path={modelPath} />
        </Suspense>
      </ErrorBoundary>
    </group>
  );
}

/* =========================================================
   PRELOAD COMMON MODELS (optional but recommended)
========================================================= */
useGLTF.preload("/models/arena01.glb");
useGLTF.preload("/models/boxing_ring.glb");
useGLTF.preload("/models/mishima_dojo.glb");
useGLTF.preload("/models/arena_of_embers.glb");
useGLTF.preload("/models/tokyo_stadium.glb");
