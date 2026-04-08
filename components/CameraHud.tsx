import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import GameUI from '@/GameUi';

export default function CameraHUD(props) {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    // Copy camera position
    groupRef.current.position.copy(camera.position);

    // Copy camera rotation
    groupRef.current.quaternion.copy(camera.quaternion);

    // Move HUD slightly in front of camera
    groupRef.current.translateZ(-5); // push forward
    groupRef.current.translateY(2);  // move up on screen
  });

  return (
    <group ref={groupRef}>
      <GameUI {...props} />
    </group>
  );
}
