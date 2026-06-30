import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap-init";

interface AgentNode {
  name: string;
}

function Node({
  position,
  label,
  color,
  group,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  group: React.RefObject<THREE.Group>;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(({ camera }) => {
    if (!ref.current || !group.current) return;
    // world position for depth-based scale/opacity
    const world = new THREE.Vector3();
    ref.current.getWorldPosition(world);
    const dist = camera.position.distanceTo(world);
    const k = THREE.MathUtils.clamp(1.6 - (dist - 2.2) * 0.35, 0.55, 1.3);
    ref.current.scale.setScalar(k);
    if (labelRef.current) {
      labelRef.current.style.opacity = String(THREE.MathUtils.clamp((k - 0.55) / 0.75, 0.2, 1));
      labelRef.current.style.transform = `translate(-50%, -50%) scale(${0.7 + k * 0.3})`;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            transmission={0.4}
            thickness={0.5}
            roughness={0.15}
            metalness={0.2}
            clearcoat={1}
          />
        </mesh>
        <Html center distanceFactor={8} zIndexRange={[10, 0]} pointerEvents="none">
          <div
            ref={labelRef}
            className="pointer-events-none whitespace-nowrap font-display text-[10px] font-black uppercase tracking-[0.18em] text-white/85"
            style={{ textShadow: "0 0 8px rgba(0,0,0,0.8)" }}
          >
            {label}
          </div>
        </Html>
      </Float>
    </group>
  );
}

function Center({ label, color }: { label: string; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const reduce = prefersReducedMotion();
  useFrame((state) => {
    if (reduce || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
  });
  return (
    <group>
      <Sphere ref={ref} args={[0.55, 48, 48]}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          transmission={0.2}
          roughness={0.1}
          metalness={0.4}
          clearcoat={1}
        />
      </Sphere>
      <Html center>
        <div
          className="pointer-events-none rounded-full px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.22em] text-white/90"
          style={{ textShadow: "0 0 12px rgba(0,0,0,0.9)" }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function PulsingLines({
  positions,
  color,
}: {
  positions: [number, number, number][];
  color: string;
}) {
  const reduce = prefersReducedMotion();
  const matsRef = useRef<THREE.LineBasicMaterial[]>([]);
  useFrame((state) => {
    if (reduce) return;
    const t = state.clock.elapsedTime;
    matsRef.current.forEach((m, i) => {
      if (!m) return;
      m.opacity = 0.15 + (Math.sin(t * 2 + i * 0.7) * 0.5 + 0.5) * 0.5;
    });
  });
  return (
    <>
      {positions.map((p, i) => (
        <Line
          key={i}
          points={[[0, 0, 0], p]}
          color={color}
          lineWidth={1}
          transparent
          opacity={0.3}
          ref={(l: THREE.Line | null) => {
            if (l) matsRef.current[i] = l.material as THREE.LineBasicMaterial;
          }}
        />
      ))}
    </>
  );
}

function Swarm({ nodes, color, centerLabel }: { nodes: AgentNode[]; color: string; centerLabel: string }) {
  const group = useRef<THREE.Group>(null!);
  const reduce = prefersReducedMotion();

  const points = useMemo(() => {
    return nodes.map((_, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const tilt = ((i % 3) - 1) * 0.35;
      const r = 2.1;
      return [Math.cos(angle) * r, tilt + Math.sin(angle * 2) * 0.2, Math.sin(angle) * r] as [
        number,
        number,
        number,
      ];
    });
  }, [nodes]);

  useFrame((_, dt) => {
    if (reduce || !group.current) return;
    group.current.rotation.y += dt * 0.18;
    group.current.rotation.x = Math.sin(performance.now() * 0.0002) * 0.15;
  });

  return (
    <>
      <Center label={centerLabel} color={color} />
      <group ref={group}>
        <PulsingLines positions={points} color={color} />
        {nodes.map((n, i) => (
          <Node key={n.name} position={points[i]} label={n.name} color={color} group={group} />
        ))}
      </group>
    </>
  );
}

export function OrbitScene({
  nodes,
  color,
  centerLabel,
  height = 380,
}: {
  nodes: AgentNode[];
  color: string;
  centerLabel: string;
  height?: number;
}) {
  return (
    <div style={{ height }} className="relative w-full">
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}22 0%, transparent 60%)`,
        }}
      />
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 1.4, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 4, 3]} intensity={2.5} color={color} />
        <pointLight position={[-3, -2, 3]} intensity={1.5} color="#F5C542" />
        <Suspense fallback={null}>
          <Swarm nodes={nodes} color={color} centerLabel={centerLabel} />
        </Suspense>
      </Canvas>
    </div>
  );
}
