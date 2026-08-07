"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, useGLTF } from "@react-three/drei";


// ============================
// 3D MODEL LOADER
// ============================

function Model({
  url,
  position,
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  scale?: number;
}) {

  const { scene } = useGLTF(url);

  return (
    <primitive
      object={scene}
      position={position}
      scale={scale}
    />
  );
}


// ============================
// SCENE
// ============================

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
      />


      <Sky />


      {/* CHARACTER */}
      <Model
        url="/models/punchingbag.glb"
        position={[0, 0, 0]}
        scale={1}
      />


      {/* PUNCHING BAG */}
      <Model
        url="/models/ken.glb"
        position={[2, 0, 0]}
        scale={1}
      />


      <OrbitControls />
    </>
  );
}


// ============================
// 404 PAGE
// ============================

export default function Custom404() {

  useEffect(() => {

    const originalMargin = document.body.style.margin;

    document.body.style.margin = "0";


    return () => {
      document.body.style.margin = originalMargin;
    };

  }, []);


  return (
    <main
      style={{
        width:"100vw",
        height:"100vh",
        overflow:"hidden",
        position:"relative",
        background:"#000",
      }}
    >


      {/* 3D WORLD */}
      <div
        style={{
          position:"absolute",
          inset:0,
          zIndex:1,
        }}
      >

        <Canvas
          camera={{
            position:[0,2,6],
            fov:45
          }}
        >

          <Scene />

        </Canvas>

      </div>



      {/* FRONT TEXT */}
      <div
        style={{
          position:"relative",
          zIndex:2,
          height:"100%",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          alignItems:"center",
          color:"#fff",
        }}
      >

        <h1
          style={{
            fontSize:"10rem",
            margin:0,
          }}
        >
          404
        </h1>


        <p>
          Page not found
        </p>


        <Link
          href="/"
          style={{
            marginTop:"20px",
            padding:"12px 30px",
            background:"#fff",
            color:"#000",
            borderRadius:"15px",
            textDecoration:"none",
          }}
        >
          Go Home
        </Link>

      </div>

    </main>
  );
}



// preload models
useGLTF.preload("../../public/models/punchingbag.glb");
useGLTF.preload("../../public/models/ken.glb");