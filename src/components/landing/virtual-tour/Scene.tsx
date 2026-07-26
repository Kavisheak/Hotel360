'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Hall } from './Hall';
import { SeatingLayout } from './SeatingLayout';
import { useLayoutStore } from '@/store/useLayoutStore';
import { Suspense } from 'react';

export const Scene = () => {
  const { viewMode } = useLayoutStore();

  return (
    <div className="w-full h-full bg-[#050505]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={50} />
        
        {viewMode === 'orbit' && <OrbitControls maxPolarAngle={Math.PI / 2.1} makeDefault />}
        {viewMode === 'topDown' && <OrbitControls enableRotate={false} makeDefault />}
        
        <Suspense fallback={null}>
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
};
