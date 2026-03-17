'use client';

import { useRef,useState, useEffect, Suspense, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useSearchParams } from "next/navigation"
import CharacterSelector from '@/components/selecter';
export const dynamic = "force-dynamic";


export default function SelecterPage() {
 
  

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen bg-black text-white text-3xl font-bold">
          Loading Web3Fighter...
        </div>
      }
    >
      <CharacterSelector />
    </Suspense>
  );
}