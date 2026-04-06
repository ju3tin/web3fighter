import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export type Direction = "left" | "right" | "forward" | "back" | "stop" | null;

export type FighterAction = "fightstance" | "idle" | "walk" | "block" | "hit"; // basic actions

// New type for special moves coming from JSON
export type Move = {
  id: string;
  name: string;
  anime: string;           // path to the animation glb (e.g. "ert.glb")
  command: string[];
  damage: number;
  type: string;
  properties: string[];
  description: string;
};

interface FighterProps {
  name: string;
  modelPath: string;                    // main character model (with skeleton)
  animationBasePath?: string;           // base folder for animations if needed
  position: [number, number, number];
  rotation?: [number, number, number];
  direction: Direction;
  action: FighterAction;                // for stance, walk, block, hit
  currentMove?: Move | null;            // ← NEW: for special attacks like "Flash Punch Combo"
}

export function Fighter({
  name,
  modelPath,
  animationBasePath = "/anime/",
  position,
  rotation,
  direction,
  action,
  currentMove = null,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load main model (skeleton + base animations)
  const { scene } = useGLTF(modelPath);

  // Load animation file — either base or the specific move animation
  const animPath = currentMove 
    ? `${animationBasePath}${currentMove.anime}` 
    : "/anime/1.glb";   // fallback to your default animelist

  const { animations } = useGLTF(animPath);
  const { actions, mixer } = useAnimations(animations, groupRef);

  const [playingAction, setPlayingAction] = useState<FighterAction | string>("fightstance");

  // Debug
  useEffect(() => {
    console.log(`[${name}] Loaded animations:`, Object.keys(actions));
  }, [actions, name]);

  // Update position & rotation (facing opponent)
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...position);
    if (rotation) {
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  // Play animation based on action OR current special move
  useEffect(() => {
    if (!mixer || Object.keys(actions).length === 0) return;

    // Fade out previous animations
    Object.values(actions).forEach((a) => a?.fadeOut(0.15));

    let animToPlay: THREE.AnimationAction | undefined;

    if (currentMove) {
      // Special move from JSON → play its anime file
      const moveAnimName = Object.keys(actions)[0]; // most animation glbs have one main clip
      animToPlay = actions[moveAnimName];
      console.log(`[${name}] Playing special move: ${currentMove.name} → ${currentMove.anime}`);
    } else {
      // Basic actions (fightstance, walk, block, etc.)
      const baseAnimName = action === "fightstance" ? "fightstance" : 
                          action === "walk" ? "Walk" : 
                          action === "block" ? "Block" : "idle";

      animToPlay = actions[baseAnimName] || Object.values(actions)[0];
    }

    if (animToPlay) {
      const isOneShot = !!currentMove || action === "hit";
      animToPlay.reset()
        .setLoop(isOneShot ? THREE.LoopOnce : THREE.LoopRepeat, isOneShot ? 1 : Infinity)
        .fadeIn(0.2)
        .play();
      animToPlay.clampWhenFinished = isOneShot;
    }

    setPlayingAction(currentMove ? currentMove.name : action);
  }, [action, currentMove, actions, mixer, name]);

  // Return to fightstance after one-shot animations finish
  useEffect(() => {
    if (!mixer) return;
    const onFinish = () => {
      // Reset currentMove so it goes back to stance
    };
    mixer.addEventListener("finished", onFinish);
    return () => mixer.removeEventListener("finished", onFinish);
  }, [mixer]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}