'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface Character {
  id: string;
  name: string;
  portrait: string;
  model?: string;
  animelist?: string;
}

const LOOP_DURATION = 2.5;

/* ──────────────────────────────────────────────── */
/*  3D PREVIEW COMPONENT (unchanged but cleaned)    */
/* ──────────────────────────────────────────────── */
function AnimatedPreview({ modelUrl, animationUrl }: { modelUrl: string; animationUrl?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const animSource = animationUrl ?? modelUrl;

  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const animGltf = useGLTF(animSource);
  const { actions, mixer } = useAnimations(animGltf.animations, groupRef);

  const actionNames = useMemo(() => Object.keys(actions), [actions]);

  const [index, setIndex] = useState(0);
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mixer || !actions || actionNames.length === 0) return;

    const currentName = actionNames[index];
    const action = actions[currentName];
    if (!action) return;

    Object.values(actions).forEach((a) => a?.fadeOut(0.2));
    action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.2).play();

    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    loopTimeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % actionNames.length);
    }, LOOP_DURATION * 1000);

    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [mixer, actions, actionNames, index]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

/* ──────────────────────────────────────────────── */
/*  MAIN CHARACTER SELECTOR                         */
/* ──────────────────────────────────────────────── */
export default function CharacterSelector() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch characters
  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch('/api/characters');
        if (!res.ok) throw new Error('Failed to load characters');
        const data: Character[] = await res.json();
        setCharacters(data);
      } catch (err) {
        setError('Could not load characters. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-3xl">Loading fighters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-3xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      {/* HEADER */}
      <div className="pt-8 pb-6 text-center">
        <h1 className="text-5xl font-black tracking-tighter">SELECT YOUR FIGHTER</h1>
        <p className="mt-2 text-white/60">10 LEGENDS • TOUCH TO CHOOSE</p>
      </div>

      {/* SELECTED PREVIEW – OVER THE GRID */}
      {selectedCharacter && (
        <div className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 via-gray-900 to-transparent pt-4 pb-6 px-4">
          <div className="max-w-2xl mx-auto bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* 3D Model */}
            <div className="relative aspect-[16/10] bg-black">
              {selectedCharacter.model && (
                <Canvas camera={{ position: [0, 1.4, 4], fov: 45 }} className="w-full h-full">
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[5, 8, 5]} intensity={1.2} />
                  <Suspense
                    fallback={
                      <mesh>
                        <boxGeometry args={[1.5, 1.5, 1.5]} />
                        <meshStandardMaterial color="#444" />
                      </mesh>
                    }
                  >
                    <AnimatedPreview
                      modelUrl={selectedCharacter.model}
                      animationUrl={selectedCharacter.animelist}
                    />
                    <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.4} />
                  </Suspense>
                </Canvas>
              )}
            </div>

            {/* Name + FIGHT Button */}
            <div className="p-6 flex items-center justify-between bg-gray-900">
              <div>
                <p className="text-3xl font-bold">{selectedCharacter.name}</p>
                <p className="text-white/50 text-sm">READY TO FIGHT</p>
              </div>

              <Link href={`/game?p1=${selectedCharacter.id}`}>
                <button className="px-10 py-4 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-2xl font-black rounded-2xl shadow-lg">
                  FIGHT!
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CHARACTER GRID – SQUARE CARDS, ROWS OF 4 */}
      <div className="px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {characters.map((char) => {
            const isSelected = selectedCharacter?.id === char.id;

            return (
              <div
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`group relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-yellow-400 scale-105 shadow-2xl shadow-yellow-500/30'
                    : 'border-transparent hover:border-white/30 hover:scale-[1.03]'
                }`}
              >
                {/* Square Image – crops bottom if portrait is taller */}
                <div className="relative w-full h-full">
                  <Image
                    src={char.portrait}
                    alt={char.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

                  {/* Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <p
                      className={`font-bold text-lg tracking-wider transition-all ${
                        isSelected ? 'text-yellow-400' : 'text-white group-hover:text-yellow-300'
                      }`}
                    >
                      {char.name}
                    </p>
                  </div>

                  {/* Selected ring */}
                  {isSelected && (
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-2xl pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="text-center mt-10 text-white/40 text-sm">
        Tap any fighter to preview • 10 characters available
      </div>
    </div>
  );
}