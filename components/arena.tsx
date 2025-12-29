"use client"

export function Arena() {
  return (
    <group>
      {/* Fighting Stage */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[10, 0.2, 6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Stage Border - Left */}
      <mesh position={[-5, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.6, 6]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>

      {/* Stage Border - Right */}
      <mesh position={[5, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.6, 6]} />
        <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Stage Border - Back */}
      <mesh position={[0, 0.3, -3]}>
        <boxGeometry args={[10, 0.6, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Stage Border - Front */}
      <mesh position={[0, 0.3, 3]}>
        <boxGeometry args={[10, 0.6, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
