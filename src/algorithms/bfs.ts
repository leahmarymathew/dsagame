import type { GridCell, AlgoStep, AlgoResult } from './types';
import { DIRECTIONS_4, findStartEnd, getCellWeight } from './types';

export interface GridPoint {
  row: number;
  col: number;
}

export interface BFSDetailedResult {
  visitedNodes: GridPoint[];
  shortestPath: GridPoint[];
  found: boolean;
}

class Queue<T> {
  private items: T[] = [];
  private head = 0;

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.head >= this.items.length) return undefined;
    const item = this.items[this.head];
    this.head++;
    if (this.head > 0 && this.head === this.items.length) {
      this.items = [];
      this.head = 0;
    }
    return item;
  }

  get size(): number {
    return this.items.length - this.head;
  }

  get isEmpty(): boolean {
    return this.head >= this.items.length;
  }
}

export function runBFSDetailed(grid: GridCell[][]): BFSDetailedResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const { startRow, startCol, endRow, endCol } = findStartEnd(grid);

  if (startRow === -1 || endRow === -1) {
    return { visitedNodes: [], shortestPath: [], found: false };
  }

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array<{ row: number; col: number } | null>(cols).fill(null));

  const queue = new Queue<[number, number]>();
  queue.enqueue([startRow, startCol]);
  visited[startRow][startCol] = true;

  const visitedNodes: GridPoint[] = [];
  let found = false;

  while (!queue.isEmpty) {
    const current = queue.dequeue()!;
    const [cr, cc] = current;

    if (cr === endRow && cc === endCol) {
      found = true;
      break;
    }

    if (cr !== startRow || cc !== startCol) {
      visitedNodes.push({ row: cr, col: cc });
    }

    for (const [dr, dc] of DIRECTIONS_4) {
      const nr = cr + dr;
      const nc = cc + dc;

      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !visited[nr][nc] &&
        grid[nr][nc].state !== 'wall'
      ) {
        visited[nr][nc] = true;
        parent[nr][nc] = { row: cr, col: cc };
        queue.enqueue([nr, nc]);
      }
    }
  }

  const shortestPath: GridPoint[] = [];

  if (found) {
    let cur: { row: number; col: number } | null = { row: endRow, col: endCol };
    while (cur && (cur.row !== startRow || cur.col !== startCol)) {
      if (cur.row !== endRow || cur.col !== endCol) {
        shortestPath.unshift({ row: cur.row, col: cur.col });
      }
      cur = parent[cur.row][cur.col];
    }
  }

  return { visitedNodes, shortestPath, found };
}

export function runBFS(grid: GridCell[][]): AlgoResult {
  const detailed = runBFSDetailed(grid);
  const steps: AlgoStep[] = [
    ...detailed.visitedNodes.map((node) => ({ ...node, type: 'visit' as const })),
    ...detailed.shortestPath.map((node) => ({ ...node, type: 'path' as const })),
  ];

  let pathCost = 0;
  for (const node of detailed.shortestPath) {
    pathCost += getCellWeight(grid[node.row][node.col].state, grid[node.row][node.col].weight);
  }

  return {
    steps,
    nodesExplored: detailed.visitedNodes.length,
    pathLength: detailed.found ? detailed.shortestPath.length + 2 : 0,
    pathCost,
    found: detailed.found,
  };
}
