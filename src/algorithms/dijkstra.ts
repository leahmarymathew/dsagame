import type { GridCell, AlgoStep, AlgoResult } from './types';
import { DIRECTIONS_4, findStartEnd, reconstructPath, getCellWeight, MinHeap } from './types';

interface DijkstraNode {
  row: number;
  col: number;
  dist: number;
}

export function runDijkstra(grid: GridCell[][]): AlgoResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const { startRow, startCol, endRow, endCol } = findStartEnd(grid);

  if (startRow === -1 || endRow === -1) {
    return { steps: [], nodesExplored: 0, pathLength: 0, pathCost: 0, found: false };
  }

  const dist = Array.from({ length: rows }, () => Array(Infinity).fill(0).map(() => Infinity));
  dist[startRow][startCol] = 0;

  const closed = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array<{ row: number; col: number } | null>(cols).fill(null));

  const heap = new MinHeap<DijkstraNode>((a, b) => a.dist - b.dist);
  heap.push({ row: startRow, col: startCol, dist: 0 });

  const steps: AlgoStep[] = [];
  let nodesExplored = 0;
  let found = false;

  while (!heap.isEmpty) {
    const current = heap.pop()!;
    const { row: cr, col: cc, dist: cd } = current;

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
        const nd = cd + edgeWeight;

        if (nd < dist[nr][nc]) {
          dist[nr][nc] = nd;
          parent[nr][nc] = { row: cr, col: cc };
          heap.push({ row: nr, col: nc, dist: nd });
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
    pathCost = dist[endRow][endCol];
  }

  return { steps, nodesExplored, pathLength, pathCost, found };
}
