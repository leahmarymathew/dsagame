import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';
import { ControlPanel, VisualizationGrid, AnalyticsPanel } from '../components/arena';
import type { Cell, CellState } from '../components/arena';
import { runBFS, runDFS, runDijkstra, runAStar } from '../algorithms';
import type { AlgoStep, AlgoResult } from '../algorithms';
import {
  generateRandomMazeSteps,
  generateRecursiveBacktrackerSteps,
  applyMazeSteps,
} from '../algorithms/maze';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

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
  greedy: 'O(E log V)',
};

type InteractionMode = 'wall' | 'start' | 'end';

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

export default function Arena() {
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'no-path'>('idle');
  const [nodesExplored, setNodesExplored] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [pathCost, setPathCost] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const { user } = useAuth();

  const dragAction = useRef<'place' | 'erase' | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCancelled = useRef(false);

  const saveRun = useCallback(async (algo: string, time: number, nodes: number, score: number) => {
    if (!user) return;
    const username = user.email?.split('@')[0] ?? 'anon';
    await supabase.from('leaderboard_runs').insert({
      user_id: user.id,
      username,
      algorithm: algo,
      completion_time_ms: time,
      nodes_explored: nodes,
      efficiency_score: score,
      grid_size: GRID_SIZE,
    });
  }, [user]);

  const hasStart = grid.some((row) => row.some((c) => c.state === 'start'));
  const hasEnd = grid.some((row) => row.some((c) => c.state === 'end'));

  const getInteractionMode = useCallback((): InteractionMode => {
    if (!hasStart) return 'start';
    if (!hasEnd) return 'end';
    return 'wall';
  }, [hasStart, hasEnd]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning) return;
    const mode = getInteractionMode();

    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      const cell = next[row][col];

      if (mode === 'start') {
        for (const r of next) for (const c of r) { if (c.state === 'start') c.state = 'empty'; }
        cell.state = 'start';
        cell.weight = 1;
        dragAction.current = 'place';
      } else if (mode === 'end') {
        for (const r of next) for (const c of r) { if (c.state === 'end') c.state = 'empty'; }
        cell.state = 'end';
        cell.weight = 1;
        dragAction.current = 'place';
      } else {
        if (cell.state === 'start' || cell.state === 'end') return prev;
        if (cell.state === 'wall') {
          cell.state = 'empty';
          cell.weight = 1;
          dragAction.current = 'erase';
        } else {
          cell.state = 'wall';
          cell.weight = 1;
          dragAction.current = 'place';
        }
      }

      return next;
    });
  }, [isRunning, getInteractionMode]);

  const handleCellDrag = useCallback((row: number, col: number) => {
    if (isRunning) return;
    const mode = getInteractionMode();
    if (mode !== 'wall' || !dragAction.current) return;

    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      const cell = next[row][col];
      if (cell.state === 'start' || cell.state === 'end') return prev;

      if (dragAction.current === 'place' && (cell.state === 'empty' || cell.state === 'weight2' || cell.state === 'weight3' || cell.state === 'weight5')) {
        cell.state = 'wall';
        cell.weight = 1;
      } else if (dragAction.current === 'erase' && cell.state === 'wall') {
        cell.state = 'empty';
        cell.weight = 1;
      }

      return next;
    });
  }, [isRunning, getInteractionMode]);

  const cancelAnimation = useCallback(() => {
    isCancelled.current = true;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const animateSteps = useCallback((steps: AlgoStep[], delay: number, startTime: number, algo: string, totalNodes: number) => {
    if (steps.length === 0 || isCancelled.current) {
      const elapsed = performance.now() - startTime;
      setExecutionTime(elapsed);
      setIsRunning(false);
      if (!isCancelled.current) {
        setStatus('complete');
        const score = Math.round(Math.max(0, Math.min(100, 100 - (totalNodes / (GRID_SIZE * GRID_SIZE)) * 100 + 20)));
        saveRun(algo, elapsed, totalNodes, score);
      }
      return;
    }

    const [step, ...rest] = steps;

    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      if (step.type === 'visit') {
        next[step.row][step.col].state = 'visited';
      } else if (step.type === 'path') {
        next[step.row][step.col].state = 'path';
      }
      return next;
    });

    if (step.type === 'visit') {
      setNodesExplored((prev) => prev + 1);
    }
    if (step.type === 'path') {
      setPathLength((prev) => prev + 1);
    }

    const isLastStep = rest.length === 0;
    if (isLastStep && !isCancelled.current) {
      const elapsed = performance.now() - startTime;
      setExecutionTime(elapsed);
      setIsRunning(false);
      setStatus('complete');
      const score = Math.round(Math.max(0, Math.min(100, 100 - (totalNodes / (GRID_SIZE * GRID_SIZE)) * 100 + 20)));
      saveRun(algo, elapsed, totalNodes, score);
      return;
    }

    animationRef.current = setTimeout(() => {
      animateSteps(rest, delay, startTime, algo, totalNodes);
    }, delay);
  }, [saveRun]);

  const animateMazeSteps = useCallback((steps: MazeStep[], delay: number, baseGrid: Cell[][]) => {
    if (steps.length === 0 || isCancelled.current) {
      setIsRunning(false);
      if (!isCancelled.current) setStatus('idle');
      return;
    }

    const [step, ...rest] = steps;

    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      next[step.row][step.col].state = step.state;
      next[step.row][step.col].weight = step.weight;
      return next;
    });

    const isLastStep = rest.length === 0;
    if (isLastStep && !isCancelled.current) {
      // Apply final grid with start/end guaranteed
      const finalGrid = applyMazeSteps(baseGrid, steps, START_ROW, START_COL, END_ROW, END_COL);
      setGrid(finalGrid);
      setIsRunning(false);
      setStatus('idle');
      return;
    }

    animationRef.current = setTimeout(() => {
      animateMazeSteps(rest, delay, baseGrid);
    }, delay);
  }, []);

  const handleStart = useCallback(() => {
    if (isRunning) return;
    if (!hasStart || !hasEnd) return;

    cancelAnimation();
    isCancelled.current = false;

    const cleanGrid = clearVisualization(grid);
    setGrid(cleanGrid);
    setIsRunning(true);
    setStatus('running');
    setNodesExplored(0);
    setPathLength(0);
    setPathCost(0);
    setExecutionTime(0);

    const startTime = performance.now();
    const runner = algorithmRunners[algorithm];

    if (!runner) {
      setIsRunning(false);
      setStatus('idle');
      return;
    }

    const result = runner(cleanGrid);

    if (!result.found) {
      const elapsed = performance.now() - startTime;
      setExecutionTime(elapsed);
      setNodesExplored(result.nodesExplored);
      setIsRunning(false);
      setStatus('no-path');
      return;
    }

    const delay = speedToDelay(speed);
    setPathLength(result.pathLength);
    setPathCost(result.pathCost);
    animateSteps(result.steps, delay, startTime, algorithm, result.nodesExplored);
  }, [isRunning, grid, hasStart, hasEnd, algorithm, speed, cancelAnimation, animateSteps]);

  const handleReset = useCallback(() => {
    cancelAnimation();
    setGrid(createEmptyGrid());
    setIsRunning(false);
    setStatus('idle');
    setNodesExplored(0);
    setPathLength(0);
    setPathCost(0);
    setExecutionTime(0);
  }, [cancelAnimation]);

  const handleGenerateRandomMaze = useCallback(() => {
    cancelAnimation();
    isCancelled.current = false;

    const baseGrid = createEmptyGrid();
    const steps = generateRandomMazeSteps(GRID_SIZE, GRID_SIZE);

    // Apply maze instantly for random (it's simple enough)
    const finalGrid = applyMazeSteps(baseGrid, steps, START_ROW, START_COL, END_ROW, END_COL);
    setGrid(finalGrid);
    setIsRunning(false);
    setStatus('idle');
    setNodesExplored(0);
    setPathLength(0);
    setPathCost(0);
    setExecutionTime(0);
  }, [cancelAnimation]);

  const handleGenerateRecursiveMaze = useCallback(() => {
    cancelAnimation();
    isCancelled.current = false;

    const baseGrid = createEmptyGrid();
    const steps = generateRecursiveBacktrackerSteps(GRID_SIZE, GRID_SIZE);

    // Animate the recursive maze generation
    const delay = Math.max(2, 15 - speed * 0.13);
    setIsRunning(true);
    setStatus('running');
    setNodesExplored(0);
    setPathLength(0);
    setPathCost(0);
    setExecutionTime(0);

    // Start with all walls
    const wallGrid = baseGrid.map((r) => r.map((c) => ({ ...c, state: 'wall' as CellState, weight: 1 })));
    setGrid(wallGrid);

    animateMazeSteps(steps, delay, baseGrid);
  }, [cancelAnimation, speed, animateMazeSteps]);

  const handleClearMaze = useCallback(() => {
    cancelAnimation();
    setGrid(createEmptyGrid());
    setIsRunning(false);
    setStatus('idle');
    setNodesExplored(0);
    setPathLength(0);
    setPathCost(0);
    setExecutionTime(0);
  }, [cancelAnimation]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Swords className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-3xl font-bold text-cyber-text">Algorithm Arena</h1>
          </div>
          <p className="text-cyber-text-dim">
            Visualize pathfinding algorithms on an interactive grid. Set start and end points, add walls, and watch the algorithm explore.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-5">
          <ControlPanel
            algorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
            speed={speed}
            onSpeedChange={setSpeed}
            onStart={handleStart}
            onReset={handleReset}
            onGenerateMaze={handleGenerateRandomMaze}
            onGenerateRecursiveMaze={handleGenerateRecursiveMaze}
            onClearMaze={handleClearMaze}
            isRunning={isRunning}
          />

          <VisualizationGrid
            grid={grid}
            onCellClick={handleCellClick}
            onCellDrag={handleCellDrag}
            isRunning={isRunning}
            interactionMode={getInteractionMode()}
          />

          <AnalyticsPanel
            nodesExplored={nodesExplored}
            pathLength={pathLength}
            pathCost={pathCost}
            executionTime={executionTime}
            complexity={algorithmComplexities[algorithm]}
            algorithm={algorithm}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}
