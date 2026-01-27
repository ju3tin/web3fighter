"use client";

import { useRef, useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface FighterProps {
  position: [number, number, number];
  name: string;
  isPlayer1?: boolean;
  modelPath: string;        // e.g. "/models/fighter.glb"
  animationPath: string;    // e.g. "/animation/1.glb"
}

export function Fighter1({
  position,
  name,
  isPlayer1 = true,
  modelPath,
  animationPath,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null);

  /* ---------------- LOAD MODEL ---------------- */

  const modelGltf = useGLTF(modelPath);
  const clonedScene = useMemo(
    () => modelGltf.scene.clone(true),
    [modelGltf.scene]
  );

  /* ---------------- LOAD ANIMATIONS ---------------- */

  const animationGltf = useGLTF(animationPath);

  const { actions, mixer } = useAnimations(
    animationGltf.animations,
    groupRef
  );

  /* ---------------- FACE DIRECTION ---------------- */

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = isPlayer1 ? 0 : Math.PI;
    }
  }, [isPlayer1]);

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

  /* ---------------- RENDER ---------------- */

  return (
    <group ref={groupRef} position={position}>
      <primitive object={clonedScene} />
    </group>
  );
}

/* ---------------- PRELOAD ---------------- */


