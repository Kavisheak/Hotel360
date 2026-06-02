import { Box, Plane, Cylinder } from '@react-three/drei';

export const Hall = () => {
  return (
    <group>
      {/* Floor - Very Narrow [20x40] */}
      <Plane args={[20, 40]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#e8e4da" roughness={0.4} metalness={0.1} />
      </Plane>

      {/* Main Ceiling */}
      <Plane args={[20, 40]} rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#fdfaf0" roughness={1} />
      </Plane>

      {/* Long Wooden Ceiling Sections */}
      <Box args={[20, 0.2, 3]} position={[0, 7.9, -10]}>
        <meshStandardMaterial color="#4a3225" />
      </Box>
      <Box args={[20, 0.2, 3]} position={[0, 7.9, 0]}>
        <meshStandardMaterial color="#4a3225" />
      </Box>
      <Box args={[20, 0.2, 3]} position={[0, 7.9, 10]}>
        <meshStandardMaterial color="#4a3225" />
      </Box>

      {/* Recessed Lighting Panels (Single column of 3) */}
      {[...Array(3)].map((_, row) => (
        <group key={`panel-${row}`} position={[0, 7.8, -12 + row * 12]}>
          <Box args={[6, 0.4, 6]}>
            <meshStandardMaterial color="#5c3f2d" />
          </Box>
          <Box args={[4.5, 0.1, 4.5]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#fff" emissive="#ffddaa" emissiveIntensity={3} />
          </Box>
        </group>
      ))}

      {/* Walls */}
      <Box args={[20, 8, 1]} position={[0, 4, -20]}>
        <meshStandardMaterial color="#f5f2e8" />
      </Box>
      <Box args={[20, 8, 1]} position={[0, 4, 20]}>
        <meshStandardMaterial color="#f5f2e8" />
      </Box>
      <Box args={[1, 8, 40]} position={[-10, 4, 0]}>
        <meshStandardMaterial color="#f5f2e8" />
      </Box>
      <Box args={[1, 8, 40]} position={[10, 4, 0]}>
        <meshStandardMaterial color="#f5f2e8" />
      </Box>

      {/* Doors and Curtains on BOTH Sides */}
      {[-9.4, 9.4].map((sideX, sideIdx) => (
        <group key={`side-${sideIdx}`}>
          {[...Array(3)].map((_, i) => (
            <group key={`doors-curtains-${sideIdx}-${i}`} position={[sideX, 0, -12 + i * 12]}>
              <Box args={[0.2, 5, 1.2]} position={[0, 2.5, -0.7]}>
                <meshStandardMaterial color="#5c3f2d" />
              </Box>
              <Box args={[0.2, 5, 1.2]} position={[0, 2.5, 0.7]}>
                <meshStandardMaterial color="#5c3f2d" />
              </Box>
              <Box args={[0.4, 6, 0.8]} position={[0, 3, -2]}>
                <meshStandardMaterial color="#d2c9bc" roughness={1} />
              </Box>
              <Box args={[0.4, 6, 0.8]} position={[0, 3, 2]}>
                <meshStandardMaterial color="#d2c9bc" roughness={1} />
              </Box>
            </group>
          ))}
        </group>
      ))}

      {/* Stage Platform */}
      <Box args={[14, 0.4, 6]} position={[0, 0.2, -16]}>
        <meshStandardMaterial color="#dbd7cc" roughness={0.6} />
      </Box>

      {/* Ceiling Fans (Single column) */}
      {[...Array(3)].map((_, i) => (
        <group key={`fan-${i}`} position={[0, 7.5, -12 + i * 12]}>
          <Cylinder args={[0.05, 0.05, 0.5]} position={[0, 0.25, 0]}>
             <meshStandardMaterial color="#fff" />
          </Cylinder>
          <Box args={[3.5, 0.02, 0.3]}>
             <meshStandardMaterial color="#fff" />
          </Box>
          <Box args={[3.5, 0.02, 0.3]} rotation={[0, Math.PI / 2, 0]}>
             <meshStandardMaterial color="#fff" />
          </Box>
        </group>
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 7, -10]} intensity={20} color="#ffccaa" distance={30} />
      <pointLight position={[0, 7, 10]} intensity={20} color="#ffccaa" distance={30} />
    </group>
  );
};
