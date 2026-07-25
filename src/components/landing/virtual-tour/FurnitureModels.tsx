import { Box, Cylinder } from '@react-three/drei';

export const Chair = ({ position, rotation }: { position: [number, number, number], rotation: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat - Red like in the image */}
      <Box args={[0.5, 0.08, 0.5]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#c41e3a" metalness={0.1} roughness={0.5} />
      </Box>
      {/* Backrest - Red */}
      <Box args={[0.5, 0.6, 0.08]} position={[0, 0.75, -0.21]}>
        <meshStandardMaterial color="#c41e3a" metalness={0.1} roughness={0.5} />
      </Box>
      {/* Legs - Gold metallic */}
      <Cylinder args={[0.02, 0.02, 0.45]} position={[-0.2, 0.225, -0.2]}>
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.45]} position={[0.2, 0.225, -0.2]}>
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.45]} position={[-0.2, 0.225, 0.2]}>
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.45]} position={[0.2, 0.225, 0.2]}>
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </group>
  );
};

export const Table = ({ position, rotation, type = 'rectangular' }: { position: [number, number, number], rotation: number, type?: 'rectangular' | 'round' }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Tabletop - White/Light Grey */}
      {type === 'rectangular' ? (
        <Box args={[1.5, 0.05, 0.8]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#eeeeee" metalness={0} roughness={1} />
        </Box>
      ) : (
        <Cylinder args={[1, 1, 0.05]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#eeeeee" metalness={0} roughness={1} />
        </Cylinder>
      )}
      {/* Legs */}
      <Cylinder args={[0.03, 0.03, 0.75]} position={[-0.6, 0.375, -0.3]}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      <Cylinder args={[0.6, 0.6, 0.75]} position={[0, 0.375, 0]} visible={type === 'round'}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.75]} position={[0.6, 0.375, -0.3]} visible={type === 'rectangular'}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.75]} position={[-0.6, 0.375, 0.3]} visible={type === 'rectangular'}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.75]} position={[0.6, 0.375, 0.3]} visible={type === 'rectangular'}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
    </group>
  );
};
