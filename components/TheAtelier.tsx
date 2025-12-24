import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshTransmissionMaterial, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Augment React JSX namespace to include R3F intrinsic elements
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      torusKnotGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

// Also augment global JSX for wider compatibility
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      torusKnotGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

const MaterialSphere = ({ materialType }: { materialType: 'obsidian' | 'chrome' | 'glass' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  const config = useMemo(() => {
    switch (materialType) {
        case 'obsidian':
            return {
                transmission: 0,
                roughness: 0.1,
                metalness: 0.8,
                color: '#1a1a1a',
                thickness: 0,
                ior: 1.5,
                chromaticAberration: 0
            };
        case 'chrome':
             return {
                transmission: 0.2,
                roughness: 0.05,
                metalness: 1,
                color: '#ffffff',
                thickness: 2,
                ior: 1.2,
                chromaticAberration: 0.2
            };
        case 'glass':
            return {
                transmission: 1,
                roughness: 0.1,
                metalness: 0,
                color: '#ffffff',
                thickness: 4,
                ior: 1.5,
                chromaticAberration: 0.04
            };
    }
  }, [materialType]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <MeshTransmissionMaterial 
                backside
                backsideThickness={1}
                resolution={1024}
                {...config}
            />
        </mesh>
    </Float>
  );
};

export const TheAtelier: React.FC = () => {
  const [activeMaterial, setActiveMaterial] = useState<'obsidian' | 'chrome' | 'glass'>('obsidian');

  return (
    <div className="w-full h-screen bg-[#050505] relative">
      <div className="absolute top-24 left-8 md:left-24 z-10 pointer-events-none">
         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-white mb-2"
         >
            The Atelier
         </motion.h2>
         <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs uppercase tracking-widest text-neutral-500"
         >
            Material Exploration Lab
         </motion.p>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
         <ambientLight intensity={0.5} />
         <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
         <pointLight position={[-10, -10, -10]} intensity={0.5} />
         
         <MaterialSphere materialType={activeMaterial} />
         
         <Environment preset="city" />
         <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
         <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      {/* Configurator UI */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center z-10">
         <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-2 flex gap-2">
            {(['obsidian', 'chrome', 'glass'] as const).map((mat) => (
                <button
                    key={mat}
                    onClick={() => setActiveMaterial(mat)}
                    className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
                        activeMaterial === mat 
                        ? 'bg-white text-black font-medium' 
                        : 'text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                    {mat}
                </button>
            ))}
         </div>
      </div>
    </div>
  );
};