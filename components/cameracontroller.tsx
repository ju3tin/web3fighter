import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

export default function CameraController({ player1Position, player2Position }) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const currentPosition = useRef(new Vector3());

  useFrame(() => {
    // --- Step 1: Compute midpoint ---
    const midpoint = new Vector3(
      (player1Position[0] + player2Position[0]) / 2,
      (player1Position[1] + player2Position[1]) / 2 + 1.0, // slightly above
      (player1Position[2] + player2Position[2]) / 2
    );

    // --- Step 2: Compute distance for zoom ---
    const dx = player1Position[0] - player2Position[0];
    const dz = player1Position[2] - player2Position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);

    // --- Step 3: Set target camera position ---
    // Camera behind the midpoint on z-axis and higher for better view
    targetPosition.current.set(
      midpoint.x,
      midpoint.y + distance * 0.6, // height adjusts with distance
      midpoint.z + distance * 1.2  // back off based on distance
    );

    // --- Step 4: Smoothly move camera ---
    currentPosition.current.lerp(targetPosition.current, 0.1); // 0.1 = smooth factor
    camera.position.copy(currentPosition.current);

    // --- Step 5: Look at midpoint ---
    camera.lookAt(midpoint);
  });

  return null;
}
