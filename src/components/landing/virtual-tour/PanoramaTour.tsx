"use client";

import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { Maximize2, Minimize2, Plus, Minus, RotateCcw, ChevronUp, ChevronDown, X, Compass } from "lucide-react";

// ─── Scene Configuration ────────────────────────────────────────────────
interface Hotspot {
  /** Target scene id */
  target: string;
  /** Label shown on hover */
  label: string;
  /** Horizontal angle (yaw) in degrees from -180 to 180 */
  yaw: number;
  /** Vertical angle (pitch) in degrees from -90 to 90 */
  pitch: number;
}

interface Scene {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  hotspots: Hotspot[];
  /** Default horizontal look angle (degrees, 0 = center) */
  defaultYaw?: number;
}

// Updated scenes with yaw/pitch coordinates instead of 2D screen percentages
const scenes: Scene[] = [
  {
    id: "entrance",
    name: "Main Entrance",
    image: "/tour/entrance.png",
    thumbnail: "/tour/entrance.png",
    defaultYaw: 0,
    hotspots: [
      { target: "grand-hall", label: "Grand Hall", yaw: 0, pitch: -10 },
      { target: "outdoor-garden", label: "Outdoor Garden", yaw: -90, pitch: -5 },
    ],
  },
  {
    id: "grand-hall",
    name: "Grand Hall Center",
    image: "/tour/grand-hall.png",
    thumbnail: "/tour/grand-hall.png",
    defaultYaw: 0,
    hotspots: [
      { target: "stage", label: "Stage Area", yaw: 0, pitch: -5 },
      { target: "dining", label: "Dining Area", yaw: 90, pitch: -10 },
      { target: "entrance", label: "Main Entrance", yaw: 180, pitch: -10 },
    ],
  },
  {
    id: "stage",
    name: "Stage Area",
    image: "/tour/stage.png",
    thumbnail: "/tour/stage.png",
    defaultYaw: 0,
    hotspots: [
      { target: "grand-hall", label: "Grand Hall", yaw: 180, pitch: -15 },
      { target: "vip-lounge", label: "VIP Lounge", yaw: -90, pitch: -10 },
    ],
  },
  {
    id: "dining",
    name: "Dining Area",
    image: "/tour/dining.png",
    thumbnail: "/tour/dining.png",
    defaultYaw: 0,
    hotspots: [
      { target: "grand-hall", label: "Grand Hall", yaw: -90, pitch: -10 },
      { target: "vip-lounge", label: "VIP Lounge", yaw: 0, pitch: -5 },
      { target: "outdoor-garden", label: "Outdoor Garden", yaw: 90, pitch: -10 },
    ],
  },
  {
    id: "vip-lounge",
    name: "VIP Lounge",
    image: "/tour/vip-lounge.png",
    thumbnail: "/tour/vip-lounge.png",
    defaultYaw: 0,
    hotspots: [
      { target: "stage", label: "Stage Area", yaw: 90, pitch: -10 },
      { target: "dining", label: "Dining Area", yaw: 180, pitch: -15 },
    ],
  },
  {
    id: "outdoor-garden",
    name: "Outdoor Garden",
    image: "/tour/outdoor-garden.png",
    thumbnail: "/tour/outdoor-garden.png",
    defaultYaw: 0,
    hotspots: [
      { target: "entrance", label: "Main Entrance", yaw: 90, pitch: -5 },
      { target: "dining", label: "Dining Area", yaw: -90, pitch: -10 },
    ],
  },
];

// ─── 3D Sphere Environment ──────────────────────────────────────────────
function SphereEnvironment({ 
  currentScene, 
  onNavigate, 
  hoveredHotspot, 
  setHoveredHotspot,
  opacity
}: { 
  currentScene: Scene; 
  onNavigate: (id: string) => void;
  hoveredHotspot: string | null;
  setHoveredHotspot: (id: string | null) => void;
  opacity: number;
}) {
  const texture = useLoader(THREE.TextureLoader, currentScene.image);
  
  // Set texture properties for equirectangular map
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture]);

  return (
    <group>
      {/* 360 Image Sphere */}
      <mesh scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.BackSide} 
          transparent 
          opacity={opacity} 
          toneMapped={false} 
        />
      </mesh>

      {/* Hotspots */}
      {opacity === 1 && currentScene.hotspots.map((hotspot) => {
        const isHovered = hoveredHotspot === `${currentScene.id}-${hotspot.target}`;
        
        // Convert yaw and pitch from degrees to radians
        const yawRad = THREE.MathUtils.degToRad(hotspot.yaw);
        const pitchRad = THREE.MathUtils.degToRad(hotspot.pitch);
        
        // Calculate 3D position on a sphere of radius 40 (slightly inside the image sphere)
        const radius = 40;
        // Adjust coordinate system: Z is forward/back, X is left/right, Y is up/down
        const x = radius * Math.cos(pitchRad) * Math.sin(yawRad);
        const y = radius * Math.sin(pitchRad);
        const z = -radius * Math.cos(pitchRad) * Math.cos(yawRad);
        
        return (
          <Html
            key={hotspot.target}
            position={[x, y, z]}
            center
            zIndexRange={[100, 0]}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(hotspot.target);
              }}
              onPointerEnter={() => {
                setHoveredHotspot(`${currentScene.id}-${hotspot.target}`);
                document.body.style.cursor = 'pointer';
              }}
              onPointerLeave={() => {
                setHoveredHotspot(null);
                document.body.style.cursor = 'auto';
              }}
              className="relative flex flex-col items-center cursor-pointer focus:outline-none"
              aria-label={`Navigate to ${hotspot.label}`}
            >
              {/* Label — appears on hover */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: `translate(-50%, ${isHovered ? "0" : "6px"})`,
                }}
              >
                <div className="bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.15em] font-bold px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                  {hotspot.label}
                </div>
              </div>

              {/* Chevron Arrow — Animated double chevron */}
              <div className="relative">
                {/* Pulse ring */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    width: "48px",
                    height: "48px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderRadius: "50%",
                    animation: "hotspot-pulse 2s ease-in-out infinite",
                  }}
                />

                {/* Main chevron container */}
                <div
                  className="w-10 h-10 flex flex-col items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    background: isHovered
                      ? "rgba(212, 175, 55, 0.9)"
                      : "rgba(255, 255, 255, 0.85)",
                    boxShadow: isHovered
                      ? "0 0 20px rgba(212, 175, 55, 0.5), 0 4px 12px rgba(0,0,0,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.3)",
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  {/* Double chevron */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      color: isHovered ? "#fff" : "#1a1512",
                      animation: "chevron-bounce 1.5s ease-in-out infinite",
                    }}
                  >
                    <polyline
                      points="6 9 12 3 18 9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="6 17 12 11 18 17"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </Html>
        );
      })}
    </group>
  );
}

// ─── Loading Component ──────────────────────────────────────────────────
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C69C6D] border-t-transparent rounded-full animate-spin" />
        <div className="text-white text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
          Loading {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}

// ─── Camera Controller ──────────────────────────────────────────────────
function CameraController({ zoom, autoRotate, compassAngleCallback }: { zoom: number, autoRotate: boolean, compassAngleCallback: (angle: number) => void }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Basic zoom by changing FOV (perspective camera)
    if (camera instanceof THREE.PerspectiveCamera) {
      // Default fov is 75, mapping zoom 1->75, 1.5->50, etc.
      camera.fov = 75 / zoom;
      camera.updateProjectionMatrix();
    }
  }, [zoom, camera]);

  useFrame(() => {
    if (controlsRef.current) {
      // Extract horizontal rotation (yaw) from camera
      const azimuthAngle = controlsRef.current.getAzimuthalAngle();
      // Convert to degrees for compass
      let degrees = THREE.MathUtils.radToDeg(azimuthAngle);
      // Adjust to 0-360 mapping
      if (degrees < 0) degrees += 360;
      compassAngleCallback(degrees);
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      rotateSpeed={-0.5} // Invert rotation to feel like dragging the image
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function PanoramaTour() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentSceneId, setCurrentSceneId] = useState("entrance");
  const [nextSceneId, setNextSceneId] = useState<string | null>(null);
  const [transitionOpacity, setTransitionOpacity] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  
  const [autoRotate, setAutoRotate] = useState(true);
  const [compassAngle, setCompassAngle] = useState(0);

  const currentScene = scenes.find((s) => s.id === (nextSceneId || currentSceneId)) || scenes[0];

  // ─── Scene transition ──────────────────────
  const navigateTo = useCallback(
    (sceneId: string) => {
      if (sceneId === currentSceneId || isTransitioning) return;
      
      setAutoRotate(false);
      setIsTransitioning(true);
      
      // Fade out
      setTransitionOpacity(0);
      
      setTimeout(() => {
        setNextSceneId(sceneId); // Start loading next texture
        
        // Wait for texture to load (simulated) then fade in
        setTimeout(() => {
          setCurrentSceneId(sceneId);
          setZoom(1);
          setNextSceneId(null);
          setTransitionOpacity(1);
          setIsTransitioning(false);
        }, 500); // Give loader some time
      }, 500); // Fade out duration
    },
    [currentSceneId, isTransitioning]
  );

  // ─── User Interaction Auto-Rotate Control ──
  const handleInteraction = useCallback(() => {
    setAutoRotate(false);
    // Restart auto-rotate after 4 seconds of inactivity
    const timeout = setTimeout(() => setAutoRotate(true), 4000);
    return () => clearTimeout(timeout);
  }, []);

  // ─── Fullscreen toggle ────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // ─── Zoom controls ────────────────────────
  const zoomIn = () => {
    handleInteraction();
    setZoom((z) => Math.min(2.5, z + 0.2));
  };
  const zoomOut = () => {
    handleInteraction();
    setZoom((z) => Math.max(0.6, z - 0.2));
  };
  const resetView = () => {
    handleInteraction();
    setZoom(1);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a] overflow-hidden select-none"
      style={{ height: isFullscreen ? "100vh" : "600px" }}
      onPointerDown={handleInteraction}
      onWheel={handleInteraction}
    >
      {/* ── 3D Canvas ── */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
          <Suspense fallback={<Loader />}>
            <SphereEnvironment 
              currentScene={currentScene} 
              onNavigate={navigateTo}
              hoveredHotspot={hoveredHotspot}
              setHoveredHotspot={setHoveredHotspot}
              opacity={transitionOpacity}
            />
          </Suspense>
          <CameraController 
            zoom={zoom} 
            autoRotate={autoRotate && !isTransitioning} 
            compassAngleCallback={setCompassAngle} 
          />
        </Canvas>
      </div>

      {/* ── Vignette / Gradients for text contrast ── */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-30 pointer-events-none" />

      {/* ── Top-Left Branding ── */}
      <div className="absolute top-0 left-0 z-40 p-6 pointer-events-none">
        <h2
          className="text-white text-2xl md:text-3xl font-bold tracking-tight leading-none"
          style={{
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            fontFamily: "'Georgia', serif",
          }}
        >
          EASCC CONFERENCE HALL
        </h2>
        <p
          className="text-white/70 text-xs md:text-sm mt-1 tracking-wider uppercase"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
        >
          ERAVUR
        </p>
      </div>

      {/* ── Current Location Badge ── */}
      <div className="absolute top-6 right-6 z-40 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 flex items-center gap-2.5 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-white text-[11px] uppercase tracking-[0.15em] font-semibold">
            {currentScene.name}
          </span>
        </div>
      </div>

      {/* ── Bottom-Left: Quick Selection Toggle ── */}
      <div className="absolute bottom-6 left-6 z-40">
        <button
          onClick={() => setShowQuickSelect(!showQuickSelect)}
          className="group flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-lg rounded-full px-5 py-2.5 transition-all duration-300 cursor-pointer"
        >
          <span className="text-white text-[10px] uppercase tracking-[0.2em] font-bold">
            Quick Selection
          </span>
          {showQuickSelect ? (
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-white/70" />
          )}
        </button>
      </div>

      {/* ── Bottom-Center: Compass ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 shadow-lg flex items-center justify-center">
          <Compass
            className="w-5 h-5 text-white/60 transition-transform duration-200"
            style={{ transform: `rotate(${compassAngle}deg)` }}
          />
        </div>
      </div>

      {/* ── Bottom-Right: Controls ── */}
      <div className="absolute bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={resetView}
          className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5 text-white/70" />
        </button>
        <button
          onClick={zoomOut}
          className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5 text-white/70" />
        </button>
        <div className="bg-black/40 backdrop-blur-md border border-white/10 shadow-lg rounded-full px-3 py-1">
          <span className="text-white/60 text-[10px] font-mono">{Math.round(zoom * 100)}%</span>
        </div>
        <button
          onClick={zoomIn}
          className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5 text-white/70" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-white/70" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-white/70" />
          )}
        </button>
      </div>

      {/* ── Quick Selection Panel ── */}
      {showQuickSelect && (
        <div
          className="absolute bottom-16 left-0 right-0 z-50 px-6 pb-4"
          style={{
            animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-5 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-[11px] uppercase tracking-[0.2em] font-bold">
                All Locations
              </h3>
              <button
                onClick={() => setShowQuickSelect(false)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {scenes.map((scene) => {
                const isActive = scene.id === currentSceneId;
                return (
                  <button
                    key={scene.id}
                    onClick={() => {
                      navigateTo(scene.id);
                      setShowQuickSelect(false);
                    }}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-black/60"
                        : "hover:ring-1 hover:ring-white/30"
                    }`}
                    style={{ aspectRatio: "16/10" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={scene.thumbnail}
                      alt={scene.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p
                        className={`text-[9px] uppercase tracking-[0.12em] font-bold leading-tight ${
                          isActive ? "text-[#D4AF37]" : "text-white/90"
                        }`}
                      >
                        {scene.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Drag Instruction (fades after first interaction) ── */}
      <DragHint />

      {/* ── CSS Animations ── */}
      <style jsx>{`
        @keyframes hotspot-pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }

        @keyframes chevron-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInHint {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Drag Hint Component ─────────────────────────────────────────────
function DragHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
      style={{ animation: "fadeInHint 5s ease-in-out forwards" }}
    >
      <div className="bg-black/50 backdrop-blur-md rounded-2xl px-8 py-4 flex flex-col items-center gap-3 border border-white/10 shadow-xl">
        {/* Hand drag icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white/80"
          style={{ animation: "dragHand 2s ease-in-out infinite" }}
        >
          <path
            d="M18 8.5V8a1.5 1.5 0 00-3 0v-.5a1.5 1.5 0 00-3 0V7a1.5 1.5 0 00-3 0v3.5L7.5 9A1.5 1.5 0 005 10.5l3.5 7A5 5 0 0013 21h1a5 5 0 005-5V8.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-white/80 text-[11px] uppercase tracking-[0.15em] font-semibold">
          Drag to look around
        </p>
      </div>

      <style jsx>{`
        @keyframes dragHand {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }
      `}</style>
    </div>
  );
}
