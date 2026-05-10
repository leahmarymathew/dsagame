import type { CellState } from '../components/arena';

export interface GridCell {
  row: number;
  col: number;
  state: CellState;
  weight: number;
}

export type StepType = 'visit' | 'path' | 'frontier';

export interface AlgoStep {
  row: number;
  col: number;
  type: StepType;
}

export interface AlgoResult {
  steps: AlgoStep[];
  nodesExplored: number;
  pathLength: number;
  pathCost: number;
  found: boolean;
}

export const DIRECTIONS_4 = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function findStartEnd(grid: GridCell[][]): { startRow: number; startCol: number; endRow: number; endCol: number } {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let startRow = -1, startCol = -1, endRow = -1, endCol = -1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].state === 'start') { startRow = r; startCol = c; }
      if (grid[r][c].state === 'end') { endRow = r; endCol = c; }
    }
  }

  return { startRow, startCol, endRow, endCol };
}

export function reconstructPath(
  parent: (null | { row: number; col: number })[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
): AlgoStep[] {
  const pathCells: AlgoStep[] = [];
  let cur: { row: number; col: number } | null = { row: endRow, col: endCol };

  while (cur && (cur.row !== startRow || cur.col !== startCol)) {
    if (cur.row !== endRow || cur.col !== endCol) {
      pathCells.unshift({ row: cur.row, col: cur.col, type: 'path' });
    }
    cur = parent[cur.row][cur.col];
  }

  return pathCells;
}

export function getCellWeight(state: CellState, weight: number): number {
  if (state === 'weight2') return 2;
  if (state === 'weight3') return 3;
  if (state === 'weight5') return 5;
  return weight || 1;
}

export class MinHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  get size(): number {
    return this.heap.length;
  }

  get isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.heap[i], this.heap[parent]) < 0) {
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
      } else {
        break;
      }
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest !== i) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      } else {
        break;
      }
    }
  }
}
