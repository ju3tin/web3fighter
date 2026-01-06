"use client"

import { useRef, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import type * as THREE from "three"

interface FighterProps {
  position: [number, number, number]
  color?: string // Optional: if you want to tint the model
  name: string
  isPlayer1?: boolean
  modelPath: string
  animationPath: string
}

export function Fighter1({ position, color, name, isPlayer1 = true, modelPath, animationPath }: FighterProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Load the GLB model
  const { scene, animations } = useGLTF(modelPath)
  
  // Get animation actions
    const animationGltf = useGLTF(animationPath);

  const { actions, mixer } = useAnimations(
    animationGltf.animations,
    groupRef
  );
  
  // const { actions, names } = useAnimations(animations, groupRef)

  // Clone scene to avoid sharing state between instances
  const clonedScene = scene.clone()

  // Apply color tint if provided
  useEffect(() => {
 //   console.log('fuck this'+animationPath)
    if (color) {
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          ;(child as THREE.Mesh).material = (child as THREE.Mesh).material.clone()
          ;((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(color)
        }
      })
    }
  }, [color, clonedScene])

  // Face the correct direction (Player 2 faces opposite)
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI
    }
  }, [isPlayer1])

  // External animation control via custom events (same as before)
 /* ---------------- ANIMATION CONTROL ---------------- */

  useEffect(() => {
    if (!actions || !mixer) return;

    const fadeTo = (
      name: string,
      loop: THREE.AnimationActionLoopStyles
    ) => {
      Object.values(actions).forEach((a) => a?.fadeOut(0.2));

      const action = actions[name];
      if (!action) {
        console.warn(`Missing animation: ${name}`);
        return;
      }

      action.reset().fadeIn(0.2).setLoop(loop, Infinity).play();
      return action;
    };

    const playOnce = (name: string) => {
      const action = fadeTo(name, THREE.LoopOnce);
      if (!action) return;

      action.clampWhenFinished = true;

      const onFinish = () => {
        fadeTo("Idle", THREE.LoopRepeat);
        mixer.removeEventListener("finished", onFinish);
      };

      mixer.addEventListener("finished", onFinish);
    };

    /* ---- EVENTS ---- */

    const onIdle = () => fadeTo("Idle", THREE.LoopRepeat);
    const onWalk = () => fadeTo("Walk", THREE.LoopRepeat);
    const onPunch = () => playOnce("Punch");
    const onKick = () => playOnce("Kick");
    const onHit = () => playOnce("Hit");
    const onBlock = () => fadeTo("Block", THREE.LoopRepeat);

    window.addEventListener(`${name}-idle`, onIdle);
    window.addEventListener(`${name}-walk`, onWalk);
    window.addEventListener(`${name}-punch`, onPunch);
    window.addEventListener(`${name}-kick`, onKick);
    window.addEventListener(`${name}-hit`, onHit);
    window.addEventListener(`${name}-block`, onBlock);

    // Start idle
    fadeTo("Idle", THREE.LoopRepeat);

    return () => {
      window.removeEventListener(`${name}-idle`, onIdle);
      window.removeEventListener(`${name}-walk`, onWalk);
      window.removeEventListener(`${name}-punch`, onPunch);
      window.removeEventListener(`${name}-kick`, onKick);
      window.removeEventListener(`${name}-hit`, onHit);
      window.removeEventListener(`${name}-block`, onBlock);
    };
  }, [actions, mixer, name]);

  return (
    <group ref={groupRef} position={position} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}
