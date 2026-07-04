import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Blob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ mouse, clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.15 + mouse.x * 0.5;
    ref.current.rotation.x = mouse.y * 0.3;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere ref={ref} args={[1.4, 128, 128]}>
        <MeshDistortMaterial
          color="#ff7a3d"
          emissive="#ff5722"
          emissiveIntensity={0.35}
          distort={0.45}
          speed={1.6}
          roughness={0.15}
          metalness={0.85}
        />
      </Sphere>
    </Float>
  );
}

export function Hero3D() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffd4a3" />
      <pointLight position={[-4, -2, -3]} intensity={2} color="#ff4d2e" />
      <pointLight position={[3, 3, 2]} intensity={1.5} color="#ffb56b" />
      <Blob />
    </Canvas>
  );
}
