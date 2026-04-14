import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

export default function CameraController({ player1Position, player2Position }) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const currentPosition = useRef(new Vector3());

  useFrame(() => {
    const p1 = new Vector3(...player1Position);
    const p2 = new Vector3(...player2Position);

    // Midpoint between players
    const midpoint = new Vector3()
      .addVectors(p1, p2)
      .multiplyScalar(0.5);
    midpoint.y += 1.0;

    // Horizontal distance between players
    const dx = p1.x - p2.x;
    const dz = p1.z - p2.z;
    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

    // Direction from p1 to p2
    const direction = new Vector3(dx, 0, dz).normalize();

    // Perpendicular direction — flipped to the OTHER side
    const perpendicular = new Vector3(direction.z, 0, -direction.x);   // ← This is the change

    // Desired camera distance (scales with player separation)
    const desiredDistance = Math.max(horizontalDistance * 1.15, 10);

    // Set target position: side + height
    targetPosition.current
      .copy(midpoint)
      .add(perpendicular.multiplyScalar(desiredDistance))
      .add(new Vector3(0, desiredDistance * 0.6, 0));   // height

    // Smoothly move camera
    currentPosition.current.lerp(targetPosition.current, 0.09);
    camera.position.copy(currentPosition.current);

    // Look at midpoint
    camera.lookAt(midpoint);
  });

  return null;
}
