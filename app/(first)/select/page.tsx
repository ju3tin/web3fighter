'use client';

import { useRef,useState, useEffect, Suspense, useMemo } from 'react';
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

export default function CharacterSelector() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-900 text-white relative pb-24 md:pb-32">
      {/* HEADER */}
      <div className="pt-8 pb-6 text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">SELECT YOUR FIGHTER</h1>
        <p className="mt-2 text-white/60 text-lg">10 LEGENDS • TAP TO CHOOSE</p>
      </div>

      {/* 3D PREVIEW – LEFT SIDE, BEHIND GRID */}
      {selectedCharacter?.model && (
        <div className="fixed left-0 top-0 bottom-0 w-1/3 md:w-2/5 lg:w-1/3 -z-10 opacity-40 md:opacity-60 pointer-events-none hidden md:block">
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 1.6, 5.5], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[4, 6, 4]} intensity={1} />
              <Suspense fallback={null}>
                <AnimatedPreview
                  modelUrl={selectedCharacter.model}
                  animationUrl={selectedCharacter.animelist}
                />
                <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      )}

      {/* CHARACTER GRID – SQUARES, IMAGE CROPPED FROM TOP */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {characters.map((char) => {
            const isSelected = selectedCharacter?.id === char.id;

            return (
              <div
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-gray-900 scale-[1.04] shadow-2xl shadow-yellow-500/40'
                    : 'hover:ring-2 hover:ring-white/40 hover:scale-[1.03]'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={char.portrait}
                    alt={char.name}
                    fill
                    className="object-cover object-top"  // ← Starts from top, cuts bottom if needed
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority={characters.indexOf(char) < 6} // preload first few
                  />

                  {/* Bottom overlay + name */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12">
                    <p
                      className={`text-center font-bold text-base md:text-lg tracking-wide ${
                        isSelected ? 'text-yellow-400' : 'text-white group-hover:text-yellow-300'
                      }`}
                    >
                      {char.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FIXED BOTTOM BAR – FIGHT BUTTON */}
      {selectedCharacter && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-6 pb-6 px-6 border-t border-white/10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {selectedCharacter.name}
              </p>
              <p className="text-white/60 text-sm md:text-base">Ready to fight</p>
            </div>

            <Link href={`/game?p1=${selectedCharacter.id}`}>
              <button className="px-10 md:px-16 py-5 md:py-6 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-2xl md:text-3xl font-black rounded-2xl shadow-xl shadow-red-900/40">
                FIGHT!
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Spacer to prevent grid content from being hidden under bottom bar */}
      <div className="h-32 md:h-40" />
    </div>
  );
}