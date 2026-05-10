import type { GridCell, AlgoStep, AlgoResult } from './types';
import { DIRECTIONS_4, findStartEnd, reconstructPath, getCellWeight } from './types';

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

export function runDFS(grid: GridCell[][]): AlgoResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const { startRow, startCol, endRow, endCol } = findStartEnd(grid);

  if (startRow === -1 || endRow === -1) {
    return { steps: [], nodesExplored: 0, pathLength: 0, pathCost: 0, found: false };
  }

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array<{ row: number; col: number } | null>(cols).fill(null));

  const stack = new Stack<[number, number]>();
  stack.push([startRow, startCol]);
  visited[startRow][startCol] = true;

  const steps: AlgoStep[] = [];
  let nodesExplored = 0;
  let found = false;

  while (!stack.isEmpty) {
    const current = stack.pop()!;
    const [cr, cc] = current;
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
        !visited[nr][nc] &&
        grid[nr][nc].state !== 'wall'
      ) {
        visited[nr][nc] = true;
        parent[nr][nc] = { row: cr, col: cc };
        stack.push([nr, nc]);
      }
    }
  }

  let pathLength = 0;
  let pathCost = 0;

  if (found) {
    const pathSteps = reconstructPath(parent, startRow, startCol, endRow, endCol);
    steps.push(...pathSteps);
    pathLength = pathSteps.length + 2;

    let cur: { row: number; col: number } | null = { row: endRow, col: endCol };
    while (cur && (cur.row !== startRow || cur.col !== startCol)) {
      pathCost += getCellWeight(grid[cur.row][cur.col].state, grid[cur.row][cur.col].weight);
      cur = parent[cur.row][cur.col];
    }
  }

  return { steps, nodesExplored, pathLength, pathCost, found };
}
