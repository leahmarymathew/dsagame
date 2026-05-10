import type { GridCell, AlgoStep, AlgoResult } from './types';
import { DIRECTIONS_4, findStartEnd, reconstructPath, getCellWeight, MinHeap } from './types';

interface AStarNode {
  row: number;
  col: number;
  f: number;
  g: number;
}

function manhattan(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

export function runAStar(grid: GridCell[][]): AlgoResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const { startRow, startCol, endRow, endCol } = findStartEnd(grid);

  if (startRow === -1 || endRow === -1) {
    return { steps: [], nodesExplored: 0, pathLength: 0, pathCost: 0, found: false };
  }

  const gScore = Array.from({ length: rows }, () => Array(Infinity).fill(0).map(() => Infinity));
  gScore[startRow][startCol] = 0;

  const closed = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array<{ row: number; col: number } | null>(cols).fill(null));

  const heap = new MinHeap<AStarNode>((a, b) => a.f - b.f || a.g - b.g);
  heap.push({ row: startRow, col: startCol, f: manhattan(startRow, startCol, endRow, endCol), g: 0 });

  const steps: AlgoStep[] = [];
  let nodesExplored = 0;
  let found = false;

  while (!heap.isEmpty) {
    const current = heap.pop()!;
    const { row: cr, col: cc, g: cg } = current;

    if (closed[cr][cc]) continue;
    closed[cr][cc] = true;
    nodesExplored++;

    if (cr === endRow && cc === endCol) {
      found = true;
      break;
    }

    if (cr !== startRow || cc !== startCol) {
      steps.push({ row: cr, col: cc, type: 'visit' });
    }

    for (const [dr, dc] of DIRECTIONS_4) {
      const nr = cr + dr;
      const nc = cc + dc;

      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !closed[nr][nc] &&
        grid[nr][nc].state !== 'wall'
      ) {
        const edgeWeight = getCellWeight(grid[nr][nc].state, grid[nr][nc].weight);
        const ng = cg + edgeWeight;

        if (ng < gScore[nr][nc]) {
          gScore[nr][nc] = ng;
          parent[nr][nc] = { row: cr, col: cc };
          const h = manhattan(nr, nc, endRow, endCol);
          heap.push({ row: nr, col: nc, f: ng + h, g: ng });
        }
      }
    }
  }

  let pathLength = 0;
  let pathCost = 0;

  if (found) {
    const pathSteps = reconstructPath(parent, startRow, startCol, endRow, endCol);
    steps.push(...pathSteps);
    pathLength = pathSteps.length + 2;
    pathCost = gScore[endRow][endCol];
  }

  return { steps, nodesExplored, pathLength, pathCost, found };
}
