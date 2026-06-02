"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-[#c69c6d] font-serif text-xl bg-black/80 px-6 py-3 rounded-lg border border-[#c69c6d]">
        Loading 3D Space {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// Simple procedural chair component
function Chair({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.8, -0.2]}>
        <boxGeometry args={[0.5, 0.8, 0.1]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0.2, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.2, 0.2, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.2, 0.2, 0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.2, 0.2, 0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

// Round Table for weddings
function RoundTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.05, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Pedestal */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

// Rectangle Table for meetings
function RectangleTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 0.05, 0.8]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.9, 0.4, -0.3]}>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.9, 0.4, -0.3]}>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.9, 0.4, 0.3]}>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.9, 0.4, 0.3]}>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function RoomLayout({ eventType, guestCount }: { eventType: string, guestCount: number }) {
  // Generate layouts based on event type
  const elements = useMemo(() => {
    const items = [];
    let placedGuests = 0;

    if (eventType === "Wedding" || eventType === "Birthday Party") {
      // Banquet style (Round tables)
      const guestsPerTable = 8;
      const numTables = Math.ceil(guestCount / guestsPerTable);
      
      const cols = Math.ceil(Math.sqrt(numTables));
      const spacing = 5;
      const startX = -((cols - 1) * spacing) / 2;
      const startZ = -((Math.ceil(numTables / cols) - 1) * spacing) / 2;

      let tableCount = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < Math.ceil(numTables / cols); j++) {
          if (tableCount >= numTables) break;
          
          const px = startX + i * spacing;
          const pz = startZ + j * spacing;
          
          // Add table
          items.push(<RoundTable key={`table-${tableCount}`} position={[px, 0, pz]} />);
          
          // Add chairs around table
          const guestsAtThisTable = Math.min(guestsPerTable, guestCount - placedGuests);
          for (let k = 0; k < guestsAtThisTable; k++) {
            const angle = (k / guestsAtThisTable) * Math.PI * 2;
            const radius = 1.8;
            const cx = px + Math.cos(angle) * radius;
            const cz = pz + Math.sin(angle) * radius;
            // Face the table
            const rotationY = -angle - Math.PI / 2;
            
            items.push(<Chair key={`chair-${tableCount}-${k}`} position={[cx, 0, cz]} rotation={[0, rotationY, 0]} />);
          }
          
          placedGuests += guestsAtThisTable;
          tableCount++;
        }
      }
    } else if (eventType === "Meeting") {
      // Conference / Theater style (Rows of chairs and rectangle tables)
      const chairsPerRow = Math.min(20, Math.ceil(Math.sqrt(guestCount) * 1.5));
      const rows = Math.ceil(guestCount / chairsPerRow);
      
      const spacingX = 1.2;
      const spacingZ = 1.5;
      const startX = -((chairsPerRow - 1) * spacingX) / 2;
      const startZ = 2; // Start a bit back from the "stage"
      
      // Stage / Main presentation area
      items.push(<RectangleTable key="stage-table" position={[0, 0, -3]} />);
      items.push(<Chair key="stage-chair" position={[0, 0, -4]} rotation={[0, 0, 0]} />);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < chairsPerRow; c++) {
          if (placedGuests >= guestCount) break;
          
          const px = startX + c * spacingX;
          const pz = startZ + r * spacingZ;
          
          items.push(<Chair key={`chair-meeting-${r}-${c}`} position={[px, 0, pz]} rotation={[0, Math.PI, 0]} />);
          placedGuests++;
        }
      }
    }

    return items;
  }, [eventType, guestCount]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Walls (simple boundaries) */}
      <mesh position={[0, 5, -25]}>
        <boxGeometry args={[50, 10, 1]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      <mesh position={[-25, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[50, 10, 1]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      <mesh position={[25, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[50, 10, 1]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      {/* Generated Layout */}
      {elements}
    </>
  );
}

export default function SpaceArrangement3D({ eventType = "Wedding", guestCount = 50 }: { eventType?: string, guestCount?: number }) {
  return (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#c69c6d]/30 relative">
      <div className="absolute top-4 left-4 z-10 bg-black/60 p-4 rounded-lg border border-[#c69c6d]/50 backdrop-blur-md">
        <h3 className="text-[#c69c6d] font-serif text-xl mb-1">3D Space Viewer</h3>
        <p className="text-gray-300 text-sm">Mode: <span className="text-white font-medium">{eventType}</span></p>
        <p className="text-gray-300 text-sm">Guests: <span className="text-white font-medium">{guestCount}</span></p>
        <p className="text-gray-400 text-xs mt-2">Scroll to zoom. Drag to rotate.</p>
      </div>

      <Canvas camera={{ position: [0, 15, 20], fov: 45 }} shadows>
        <Suspense fallback={<Loader />}>
          <RoomLayout eventType={eventType} guestCount={guestCount} />
          <OrbitControls 
            target={[0, 0, 0]}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2 - 0.1} // Prevent looking below ground
            minDistance={5}
            maxDistance={40}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
