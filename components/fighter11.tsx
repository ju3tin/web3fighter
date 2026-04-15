import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import animationConfig from "./fighters.json"; // ← Import JSON

export type Direction = "left" | "right" | "forward" | "back" | "stop" | null;
export type FighterAction = keyof typeof animationConfig; // ← Auto type from JSON!

interface FighterProps {
  name: string;
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  isPlayer1?: boolean;
  direction: Direction;
  action: FighterAction;
}

export function Fighter({
  name,
  modelPath,
  position,
  rotation,
  isPlayer1 = true,
  direction,
  action,
}: FighterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, groupRef);

  const [currentAction, setCurrentAction] = useState<FighterAction>("fightstance");

  /* ---------- DEBUG ---------- */
  useEffect(() => {
    if (!actions) return;
    console.log(`[${name}] Available animations:`, Object.keys(actions));
  }, [actions, name]);

  /* ---------- POSITION & ROTATION ---------- */
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...position);
    if (rotation) {
      groupRef.current.rotation.set(...rotation);
    }
  });

  /* ---------- PLAY ANIMATION HELPER ---------- */
  const playAnimation = (config: (typeof animationConfig)[string]) => {
    const anim = actions[config.animName];
    if (!anim) {
      console.warn(`[${name}] Animation "${config.animName}" not found`);
      return;
    }

    anim.reset();
    anim.setLoop(
      config.loop === "Once" ? THREE.LoopOnce : THREE.LoopRepeat,
      config.loop === "Once" ? 1 : Infinity
    );
    anim.clampWhenFinished = config.clamp;
    anim.fadeIn(config.fadeTime).play();
  };

  /* ---------- MAIN ANIMATION LOGIC (from JSON) ---------- */
  useEffect(() => {
    if (!actions || !mixer || currentAction === action) return;

    // Fade out everything
    Object.values(actions).forEach((a) => a?.fadeOut(0.2));

    const animConfig = animationConfig[action];
    if (animConfig) {
      playAnimation(animConfig);
    } else {
      console.warn(`[${name}] No config for action: ${action}`);
      playAnimation(animationConfig.fightstance);
    }

    setCurrentAction(action);
  }, [action, actions, mixer, name]);

  /* ---------- AUTO RETURN TO FIGHT STANCE ---------- */
  useEffect(() => {
    if (!mixer) return;
    const onFinish = () => setCurrentAction("fightstance");
    mixer.addEventListener("finished", onFinish);
    return () => mixer.removeEventListener("finished", onFinish);
  }, [mixer]);

  /* ---------- INITIAL ANIMATION ---------- */
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
