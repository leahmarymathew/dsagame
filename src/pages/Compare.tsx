import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Play, RotateCcw, Shuffle, Layers, Trash2, ChevronDown } from 'lucide-react';
import { VisualizationGrid, ComparisonPanel } from '../components/arena';
import type { Cell, CellState } from '../components/arena';
import { runBFS, runDFS, runDijkstra, runAStar } from '../algorithms';
import type { AlgoStep, AlgoResult } from '../algorithms';
import {
  generateRandomMazeSteps,
  generateRecursiveBacktrackerSteps,
  applyMazeSteps,
} from '../algorithms/maze';

const GRID_SIZE = 20;

type AlgoRunner = (grid: { row: number; col: number; state: CellState; weight: number }[][]) => AlgoResult;

const algorithmRunners: Record<string, AlgoRunner> = {
  bfs: runBFS,
  dfs: runDFS,
  dijkstra: runDijkstra,
  astar: runAStar,
};

const algorithmComplexities: Record<string, string> = {
  bfs: 'O(V + E)',
  dfs: 'O(V + E)',
  dijkstra: 'O(V + E log V)',
  astar: 'O(E)',
};

const presetComparisons = [
  { value: 'bfs-dfs', label: 'BFS vs DFS', algoA: 'bfs', algoB: 'dfs' },
  { value: 'bfs-astar', label: 'BFS vs A*', algoA: 'bfs', algoB: 'astar' },
  { value: 'dijkstra-astar', label: 'Dijkstra vs A*', algoA: 'dijkstra', algoB: 'astar' },
];

const START_ROW = 1;
const START_COL = 1;
const END_ROW = GRID_SIZE - 2;
const END_COL = GRID_SIZE - 2;

function createEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => ({
      row,
      col,
      state: 'empty' as CellState,
      weight: 1,
    }))
  );
}

function clearVisualization(grid: Cell[][]): Cell[][] {
  return grid.map((r) => r.map((c) => ({
    ...c,
    state: (c.state === 'visited' || c.state === 'path' || c.state === 'exploring')
      ? 'empty'
      : c.state,
  })));
}

function speedToDelay(speed: number): number {
  return Math.max(5, 200 - speed * 1.95);
}

interface AlgoMetrics {
  nodesExplored: number;
  pathLength: number;
  pathCost: number;
  executionTime: number;
  found: boolean;
}

const emptyMetrics: AlgoMetrics = {
  nodesExplored: 0,
  pathLength: 0,
  pathCost: 0,
  executionTime: 0,
  found: false,
};

export default function Compare() {
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid);
  const [gridA, setGridA] = useState<Cell[][]>(createEmptyGrid);
  const [gridB, setGridB] = useState<Cell[][]>(createEmptyGrid);
  const [comparison, setComparison] = useState('bfs-astar');
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [metricsA, setMetricsA] = useState<AlgoMetrics>(emptyMetrics);
  const [metricsB, setMetricsB] = useState<AlgoMetrics>(emptyMetrics);

  const animationRefA = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRefB = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCancelled = useRef(false);

  const hasStart = grid.some((row) => row.some((c) => c.state === 'start'));
  const hasEnd = grid.some((row) => row.some((c) => c.state === 'end'));

  const selectedComparison = presetComparisons.find((c) => c.value === comparison) || presetComparisons[2];
  const algoA = selectedComparison.algoA;
  const algoB = selectedComparison.algoB;

  const cancelAnimations = useCallback(() => {
    isCancelled.current = true;
    if (animationRefA.current) { clearTimeout(animationRefA.current); animationRefA.current = null; }
    if (animationRefB.current) { clearTimeout(animationRefB.current); animationRefB.current = null; }
  }, []);

  const animateStepsOnGrid = useCallback(
    (steps: AlgoStep[], delay: number, setGridFn: React.Dispatch<React.SetStateAction<Cell[][]>>, animRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>, onDone: () => void) => {
      if (steps.length === 0 || isCancelled.current) {
        onDone();
        return;
      }

      const [step, ...rest] = steps;

      setGridFn((prev) => {
        const next = prev.map((r) => r.map((c) => ({ ...c })));
        if (step.type === 'visit') next[step.row][step.col].state = 'visited';
        else if (step.type === 'path') next[step.row][step.col].state = 'path';
        return next;
      });

      if (rest.length === 0) {
        onDone();
        return;
      }

      animRef.current = setTimeout(() => {
        animateStepsOnGrid(rest, delay, setGridFn, animRef, onDone);
      }, delay);
    },
    [],
  );

  const handleStart = useCallback(() => {
    if (isRunning) return;
    if (!hasStart || !hasEnd) return;

    cancelAnimations();
    isCancelled.current = false;

    const cleanGrid = clearVisualization(grid);
    setGrid(cleanGrid);
    setGridA(cleanGrid.map((r) => r.map((c) => ({ ...c }))));
    setGridB(cleanGrid.map((r) => r.map((c) => ({ ...c }))));
    setIsRunning(true);
    setMetricsA(emptyMetrics);
    setMetricsB(emptyMetrics);

    const runnerA = algorithmRunners[algoA];
    const runnerB = algorithmRunners[algoB];
    if (!runnerA || !runnerB) { setIsRunning(false); return; }

    const startA = performance.now();
    const resultA = runnerA(cleanGrid);
    const timeA = performance.now() - startA;

    const startB = performance.now();
    const resultB = runnerB(cleanGrid);
    const timeB = performance.now() - startB;

    const delay = speedToDelay(speed);
    let doneA = false;
    let doneB = false;

    const checkDone = () => {
      if (doneA && doneB) {
        setIsRunning(false);
      }
    };

    setMetricsA({
      nodesExplored: resultA.nodesExplored,
      pathLength: resultA.pathLength,
      pathCost: resultA.pathCost,
      executionTime: timeA,
      found: resultA.found,
    });

    setMetricsB({
      nodesExplored: resultB.nodesExplored,
      pathLength: resultB.pathLength,
      pathCost: resultB.pathCost,
      executionTime: timeB,
      found: resultB.found,
    });

    animateStepsOnGrid(resultA.steps, delay, setGridA, animationRefA, () => { doneA = true; checkDone(); });
    animateStepsOnGrid(resultB.steps, delay, setGridB, animationRefB, () => { doneB = true; checkDone(); });
  }, [isRunning, grid, hasStart, hasEnd, algoA, algoB, speed, cancelAnimations, animateStepsOnGrid]);

  const handleReset = useCallback(() => {
    cancelAnimations();
    const empty = createEmptyGrid();
    setGrid(empty);
    setGridA(empty);
    setGridB(empty);
    setIsRunning(false);
    setMetricsA(emptyMetrics);
    setMetricsB(emptyMetrics);
  }, [cancelAnimations]);

  const handleGenerateRandomMaze = useCallback(() => {
    cancelAnimations();
    const baseGrid = createEmptyGrid();
    const steps = generateRandomMazeSteps(GRID_SIZE, GRID_SIZE);
    const finalGrid = applyMazeSteps(baseGrid, steps, START_ROW, START_COL, END_ROW, END_COL);
    setGrid(finalGrid);
    setGridA(finalGrid.map((r) => r.map((c) => ({ ...c }))));
    setGridB(finalGrid.map((r) => r.map((c) => ({ ...c }))));
    setIsRunning(false);
    setMetricsA(emptyMetrics);
    setMetricsB(emptyMetrics);
  }, [cancelAnimations]);

  const handleGenerateRecursiveMaze = useCallback(() => {
    cancelAnimations();
    const baseGrid = createEmptyGrid();
    const steps = generateRecursiveBacktrackerSteps(GRID_SIZE, GRID_SIZE);
    const finalGrid = applyMazeSteps(baseGrid, steps, START_ROW, START_COL, END_ROW, END_COL);
    setGrid(finalGrid);
    setGridA(finalGrid.map((r) => r.map((c) => ({ ...c }))));
    setGridB(finalGrid.map((r) => r.map((c) => ({ ...c }))));
    setIsRunning(false);
    setMetricsA(emptyMetrics);
    setMetricsB(emptyMetrics);
  }, [cancelAnimations]);

  const handleClearMaze = useCallback(() => {
    handleReset();
  }, [handleReset]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning) return;
    const mode: 'wall' | 'start' | 'end' = !hasStart ? 'start' : !hasEnd ? 'end' : 'wall';

    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      const cell = next[row][col];

      if (mode === 'start') {
        for (const r of next) for (const c of r) { if (c.state === 'start') c.state = 'empty'; }
        cell.state = 'start';
        cell.weight = 1;
      } else if (mode === 'end') {
        for (const r of next) for (const c of r) { if (c.state === 'end') c.state = 'empty'; }
        cell.state = 'end';
        cell.weight = 1;
      } else {
        if (cell.state === 'start' || cell.state === 'end') return prev;
        cell.state = cell.state === 'wall' ? 'empty' : 'wall';
        cell.weight = 1;
      }

      // Sync both grids
      setGridA(next.map((r) => r.map((c) => ({ ...c }))));
      setGridB(next.map((r) => r.map((c) => ({ ...c }))));
      return next;
    });
  }, [isRunning, hasStart, hasEnd]);

  const handleCellDrag = useCallback((row: number, col: number) => {
    if (isRunning) return;

    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      const cell = next[row][col];
      if (cell.state === 'start' || cell.state === 'end') return prev;
      if (cell.state === 'wall') { cell.state = 'empty'; cell.weight = 1; }
      else if (cell.state === 'empty') { cell.state = 'wall'; cell.weight = 1; }

      setGridA(next.map((r) => r.map((c) => ({ ...c }))));
      setGridB(next.map((r) => r.map((c) => ({ ...c }))));
      return next;
    });
  }, [isRunning]);

  const interactionMode: 'wall' | 'start' | 'end' = !hasStart ? 'start' : !hasEnd ? 'end' : 'wall';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <GitCompare className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-3xl font-bold text-cyber-text">Algorithm Comparison</h1>
          </div>
          <p className="text-cyber-text-dim">
            Run two algorithms side-by-side on the same grid. Compare performance metrics in real time.
          </p>
        </motion.div>

        {/* Controls bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 mb-5 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-cyber-text-muted uppercase tracking-wider">Compare</label>
            <div className="relative">
              <select
                value={comparison}
                onChange={(e) => setComparison(e.target.value)}
                disabled={isRunning}
                className="appearance-none bg-cyber-card border border-cyber-border/50 rounded-lg px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue/50 transition-colors disabled:opacity-50 cursor-pointer pr-8"
              >
                {presetComparisons.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-text-muted pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-cyber-text-muted uppercase tracking-wider">Speed</label>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="w-24 h-1.5 bg-cyber-card rounded-full appearance-none cursor-pointer accent-cyber-blue disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyber-blue"
            />
            <span className="text-xs font-mono text-cyber-text-dim w-8">{speed}%</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleStart}
              disabled={isRunning || !hasStart || !hasEnd}
              className="btn-cyber btn-cyber-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Both'}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="btn-cyber btn-cyber-outline text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleGenerateRandomMaze}
              disabled={isRunning}
              className="btn-cyber btn-cyber-outline text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              Random
            </button>
            <button
              onClick={handleGenerateRecursiveMaze}
              disabled={isRunning}
              className="btn-cyber btn-cyber-outline text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Layers className="w-4 h-4" />
              Maze
            </button>
            <button
              onClick={handleClearMaze}
              disabled={isRunning}
              className="btn-cyber btn-cyber-outline text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </motion.div>

        {/* Split screen grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div className="relative">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/20">
              <span className="text-xs font-semibold text-cyan-400">{algorithmComplexities[algoA] ? `${algoA.toUpperCase()} - ${algorithmComplexities[algoA]}` : algoA}</span>
            </div>
            <VisualizationGrid
              grid={gridA}
              onCellClick={handleCellClick}
              onCellDrag={handleCellDrag}
              isRunning={isRunning}
              interactionMode={interactionMode}
            />
          </div>
          <div className="relative">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20">
              <span className="text-xs font-semibold text-amber-400">{algorithmComplexities[algoB] ? `${algoB.toUpperCase()} - ${algorithmComplexities[algoB]}` : algoB}</span>
            </div>
            <VisualizationGrid
              grid={gridB}
              onCellClick={handleCellClick}
              onCellDrag={handleCellDrag}
              isRunning={isRunning}
              interactionMode={interactionMode}
            />
          </div>
        </div>

        {/* Comparison panel */}
        <ComparisonPanel
          algoA={algoA}
          algoB={algoB}
          metricsA={metricsA}
          metricsB={metricsB}
          complexityA={algorithmComplexities[algoA]}
          complexityB={algorithmComplexities[algoB]}
        />
      </div>
    </div>
  );
}
