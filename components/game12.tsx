// components/FightingGame.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FightingGame: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // --- Main Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    // --- Players ---
    const boxGeo = new THREE.BoxGeometry(1, 2, 1);
    const player1 = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    const player2 = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
    player1.position.x = -2;
    player2.position.x = 2;
    scene.add(player1, player2);

    // --- HUD Scene ---
    const hudScene = new THREE.Scene();
    const hudCamera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      0,
      10
    );
    hudCamera.position.z = 10;

    // --- Helper to create bars ---
    const createBar = (color: number, width: number, height: number) => {
      const geo = new THREE.PlaneGeometry(width, height);
      const mat = new THREE.MeshBasicMaterial({ color });
      return new THREE.Mesh(geo, mat);
    };

    const createPlayerHUD = (xScreen: number, yScreen: number) => {
      const healthBar = createBar(0xff0000, 200, 20);
      const staminaBar = createBar(0x0000ff, 200, 10);
      staminaBar.position.y = -15;
      const group = new THREE.Group();
      group.add(healthBar);
      group.add(staminaBar);
      group.position.set(xScreen, yScreen, 0);
      hudScene.add(group);
      return { group, healthBar, staminaBar };
    };

    const player1HUD = createPlayerHUD(-200, 200);
    const player2HUD = createPlayerHUD(200, 200);

    // --- Countdown Timer ---
    const timerCanvas = document.createElement('canvas');
    timerCanvas.width = 128;
    timerCanvas.height = 64;
    const timerContext = timerCanvas.getContext('2d')!;
    const timerTexture = new THREE.CanvasTexture(timerCanvas);
    const timerMaterial = new THREE.MeshBasicMaterial({ map: timerTexture, transparent: true });
    const timerPlane = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), timerMaterial);
    timerPlane.position.set(0, 250, 0);
    hudScene.add(timerPlane);

    let countdown = 60;
    const updateTimerTexture = () => {
      timerContext.clearRect(0, 0, 128, 64);
      timerContext.fillStyle = 'white';
      timerContext.font = '48px Arial';
      timerContext.textAlign = 'center';
      timerContext.fillText(countdown.toString(), 64, 48);
      timerTexture.needsUpdate = true;
    };

    const timerInterval = setInterval(() => {
      countdown--;
      if (countdown < 0) countdown = 0;
      updateTimerTexture();
    }, 1000);

    // --- Animate ---
    const animate = () => {
      requestAnimationFrame(animate);

      // Simple rotation for demo
      player1.rotation.y += 0.01;
      player2.rotation.y -= 0.01;

      renderer.autoClear = true;
      renderer.render(scene, camera);

      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(hudScene, hudCamera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      clearInterval(timerInterval);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default FightingGame;
