"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html, useProgress, useGLTF } from "@react-three/drei";
import { Hall } from "./Hall";
import { SeatingLayout } from "./SeatingLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

// Dynamically renders an uploaded .glb model
function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function SpaceArrangement3D() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchModelUrl = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/public/virtual-config`);
        if (res.ok) {
          const data = await res.json();
          // Only use the modelUrl if it is a non-empty string
          if (data.success && data.modelUrl && data.modelUrl.trim() !== "") {
            // Prefix the backend base URL for relative paths (e.g. /uploads/models/...)
            const fullUrl = data.modelUrl.startsWith("http")
              ? data.modelUrl
              : `${API_BASE}${data.modelUrl}`;
            setModelUrl(fullUrl);
          }
        }
      } catch {
        // Silent failure — falls back to coded Hall
      } finally {
        setFetched(true);
      }
    };
    fetchModelUrl();
  }, []);

  // Don't render the canvas until we've checked for a model URL,
  // to avoid a flash of the coded hall before the GLB loads
  if (!fetched) return null;

  return (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#c69c6d]/30 relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={50} />
        <OrbitControls maxPolarAngle={Math.PI / 2.1} makeDefault />

        <Suspense fallback={<Loader />}>
          {modelUrl ? (
            // Admin has uploaded a real .glb — render it
            <GlbModel url={modelUrl} />
          ) : (
            // No uploaded model yet — render the procedural hall (no change for users)
            <>
              <Hall />
              <SeatingLayout />
            </>
          )}

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
