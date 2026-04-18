"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   ARENA STYLE CONFIG
   Maps arena names to border colors and floor materials
========================================================= */
const arenaStyles: Record<
  string,
  {
    leftBorder: string;
    rightBorder: string;
    frontBackBorder: string;
    floorColor: string;
    floorMetalness?: number;
    floorRoughness?: number;
  }
> = {
  arena01: {
    leftBorder: "#ff0000",
    rightBorder: "#0066ff",
    frontBackBorder: "#333333",
    floorColor: "#1a1a1a",
    floorMetalness: 0.3,
    floorRoughness: 0.7,
  },
  boxing_ring: {
    leftBorder: "#ffffff",
    rightBorder: "#ffffff",
    frontBackBorder: "#ffffff",
    floorColor: "#222222",
    floorMetalness: 0.1,
    floorRoughness: 0.9,
  },
  mishima_dojo: {
    leftBorder: "#880000",
    rightBorder: "#008800",
    frontBackBorder: "#444400",
    floorColor: "#2b1a0b",
  },
  arena_of_embers: {
    leftBorder: "#ff4500",
    rightBorder: "#ff4500",
    frontBackBorder: "#550000",
    floorColor: "#3a1f1f",
  },
  tokyo_stadium: {
    leftBorder: "#0077ff",
    rightBorder: "#ff7700",
    frontBackBorder: "#555555",
    floorColor: "#1a1a1a",
  },
};

/* =========================================================
   FALLBACK ARENA (dynamic + styled by arena type)
========================================================= */
type ArenaFallbackProps = {
  width: number;
  depth: number;
  height?: number;
  arena: string;
};

function ArenaFallback({ width, depth, height = 0.6, arena }: ArenaFallbackProps) {
  const style = arenaStyles[arena] || arenaStyles["arena01"];

  // Compute proportional sizes
  const floorHeight = Math.max(0.2, height * 0.3);
  const borderHeight = height;
  const borderThickness = Math.max(0.1, width * 0.02);
  const centerLineWidth = borderThickness * 0.5;

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, -floorHeight / 2, 0]}>
        <boxGeometry args={[width, floorHeight, depth]} />
        <meshStandardMaterial
          color={style.floorColor}
          metalness={style.floorMetalness ?? 0.3}
          roughness={style.floorRoughness ?? 0.7}
        />
      </mesh>

      {/* Left Border */}
      <mesh position={[-width / 2, borderHeight / 2, 0]}>
        <boxGeometry args={[borderThickness, borderHeight, depth]} />
        <meshStandardMaterial color={style.leftBorder} emissive={style.leftBorder} emissiveIntensity={0.5} />
      </mesh>

      {/* Right Border */}
      <mesh position={[width / 2, borderHeight / 2, 0]}>
        <boxGeometry args={[borderThickness, borderHeight, depth]} />
        <meshStandardMaterial color={style.rightBorder} emissive={style.rightBorder} emissiveIntensity={0.5} />
      </mesh>

      {/* Back Border */}
      <mesh position={[0, borderHeight / 2, -depth / 2]}>
        <boxGeometry args={[width, borderHeight, borderThickness]} />
        <meshStandardMaterial color={style.frontBackBorder} />
      </mesh>

      {/* Front Border */}
      <mesh position={[0, borderHeight / 2, depth / 2]}>
        <boxGeometry args={[width, borderHeight, borderThickness]} />
        <meshStandardMaterial color={style.frontBackBorder} />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[centerLineWidth, depth]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
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
   ERROR BOUNDARY
========================================================= */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; arena: string },
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
      return <ArenaFallback width={10} depth={6} height={0.6} arena={this.props.arena} />;
    }
    return this.props.children;
  }
}

/* =========================================================
   HOOK: Compute GLB bounding box dimensions
========================================================= */
function useModelDimensions(path: string) {
  const { scene } = useGLTF(path);
  const [dimensions, setDimensions] = useState({ width: 10, depth: 6, height: 0.6 });

  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    setDimensions({
      width: size.x || 10,
      depth: size.z || 6,
      height: size.y || 0.6,
    });
  }, [scene]);

  return dimensions;
}

/* =========================================================
   MAIN ARENA COMPONENT
========================================================= */
type ArenaProps = {
  arena?: string;
};

export default function Arena({ arena = "arena01" }: ArenaProps) {
  const modelPath = `/models/${arena}.glb`;
  const { width, depth, height } = useModelDimensions(modelPath);

  return (
    <group position={[0, -0.1, 0]} rotation={[0, Math.PI, 0]}>
      <ErrorBoundary arena={arena}>
        <Suspense fallback={<ArenaFallback width={width} depth={depth} height={height} arena={arena} />}>
          <ArenaModel path={modelPath} />
        </Suspense>
      </ErrorBoundary>
    </group>
  );
}

/* =========================================================
   PRELOAD COMMON MODELS
========================================================= */
useGLTF.preload("/models/arena01.glb");
useGLTF.preload("/models/boxing_ring.glb");
useGLTF.preload("/models/mishima_dojo.glb");
useGLTF.preload("/models/arena_of_embers.glb");
useGLTF.preload("/models/tokyo_stadium.glb");
