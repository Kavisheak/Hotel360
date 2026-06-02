"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

// 10 nodes for the tour
const nodes = [
  { id: 0, name: "Entrance", position: [0, 0, 0], color: "#a8c0ff" },
  { id: 1, name: "Lobby", position: [5, 0, -5], color: "#fbc2eb" },
  { id: 2, name: "Grand Hall Center", position: [10, 0, -10], color: "#ffecd2" },
  { id: 3, name: "Dining Area", position: [15, 0, -5], color: "#fcb69f" },
  { id: 4, name: "Dance Floor", position: [15, 0, -15], color: "#cfd9df" },
  { id: 5, name: "Bar", position: [5, 0, -15], color: "#e0c3fc" },
  { id: 6, name: "Balcony Left", position: [10, 5, 0], color: "#a1c4fd" },
  { id: 7, name: "Balcony Right", position: [10, 5, -20], color: "#c2e9fb" },
  { id: 8, name: "VIP Lounge", position: [-5, 0, -10], color: "#fdcbf1" },
  { id: 9, name: "Bridal Suite", position: [-5, 5, -15], color: "#e6dee9" },
];

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-[#c69c6d] font-serif text-xl bg-black/80 px-6 py-3 rounded-lg border border-[#c69c6d]">
        Loading {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

function TourEnvironment({ currentNode, onNodeClick }: { currentNode: number, onNodeClick: (id: number) => void }) {
  const current = nodes.find(n => n.id === currentNode) || nodes[0];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* 360 Sphere background (Procedural for now) */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshStandardMaterial color={current.color} side={THREE.BackSide} roughness={1} />
      </mesh>

      {/* Navigation Nodes / Hotspots */}
      {nodes.map((node) => {
        if (node.id === currentNode) return null; // Don't show current node as a hotspot

        // Calculate relative direction from current node to this node
        const dirX = node.position[0] - current.position[0];
        const dirY = node.position[1] - current.position[1];
        const dirZ = node.position[2] - current.position[2];
        
        // Normalize direction and place hotspot at a fixed distance
        const distance = Math.sqrt(dirX*dirX + dirY*dirY + dirZ*dirZ);
        if (distance === 0) return null;
        
        const radius = 20;
        const posX = (dirX / distance) * radius;
        const posY = (dirY / distance) * radius;
        const posZ = (dirZ / distance) * radius;

        return (
          <mesh 
            key={node.id} 
            position={[posX, posY, posZ]}
            onClick={(e) => {
              e.stopPropagation();
              onNodeClick(node.id);
            }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#c69c6d" emissive="#c69c6d" emissiveIntensity={0.5} />
            <Html center position={[0, -2, 0]}>
              <div className="bg-black/70 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap border border-[#c69c6d] pointer-events-none">
                Go to {node.name}
              </div>
            </Html>
          </mesh>
        );
      })}
    </>
  );
}

export default function Tour360Viewer() {
  const [currentNode, setCurrentNode] = useState(0);

  return (
    <div className="w-full h-[600px] relative bg-black rounded-lg overflow-hidden border border-[#c69c6d]/30">
      <div className="absolute top-4 left-4 z-10 bg-black/60 p-4 rounded-lg border border-[#c69c6d]/50 backdrop-blur-md">
        <h3 className="text-[#c69c6d] font-serif text-xl mb-1">360 Virtual Tour</h3>
        <p className="text-gray-300 text-sm">Current Location: <span className="text-white font-medium">{nodes.find(n => n.id === currentNode)?.name}</span></p>
        <p className="text-gray-400 text-xs mt-2">Drag to look around. Click gold spheres to navigate.</p>
      </div>

      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={<Loader />}>
          <TourEnvironment currentNode={currentNode} onNodeClick={setCurrentNode} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            rotateSpeed={-0.5} // Invert rotation for inside-sphere feel
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
