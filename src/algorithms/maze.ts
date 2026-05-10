import type { Cell, CellState } from '../components/arena';

export interface MazeStep {
  row: number;
  col: number;
  state: CellState;
  weight: number;
}

const DIRECTIONS_4 = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateRandomMazeSteps(rows: number, cols: number): MazeStep[] {
  const steps: MazeStep[] = [];
  const wallProbability = 0.3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < wallProbability) {
        steps.push({ row: r, col: c, state: 'wall', weight: 1 });
      }
    }
  }

  return steps;
}

export function generateRecursiveBacktrackerSteps(rows: number, cols: number): MazeStep[] {
  const steps: MazeStep[] = [];

  // Start with all walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      steps.push({ row: r, col: c, state: 'wall', weight: 1 });
    }
  }

  // Carve passages using recursive backtracking on odd-indexed cells
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const stack: [number, number][] = [];

  const startR = 1;
  const startC = 1;
  visited[startR][startC] = true;
  stack.push([startR, startC]);

  // Mark start cell as carved
  const startIdx = steps.findIndex((s) => s.row === startR && s.col === startC);
  if (startIdx !== -1) steps[startIdx].state = 'empty';

  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    const neighbors = shuffle(DIRECTIONS_4);

    let carved = false;
    for (const [dr, dc] of neighbors) {
      const nr = cr + dr * 2;
      const nc = cc + dc * 2;

      if (
        nr >= 1 && nr < rows - 1 &&
        nc >= 1 && nc < cols - 1 &&
        !visited[nr][nc]
      ) {
        visited[nr][nc] = true;

        // Carve the wall between current and neighbor
        const wallR = cr + dr;
        const wallC = cc + dc;
        const wallIdx = steps.findIndex((s) => s.row === wallR && s.col === wallC);
        if (wallIdx !== -1) steps[wallIdx].state = 'empty';

        // Carve the neighbor cell
        const neighborIdx = steps.findIndex((s) => s.row === nr && s.col === nc);
        if (neighborIdx !== -1) steps[neighborIdx].state = 'empty';

        stack.push([nr, nc]);
        carved = true;
        break;
      }
    }

    if (!carved) {
      stack.pop();
    }
  }

  return steps;
}

export function applyMazeSteps(
  grid: Cell[][],
  steps: MazeStep[],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
): Cell[][] {
  const next = grid.map((r) => r.map((c) => ({ ...c, state: 'wall' as CellState, weight: 1 })));

  for (const step of steps) {
    next[step.row][step.col].state = step.state;
    next[step.row][step.col].weight = step.weight;
  }

  // Ensure start and end are clear and reachable
  next[startRow][startCol].state = 'start';
  next[startRow][startCol].weight = 1;
  next[endRow][endCol].state = 'end';
  next[endRow][endCol].weight = 1;

  // Clear cells around start and end to guarantee reachability
  for (const [dr, dc] of DIRECTIONS_4) {
    const sr = startRow + dr;
    const sc = startCol + dc;
    if (sr >= 0 && sr < grid.length && sc >= 0 && sc < grid[0].length && next[sr][sc].state === 'wall') {
      next[sr][sc].state = 'empty';
      next[sr][sc].weight = 1;
    }
    const er = endRow + dr;
    const ec = endCol + dc;
    if (er >= 0 && er < grid.length && ec >= 0 && ec < grid[0].length && next[er][ec].state === 'wall') {
      next[er][ec].state = 'empty';
      next[er][ec].weight = 1;
    }
  }

  return next;
}
