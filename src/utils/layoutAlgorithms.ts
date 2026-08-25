export interface Position {
  id: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  type: 'chair' | 'table';
}

// Hall bounds: X ∈ [-8, 8], Z ∈ [-13, 18] (stage at z < -13)
const HALL_MIN_X = -8;
const HALL_MAX_X = 8;
const HALL_MIN_Z = -12;
const HALL_MAX_Z = 17;

/**
 * Theater: Rows of chairs facing the stage (negative Z direction), no tables.
 */
export function generateTheaterLayout(guestCount: number, spacing: number): Position[] {
  const positions: Position[] = [];
  const chairsPerSide = 10;
  const chairsPerRow = chairsPerSide * 2;
  const rows = Math.ceil(guestCount / chairsPerRow);
  let id = 0;

  const chairSpacing = 0.65 * spacing;
  const centerGap = 3.0 * spacing;

  for (let row = 0; row < rows; row++) {
    const chairsInThisRow = Math.min(chairsPerRow, guestCount - id);
    const z = HALL_MIN_Z + 2 + row * (1.2 * spacing);

    if (z > HALL_MAX_Z) break;

    for (let col = 0; col < chairsInThisRow; col++) {
      let x = 0;
      if (col < chairsPerSide) {
        // Left side
        const leftStartX = -(centerGap / 2) - (chairsPerSide * chairSpacing) + (chairSpacing / 2);
        x = leftStartX + col * chairSpacing;
      } else {
        // Right side
        const rightStartX = (centerGap / 2) + (chairSpacing / 2);
        x = rightStartX + (col - chairsPerSide) * chairSpacing;
      }

      if (x < HALL_MIN_X || x > HALL_MAX_X) continue;
      positions.push({
        id: `chair-${id++}`,
        x,
        y: 0,
        z,
        rotation: Math.PI,
        type: 'chair',
      });
    }
  }

  return positions;
}

/**
 * Classroom: Rows of tables with chairs behind each table, facing the stage.
 */
export function generateClassroomLayout(guestCount: number, spacing: number): Position[] {
  const positions: Position[] = [];
  const chairsPerSide = 5;
  const chairsPerRow = chairsPerSide * 2;
  const rows = Math.ceil(guestCount / chairsPerRow);
  let id = 0;
  let tableId = 0;

  const chairSpacing = 1.2 * spacing; // Wide enough for individual study tables
  const centerGap = 3.0 * spacing; 

  for (let row = 0; row < rows; row++) {
    const chairsInThisRow = Math.min(chairsPerRow, guestCount - id);
    const z = HALL_MIN_Z + 2 + row * (2.2 * spacing); // Extra Z spacing for table + chair

    if (z > HALL_MAX_Z) break;

    for (let col = 0; col < chairsInThisRow; col++) {
      let x = 0;
      if (col < chairsPerSide) {
        // Left side
        const leftStartX = -(centerGap / 2) - (chairsPerSide * chairSpacing) + (chairSpacing / 2);
        x = leftStartX + col * chairSpacing;
      } else {
        // Right side
        const rightStartX = (centerGap / 2) + (chairSpacing / 2);
        x = rightStartX + (col - chairsPerSide) * chairSpacing;
      }

      if (x < HALL_MIN_X || x > HALL_MAX_X) continue;
      
      // Table in front of chair
      positions.push({
        id: `table-${tableId++}`,
        x,
        y: 0,
        z,
        rotation: 0,
        type: 'table',
      });
      
      // Chair behind table
      positions.push({
        id: `chair-${id++}`,
        x,
        y: 0,
        z: z + 0.6 * spacing, // Chair pushed slightly behind the table
        rotation: Math.PI, // Facing forward to stage
        type: 'chair',
      });
    }
  }

  return positions;
}

/**
 * Banquet: Round tables with chairs arranged in a circle around each.
 */
export function generateBanquetLayout(guestCount: number, spacing: number): Position[] {
  const positions: Position[] = [];
  const chairsPerTable = 8;
  const tableCount = Math.ceil(guestCount / chairsPerTable);
  const tablesPerRow = 4;
  const rows = Math.ceil(tableCount / tablesPerRow);

  let tableId = 0;
  let chairId = 0;

  for (let row = 0; row < rows; row++) {
    const tablesInRow = Math.min(tablesPerRow, tableCount - tableId);
    const z = HALL_MIN_Z + 3 + row * (4.0 * spacing);

    if (z > HALL_MAX_Z - 1) break;

    for (let col = 0; col < tablesInRow; col++) {
      let tx = 0;
      const tableSpacing = 3.5 * spacing;
      const centerGap = 5.0 * spacing; // distance between the two middle tables

      if (col === 0) tx = -(centerGap / 2) - tableSpacing;
      else if (col === 1) tx = -(centerGap / 2);
      else if (col === 2) tx = (centerGap / 2);
      else if (col === 3) tx = (centerGap / 2) + tableSpacing;

      positions.push({
        id: `table-${tableId++}`,
        x: tx,
        y: 0,
        z,
        rotation: 0,
        type: 'table',
      });

      // Chairs in a circle
      const chairsAtThisTable = Math.min(chairsPerTable, guestCount - chairId);
      for (let c = 0; c < chairsAtThisTable; c++) {
        const angle = (c / chairsPerTable) * Math.PI * 2;
        const radius = 1.3 * spacing;
        positions.push({
          id: `chair-${chairId++}`,
          x: tx + Math.cos(angle) * radius,
          y: 0,
          z: z + Math.sin(angle) * radius,
          // Calculate exact rotation to face the table center (-cos(angle), -sin(angle))
          rotation: Math.atan2(-Math.cos(angle), -Math.sin(angle)),
          type: 'chair',
        });
      }
    }
  }

  return positions;
}

/**
 * U-shape: Tables and chairs arranged in a U formation open toward the stage.
 */
export function generateUshapeLayout(guestCount: number, spacing: number): Position[] {
  const positions: Position[] = [];
  let chairId = 0;
  let tableId = 0;

  const uWidth = (HALL_MAX_X - HALL_MIN_X) * 0.7;
  const uDepth = Math.min((HALL_MAX_Z - HALL_MIN_Z) * 0.6, 15);
  const centerX = 0;
  const startZ = HALL_MIN_Z + 3;

  const tableLength = 1.5 * spacing;
  const gap = 0.2 * spacing;

  // Bottom of U (facing stage)
  const bottomTablesCount = Math.floor(uWidth / (tableLength + gap));
  const bottomStartX = centerX - (bottomTablesCount * (tableLength + gap)) / 2 + tableLength / 2;
  const bottomZ = startZ + uDepth;

  for (let i = 0; i < bottomTablesCount; i++) {
    const tx = bottomStartX + i * (tableLength + gap);
    positions.push({
      id: `table-${tableId++}`,
      x: tx,
      y: 0,
      z: bottomZ,
      rotation: 0,
      type: 'table',
    });
    // Chair on the outside (further from stage)
    if (chairId < guestCount) {
      positions.push({
        id: `chair-${chairId++}`,
        x: tx,
        y: 0,
        z: bottomZ + 0.8 * spacing,
        rotation: 0,
        type: 'chair',
      });
    }
  }

  // Left arm
  const armTablesCount = Math.floor(uDepth / (tableLength + gap));
  const leftX = centerX - uWidth / 2;
  for (let i = 0; i < armTablesCount; i++) {
    const tz = startZ + i * (tableLength + gap) + tableLength / 2;
    positions.push({
      id: `table-${tableId++}`,
      x: leftX,
      y: 0,
      z: tz,
      rotation: Math.PI / 2,
      type: 'table',
    });
    if (chairId < guestCount) {
      positions.push({
        id: `chair-${chairId++}`,
        x: leftX - 0.8 * spacing,
        y: 0,
        z: tz,
        rotation: Math.PI / 2,
        type: 'chair',
      });
    }
  }

  // Right arm
  const rightX = centerX + uWidth / 2;
  for (let i = 0; i < armTablesCount; i++) {
    const tz = startZ + i * (tableLength + gap) + tableLength / 2;
    positions.push({
      id: `table-${tableId++}`,
      x: rightX,
      y: 0,
      z: tz,
      rotation: Math.PI / 2,
      type: 'table',
    });
    if (chairId < guestCount) {
      positions.push({
        id: `chair-${chairId++}`,
        x: rightX + 0.8 * spacing,
        y: 0,
        z: tz,
        rotation: -Math.PI / 2,
        type: 'chair',
      });
    }
  }

  return positions;
}

/**
 * Boardroom: Long central table(s) with chairs on both sides.
 */
export function generateBoardroomLayout(guestCount: number, spacing: number): Position[] {
  const positions: Position[] = [];
  let chairId = 0;
  let tableId = 0;

  const chairsPerSide = Math.ceil(guestCount / 2);
  const tableLength = 1.5 * spacing;
  const gap = 0.1 * spacing;
  const tablesNeeded = Math.ceil(chairsPerSide / 1);

  const totalLength = tablesNeeded * (tableLength + gap);
  const startZ = -totalLength / 2 + 2;

  for (let i = 0; i < tablesNeeded; i++) {
    const z = startZ + i * (tableLength + gap);
    if (z < HALL_MIN_Z + 1 || z > HALL_MAX_Z - 1) continue;

    positions.push({
      id: `table-${tableId++}`,
      x: 0,
      y: 0,
      z,
      rotation: 0,
      type: 'table',
    });

    // Chair on left side
    if (chairId < guestCount) {
      positions.push({
        id: `chair-${chairId++}`,
        x: -0.9 * spacing,
        y: 0,
        z,
        rotation: Math.PI / 2,
        type: 'chair',
      });
    }
    // Chair on right side
    if (chairId < guestCount) {
      positions.push({
        id: `chair-${chairId++}`,
        x: 0.9 * spacing,
        y: 0,
        z,
        rotation: -Math.PI / 2,
        type: 'chair',
      });
    }
  }

  return positions;
}
