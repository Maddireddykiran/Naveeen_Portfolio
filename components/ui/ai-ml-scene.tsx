// @ts-nocheck
"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Stars, 
  useProgress, 
  Html, 
  MeshDistortMaterial, 
  Sphere, 
  Ring,
  Float
} from "@react-three/drei";
import * as THREE from "three";

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          {progress.toFixed(0)}% loaded
        </p>
      </div>
    </Html>
  );
}

// Neural Node
function NeuralNode({ position, color, size, pulse }) {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Pulse effect
      meshRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * pulse) * 0.1);
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.5} 
        metalness={0.8} 
        roughness={0.2} 
      />
    </mesh>
  );
}

// Data Flow Line
function DataFlowLine({ start, end, color }) {
  const lineRef = useRef();
  
  useEffect(() => {
    if (!lineRef.current) return;
    
    const points = [];
    points.push(new THREE.Vector3(...start));
    
    // Create a slight curve
    const midPoint = new THREE.Vector3(
      (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 0.3,
      (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 0.3,
      (start[2] + end[2]) / 2 + (Math.random() - 0.5) * 0.3
    );
    points.push(midPoint);
    points.push(new THREE.Vector3(...end));
    
    // Check for NaN values in points
    const hasNaN = points.some(point => 
      isNaN(point.x) || isNaN(point.y) || isNaN(point.z)
    );
    
    if (hasNaN) return; // Skip if any NaN values
    
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(50);
    
    // Additional check for valid points
    if (curvePoints.length === 0 || curvePoints.some(point => 
      isNaN(point.x) || isNaN(point.y) || isNaN(point.z)
    )) return;
    
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    
    if (lineRef.current) {
      lineRef.current.geometry = geometry;
      
      // Ensure material is properly computed
      if (lineRef.current.material) {
        lineRef.current.material.needsUpdate = true;
        lineRef.current.computeLineDistances();
      }
    }
  }, [start, end]);

  useFrame(({ clock }) => {
    if (lineRef.current && lineRef.current.material) {
      // Pulse dash offset for data flow effect
      lineRef.current.material.dashOffset = -clock.getElapsedTime() * 0.5;
    }
  });
  
  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineDashedMaterial 
        color={color} 
        dashSize={0.1} 
        gapSize={0.05} 
        opacity={0.8} 
        transparent
      />
    </line>
  );
}

// Data Particle
function DataParticle({ path, color, speed }) {
  const meshRef = useRef();
  const progress = useRef(Math.random());
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(...path[0]),
    new THREE.Vector3(
      (path[0][0] + path[1][0]) / 2 + (Math.random() - 0.5) * 0.3,
      (path[0][1] + path[1][1]) / 2 + (Math.random() - 0.5) * 0.3,
      (path[0][2] + path[1][2]) / 2 + (Math.random() - 0.5) * 0.3
    ),
    new THREE.Vector3(...path[1])
  ]);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Move along the curve
      progress.current = (progress.current + speed * 0.005) % 1;
      const position = curve.getPoint(progress.current);
      meshRef.current.position.copy(position);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.8} 
      />
    </mesh>
  );
}

// AI Brain Core
function AIBrainCore() {
  const coreRef = useRef();
  
  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      coreRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });
  
  return (
    <group ref={coreRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere args={[0.7, 32, 32]}>
          <MeshDistortMaterial
            color="#312e81"
            emissive="#4f46e5"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.2}
            distort={0.3}
            speed={2}
          />
        </Sphere>
      </Float>
      
      {/* Outer rings */}
      <Ring args={[1.2, 1.22, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[1.4, 1.42, 64]} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

// Advanced AI Model Component
function AdvancedAIModel() {
  // Neural nodes
  const nodes = [
    { position: [0, 0, 0], color: "#4f46e5", size: 0.5, pulse: 2.0 },
    { position: [1.2, 0.8, 0.3], color: "#8b5cf6", size: 0.15, pulse: 1.5 },
    { position: [-1.0, 0.7, 0.5], color: "#a855f7", size: 0.18, pulse: 2.2 },
    { position: [0.7, -0.9, 0.6], color: "#6366f1", size: 0.14, pulse: 1.8 },
    { position: [-0.8, -0.7, 0.4], color: "#8b5cf6", size: 0.16, pulse: 1.6 },
    { position: [0.2, 1.1, -0.5], color: "#60a5fa", size: 0.17, pulse: 2.1 },
    { position: [-0.3, -1.2, -0.3], color: "#7c3aed", size: 0.15, pulse: 1.7 },
    { position: [1.0, 0.2, -0.7], color: "#6366f1", size: 0.12, pulse: 1.9 },
    { position: [-1.2, 0.1, -0.6], color: "#8b5cf6", size: 0.13, pulse: 2.0 },
    { position: [0.5, -0.5, -0.9], color: "#60a5fa", size: 0.14, pulse: 1.6 },
    { position: [-0.6, 0.4, -1.0], color: "#a855f7", size: 0.16, pulse: 1.8 }
  ];
  
  // Data flow connections
  const connections = [
    { start: [0, 0, 0], end: [1.2, 0.8, 0.3], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [-1.0, 0.7, 0.5], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [0.7, -0.9, 0.6], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [-0.8, -0.7, 0.4], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [0.2, 1.1, -0.5], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [-0.3, -1.2, -0.3], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [1.0, 0.2, -0.7], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [-1.2, 0.1, -0.6], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [0.5, -0.5, -0.9], color: "#c4b5fd" },
    { start: [0, 0, 0], end: [-0.6, 0.4, -1.0], color: "#c4b5fd" },
    { start: [1.2, 0.8, 0.3], end: [0.2, 1.1, -0.5], color: "#93c5fd" },
    { start: [-1.0, 0.7, 0.5], end: [-1.2, 0.1, -0.6], color: "#93c5fd" },
    { start: [0.7, -0.9, 0.6], end: [0.5, -0.5, -0.9], color: "#93c5fd" },
    { start: [-0.8, -0.7, 0.4], end: [-0.3, -1.2, -0.3], color: "#93c5fd" }
  ];
  
  // Data particles
  const particles = [
    { path: [[0, 0, 0], [1.2, 0.8, 0.3]], color: "#6366f1", speed: 1.2 },
    { path: [[0, 0, 0], [-1.0, 0.7, 0.5]], color: "#7c3aed", speed: 0.9 },
    { path: [[0, 0, 0], [0.7, -0.9, 0.6]], color: "#60a5fa", speed: 1.1 },
    { path: [[0, 0, 0], [-0.8, -0.7, 0.4]], color: "#8b5cf6", speed: 1.0 },
    { path: [[0, 0, 0], [0.2, 1.1, -0.5]], color: "#6366f1", speed: 0.8 },
    { path: [[0, 0, 0], [-0.3, -1.2, -0.3]], color: "#7c3aed", speed: 1.3 },
    { path: [[0, 0, 0], [1.0, 0.2, -0.7]], color: "#60a5fa", speed: 1.0 },
    { path: [[0, 0, 0], [-1.2, 0.1, -0.6]], color: "#8b5cf6", speed: 1.2 },
    { path: [[0, 0, 0], [0.5, -0.5, -0.9]], color: "#6366f1", speed: 0.9 },
    { path: [[0, 0, 0], [-0.6, 0.4, -1.0]], color: "#7c3aed", speed: 1.1 }
  ];
  
  return (
    <group>
      {/* Brain core */}
      <AIBrainCore />
      
      {/* Neural nodes */}
      {nodes.map((node, i) => (
        <NeuralNode
          key={`node-${i}`}
          position={node.position}
          color={node.color}
          size={node.size}
          pulse={node.pulse}
        />
      ))}
      
      {/* Data flow connections */}
      {connections.map((conn, i) => (
        <DataFlowLine
          key={`conn-${i}`}
          start={conn.start}
          end={conn.end}
          color={conn.color}
        />
      ))}
      
      {/* Moving data particles */}
      {particles.map((particle, i) => (
        <DataParticle
          key={`particle-${i}`}
          path={particle.path}
          color={particle.color}
          speed={particle.speed}
        />
      ))}
    </group>
  );
}

export function AIMLScene() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl md:h-[500px] lg:h-[600px]">
      {/* Digital circuit pattern overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/20 opacity-50"></div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
      
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true }}
        className="h-full w-full"
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.15}
            penumbra={1}
            intensity={0.8}
            castShadow
            color="#a78bfa"
          />
          <spotLight
            position={[-5, -5, -5]}
            angle={0.15}
            penumbra={1}
            intensity={0.4}
            castShadow
            color="#60a5fa"
          />
          
          {/* Background stars */}
          <Stars
            radius={100}
            depth={50}
            count={1500}
            factor={4}
            saturation={0}
            fade
          />
          
          {/* Advanced AI Model */}
          <AdvancedAIModel />
          
          <Environment preset="night" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={10}
            blur={1.5}
            far={2}
            color="#4338ca"
          />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI * 3/4}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Technical labels */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-20 text-xs font-light text-white/70">
        <div className="mb-1 flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          <span>Multi-Layer Network</span>
        </div>
        <div className="mb-1 flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span>Deep Learning Nodes</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
          <span>Neural Data Flow</span>
        </div>
      </div>
      
      {/* Technical data readout overlay */}
      <div className="pointer-events-none absolute top-4 right-4 z-20 font-mono text-blue-300/70 text-xs max-w-[120px] text-right">
        <div>MODEL: NEURAL-X7</div>
        <div>STATUS: ONLINE</div>
        <div>ACCURACY: 99.7%</div>
        <div>NODES: ACTIVE</div>
      </div>
    </div>
  );
}

export default AIMLScene; 