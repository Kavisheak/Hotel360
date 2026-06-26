import { useMemo, useEffect } from 'react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { 
  generateTheaterLayout, 
  generateClassroomLayout, 
  generateBanquetLayout, 
  generateUshapeLayout, 
  generateBoardroomLayout,
  Position
} from '@/utils/layoutAlgorithms';
import { Chair, Table } from './FurnitureModels';

export const SeatingLayout = () => {
  const { guestCount, arrangementStyle, spacing, setHallStats } = useLayoutStore();

  const positions = useMemo(() => {
    let pos: Position[] = [];
    switch (arrangementStyle) {
      case 'Theater':
        pos = generateTheaterLayout(guestCount, spacing);
        break;
      case 'Classroom':
        pos = generateClassroomLayout(guestCount, spacing);
        break;
      case 'Banquet':
        pos = generateBanquetLayout(guestCount, spacing);
        break;
      case 'U-shape':
        pos = generateUshapeLayout(guestCount, spacing);
        break;
      case 'Boardroom':
        pos = generateBoardroomLayout(guestCount, spacing);
        break;
      default:
        pos = generateTheaterLayout(guestCount, spacing);
    }

    return pos;
  }, [guestCount, arrangementStyle, spacing]);

  useEffect(() => {
    const chairs = positions.filter(p => p.type === 'chair').length;
    const tables = positions.filter(p => p.type === 'table').length;
    setHallStats({
      totalGuests: chairs,
      totalTables: tables,
      totalChairs: chairs,
      utilization: Math.min(100, Math.round((chairs / 500) * 100)),
    });
  }, [positions, setHallStats]);

  return (
    <group>
      {positions.map((pos) => (
        pos.type === 'chair' ? (
          <Chair key={pos.id} position={[pos.x, pos.y, pos.z]} rotation={pos.rotation} />
        ) : (
          <Table key={pos.id} position={[pos.x, pos.y, pos.z]} rotation={pos.rotation} type={arrangementStyle === 'Banquet' ? 'round' : 'rectangular'} />
        )
      ))}
    </group>
  );
};
