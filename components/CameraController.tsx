import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

export default function CameraController({ player1Position, player2Position }) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const currentPosition = useRef(new Vector3());

  useFrame(() => {
    // Player positions as Vector3 for easier math
    const p1 = new Vector3(...player1Position);
    const p2 = new Vector3(...player2Position);

    // --- Step 1: Compute midpoint ---
    const midpoint = new Vector3()
      .addVectors(p1, p2)
      .multiplyScalar(0.5);

    // Add a little height offset so we're not looking exactly at ground level
    midpoint.y += 1.0;

    // --- Step 2: Compute distance between players ---
    const dx = p1.x - p2.x;
    const dz = p1.z - p2.z;
    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

    // --- Step 3: Get direction perpendicular to the line between players ---
    // This gives us a side-view instead of top-down/back view
    const direction = new Vector3(dx, 0, dz).normalize();
    const perpendicular = new Vector3(-direction.z, 0, direction.x); // rotate 90° on Y axis

    // --- Step 4: Set target camera position ---
    const desiredDistance = Math.max(horizontalDistance * 1.1, 8); // minimum distance

    targetPosition.current
      .copy(midpoint)
      .add(perpendicular.multiplyScalar(desiredDistance))   // move to the side
      .add(new Vector3(0, desiredDistance * 0.55, 0));       // add height (adjust 0.55 as needed)

    // --- Step 5: Smooth camera movement ---
    currentPosition.current.lerp(targetPosition.current, 0.08); // 0.08–0.12 feels nice
    camera.position.copy(currentPosition.current);

    // --- Step 6: Look at midpoint ---
    camera.lookAt(midpoint);
  });

  return null;
}
