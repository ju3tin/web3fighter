// components/Fighter.tsx
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export type Direction = "left" | "right" | "forward" | "back" | "stop" | null;

export interface AnimationConfigEntry {
  animName: string;
  loop?: "Once" | "Repeat";
  clamp?: boolean;
  fadeTime?: number;
  weight?: number;
  priority?: number;
}

type AnimationConfig = Record<string, AnimationConfigEntry>;

interface FighterProps {
  name: string;
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  action: string;
  fighterType: string;        // ← "ryu", "ken", "chunli", etc.
}

export function Fighter({ name, modelPath, position, rotation, action, fighterType }: FighterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, groupRef);

  const [config, setConfig] = useState<AnimationConfig>({});
  const [currentAction, setCurrentAction] = useState("fightstance");
  const [loading, setLoading] = useState(true);

  // Fetch config from our Next.js API
  useEffect(() => {
    fetch(`/api/animation-config/${fighterType}`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Failed to load config for ${fighterType}`, err);
        setLoading(false);
      });
  }, [fighterType]);

  // Rest of your animation logic (same as before, slightly cleaned)
  const playAnimation = (actionName: string) => {
    const animConfig = config[actionName] || config.fightstance;
    if (!animConfig) return;

    const anim = actions[animConfig.animName];
    if (!anim) return;

    anim.reset()
      .setLoop(animConfig.loop === "Once" ? THREE.LoopOnce : THREE.LoopRepeat, 
               animConfig.loop === "Once" ? 1 : Infinity)
      .setEffectiveWeight(animConfig.weight ?? 1)
      .clampWhenFinished = animConfig.clamp ?? true;

    anim.fadeIn(animConfig.fadeTime ?? 0.25).play();
  };

  useEffect(() => {
    if (loading || !actions || currentAction === action) return;

    Object.values(actions).forEach(a => a?.fadeOut(0.2));
    playAnimation(action);
    setCurrentAction(action);
  }, [action, actions, config, loading]);

  // Initial stance
  useEffect(() => {
    if (actions.fightstance && !loading) {
      actions.fightstance.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();
    }
  }, [actions, loading]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      if (rotation) groupRef.current.rotation.set(...rotation);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
