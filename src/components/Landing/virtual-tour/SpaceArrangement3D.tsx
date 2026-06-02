"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
import { Hall } from "./Hall";
import { SeatingLayout } from "./SeatingLayout";

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

export default function SpaceArrangement3D() {
  return (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#c69c6d]/30 relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={50} />
        <OrbitControls maxPolarAngle={Math.PI / 2.1} makeDefault />
        
        <Suspense fallback={<Loader />}>
          <Hall />
          <SeatingLayout />
          
          <ContactShadows 
            opacity={0.4} 
            scale={60} 
            blur={1} 
            far={10} 
            resolution={256} 
            color="#000000" 
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
