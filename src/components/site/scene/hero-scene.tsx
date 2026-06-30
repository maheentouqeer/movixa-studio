import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap-init";

function Core() {
  const mesh = useRef<THREE.Mesh>(null!);
  const wire = useRef<THREE.Mesh>(null!);
  const reduce = prefersReducedMotion();

  useFrame((state, dt) => {
    if (reduce) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.15;
    mesh.current.rotation.y = t * 0.2;
    wire.current.rotation.x = -t * 0.1;
    wire.current.rotation.y = -t * 0.12;
    const s = 1 + Math.sin(t * 0.8) * 0.03;
    mesh.current.scale.setScalar(s);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <Icosahedron ref={mesh} args={[1.4, 1]}>
        <meshStandardMaterial
          color="#0D7377"
          emissive="#14FFEC"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.25}
          flatShading
        />
      </Icosahedron>
      <Icosahedron ref={wire} args={[1.65, 1]}>
        <meshBasicMaterial color="#14FFEC" wireframe transparent opacity={0.18} />
      </Icosahedron>
    </Float>
  );
}

function Stars({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const reduce = prefersReducedMotion();
  useFrame((_, dt) => {
    if (reduce) return;
    ref.current.rotation.y += dt * 0.02;
    ref.current.rotation.x += dt * 0.005;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#14FFEC"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));
  useFrame(() => {
    target.current.x = pointer.x * 0.8;
    target.current.y = pointer.y * 0.5;
    camera.position.lerp(target.current, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#14FFEC" />
      <pointLight position={[-4, -3, 4]} intensity={2} color="#F5C542" />
      <pointLight position={[0, 0, -5]} intensity={1.2} color="#0D7377" />
      <Suspense fallback={null}>
        <Core />
        <Stars count={500} />
      </Suspense>
      <Rig />
    </Canvas>
  );
}
