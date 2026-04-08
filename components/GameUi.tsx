import { Text } from '@react-three/drei';

interface GameUIProps {
  player1Health: number; // 0 → 1
  player2Health: number; // 0 → 1
  time: number;
}

export default function GameUI({ player1Health, player2Health, time }: GameUIProps) {
  return (
    <group position={[0, 4, -6]}>
      
      {/* TIMER */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {Math.ceil(time)}
      </Text>

      {/* PLAYER 1 HEALTH */}
      <group position={[-3, 0, 0]}>
        {/* background */}
        <mesh>
          <planeGeometry args={[3, 0.4]} />
          <meshBasicMaterial color="black" />
        </mesh>

        {/* health */}
        <mesh position={[-(1.5 - player1Health * 1.5), 0, 0.01]}>
          <planeGeometry args={[3 * player1Health, 0.3]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>

      {/* PLAYER 2 HEALTH */}
      <group position={[3, 0, 0]}>
        {/* background */}
        <mesh>
          <planeGeometry args={[3, 0.4]} />
          <meshBasicMaterial color="black" />
        </mesh>

        {/* health (shrinks from right side) */}
        <mesh position={[(1.5 - player2Health * 1.5), 0, 0.01]}>
          <planeGeometry args={[3 * player2Health, 0.3]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </group>

    </group>
  );
}
