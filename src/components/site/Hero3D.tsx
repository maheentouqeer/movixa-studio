import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function CinematicCore() {
  const group = useRef<THREE.Group>(null);
  const sphere = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ribbonA = useRef<THREE.Mesh>(null);
  const ribbonB = useRef<THREE.Mesh>(null);

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();
    if (!group.current) return;
    group.current.rotation.y = t * 0.16 + mouse.x * 0.38;
    group.current.rotation.x = Math.sin(t * 0.22) * 0.08 + mouse.y * 0.18;
    group.current.position.x = mouse.x * 0.18;
    group.current.position.y = mouse.y * 0.12;

    const breath = 1 + Math.sin(t * 1.25) * 0.035;
    if (sphere.current) sphere.current.scale.setScalar(breath);
    if (inner.current) inner.current.scale.setScalar(0.72 + Math.sin(t * 1.7) * 0.045);
    if (ribbonA.current) ribbonA.current.rotation.z = t * 0.23;
    if (ribbonB.current) ribbonB.current.rotation.z = -t * 0.18;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.5}>
      <group ref={group}>
        <mesh ref={ribbonA} rotation={[1.2, 0.15, 0]}>
          <torusKnotGeometry args={[1.48, 0.018, 260, 12, 2, 5]} />
          <meshPhysicalMaterial
            color="#f9d7b7"
            emissive="#ff7a34"
            emissiveIntensity={0.18}
            metalness={1}
            roughness={0.18}
            clearcoat={1}
          />
        </mesh>
        <mesh ref={ribbonB} rotation={[0.25, 1.15, 0.4]}>
          <torusKnotGeometry args={[1.18, 0.012, 220, 10, 3, 4]} />
          <meshPhysicalMaterial
            color="#d9ecff"
            emissive="#ff9f4d"
            emissiveIntensity={0.14}
            metalness={0.85}
            roughness={0.08}
            transmission={0.35}
            transparent
            opacity={0.7}
          />
        </mesh>
        <Sphere ref={sphere} args={[1.05, 160, 160]}>
          <MeshDistortMaterial
            color="#cfd9df"
            emissive="#ff7b32"
            emissiveIntensity={0.22}
            distort={0.24}
            speed={1.15}
            metalness={0.92}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.04}
            transparent
            opacity={0.82}
          />
        </Sphere>
        <Sphere ref={inner} args={[0.58, 96, 96]}>
          <meshPhysicalMaterial
            color="#ffb46a"
            emissive="#ff6b22"
            emissiveIntensity={1.6}
            roughness={0.28}
            metalness={0.15}
            transparent
            opacity={0.55}
          />
        </Sphere>
      </group>
    </Float>
  );
}

function DustField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const points = new Float32Array(520 * 3);
    for (let i = 0; i < 520; i += 1) {
      const r = 1.8 + Math.random() * 2.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
  }, []);

  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.035 + mouse.x * 0.08;
    ref.current.rotation.x = mouse.y * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffb26b" size={0.018} transparent opacity={0.48} sizeAttenuation />
    </points>
  );
}

function LightTrails() {
  return (
    <group>
      <mesh rotation={[0.9, 0.1, -0.22]} position={[0.04, 0.02, -0.08]}>
        <torusGeometry args={[1.62, 0.008, 10, 220, Math.PI * 1.55]} />
        <meshBasicMaterial color="#ff8a35" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[1.15, -0.38, 0.35]} position={[0.08, -0.02, 0.05]}>
        <torusGeometry args={[1.88, 0.006, 10, 220, Math.PI * 1.22]} />
        <meshBasicMaterial color="#ffd2a3" transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#050609", 5, 9]} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[4, 5, 4]} intensity={1.35} color="#fff2de" castShadow />
      <pointLight position={[-2.8, -1.4, 2.2]} intensity={5.2} color="#ff6b2a" />
      <pointLight position={[2.8, 1.8, -1.2]} intensity={2.6} color="#86bfff" />
      <DustField />
      <LightTrails />
      <CinematicCore />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.35} scale={4.4} blur={2.6} far={3} />
      <Environment preset="city" />
    </Canvas>
  );
}
