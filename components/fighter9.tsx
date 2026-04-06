import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export type Direction = "left" | "right" | "forward" | "back" | "stop" | null;
export type FighterAction =
  | "idle"
  | "walk"
  | "punch"
  | "kick"
  | "block"
  | "hit"
  | "fightstance";

interface FighterProps {
  name: string;
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];     // ← Added: dynamic rotation from parent
  isPlayer1?: boolean;
  direction: Direction;
  action: FighterAction;
}

export function Fighter({
  name,
  modelPath,
  position,
  rotation,           // ← New prop
  isPlayer1 = true,
  direction,
  action,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null);

  /* ---------- LOAD MODEL ---------- */
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, groupRef);

  /* ---------- STATE ---------- */
  const [currentAction, setCurrentAction] = useState<FighterAction>("fightstance");

  /* ---------- DEBUG: LOG AVAILABLE ANIMATIONS ---------- */
  useEffect(() => {
    if (!actions) return;
    console.log(`[${name}] Available animations:`, Object.keys(actions));
  }, [actions, name]);

  /* ---------- APPLY POSITION & ROTATION EVERY FRAME ---------- */
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Update position from props (parent controls movement)
    groupRef.current.position.set(...position);

    // Update rotation to face the opponent (if provided)
    if (rotation) {
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  /* ---------- ANIMATION STATE MACHINE ---------- */
  useEffect(() => {
    if (!actions || !mixer) return;
    if (currentAction === action) return;

    // Fade out all current animations
    Object.values(actions).forEach((a) => a?.fadeOut(0.2));

    const playAnimation = (
      animName: string,
      loop: THREE.AnimationActionLoopStyles = THREE.LoopRepeat,
      clamp = false
    ) => {
      const anim = actions[animName];
      if (!anim) {
        console.warn(`[${name}] Animation "${animName}" not found`);
        return;
      }
      anim.reset();
      anim.setLoop(loop, loop === THREE.LoopOnce ? 1 : Infinity);
      anim.fadeIn(0.2);
      anim.play();
      anim.clampWhenFinished = clamp;
    };

    switch (action) {
      case "fightstance":
        playAnimation("fightstance");
        break;
      case "idle":
        playAnimation("idle");
        break;
      case "walk":
        playAnimation("Walk");
        break;
      case "punch":
        playAnimation("punch", THREE.LoopOnce, true);
        break;
      case "kick":
        playAnimation("kick", THREE.LoopOnce, true);
        break;
      case "block":
        playAnimation("Block");
        break;
      case "hit":
        playAnimation("Hit", THREE.LoopOnce, true);
        break;
      default:
        playAnimation("fightstance");
    }

    setCurrentAction(action);
  }, [action, actions, mixer, name]);

  /* ---------- AUTO RETURN TO FIGHT STANCE AFTER ONE-SHOT ANIMATIONS ---------- */
  useEffect(() => {
    if (!mixer) return;

    const onFinish = () => {
      setCurrentAction("fightstance");
    };

    mixer.addEventListener("finished", onFinish);
    return () => mixer.removeEventListener("finished", onFinish);
  }, [mixer]);

  /* ---------- INITIAL DEFAULT ANIMATION ---------- */
  useEffect(() => {
    if (actions?.fightstance) {
      actions.fightstance
        .reset()
        .setLoop(THREE.LoopRepeat, Infinity)
        .fadeIn(0.3)
        .play();
    }
  }, [actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
