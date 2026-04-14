import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

export default function CameraController({ player1Position, player2Position }) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const currentPosition = useRef(new Vector3());
  const currentSide = useRef(1); // 1 or -1, remembers which side we're on

  useFrame(() => {
    const p1 = new Vector3(...player1Position);
    const p2 = new Vector3(...player2Position);

    const midpoint = new Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    midpoint.y += 1.0;

    const dx = p1.x - p2.x;
    const dz = p1.z - p2.z;
    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

    if (horizontalDistance < 0.1) return; // avoid division by zero / jitter

    // Direction from p1 to p2
    const direction = new Vector3(dx, 0, dz).normalize();

    // Two possible perpendiculars
    const perp1 = new Vector3(direction.z, 0, -direction.x); // one side
    const perp2 = new Vector3(-direction.z, 0, direction.x); // opposite side

    // Desired distance
    const desiredDistance = Math.max(horizontalDistance * 1.2, 12);

    // === Smart side selection ===
    const idealTarget1 = new Vector3()
      .copy(midpoint)
      .add(perp1.multiplyScalar(desiredDistance))
      .add(new Vector3(0, desiredDistance * 0.65, 0));

    const idealTarget2 = new Vector3()
      .copy(midpoint)
      .add(perp2.multiplyScalar(desiredDistance))
      .add(new Vector3(0, desiredDistance * 0.65, 0));

    // Choose the side closest to current camera position (prevents sudden flips)
    const distTo1 = currentPosition.current.distanceTo(idealTarget1);
    const distTo2 = currentPosition.current.distanceTo(idealTarget2);

    let chosenTarget = distTo1 < distTo2 ? idealTarget1 : idealTarget2;
    let chosenSide = distTo1 < distTo2 ? 1 : -1;

    // Optional: add some hysteresis so it doesn't flip too easily when players are close
    if (horizontalDistance < 8 && Math.abs(currentSide.current - chosenSide) === 2) {
      chosenTarget = currentSide.current === 1 ? idealTarget1 : idealTarget2;
    } else {
      currentSide.current = chosenSide;
    }

    targetPosition.current.copy(chosenTarget);

    // Smooth follow
    currentPosition.current.lerp(targetPosition.current, 0.1); // 0.08–0.12 feels good

    camera.position.copy(currentPosition.current);
    camera.lookAt(midpoint);
  });

  return null;
}
