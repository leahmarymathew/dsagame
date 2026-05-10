import { motion } from 'framer-motion';
import {
  Play, RotateCcw, ChevronDown,
  Gauge, Zap, Shuffle, Layers, Trash2
} from 'lucide-react';

const algorithms = [
  { value: 'bfs', label: 'Breadth-First Search', complexity: 'O(V + E)' },
  { value: 'dfs', label: 'Depth-First Search', complexity: 'O(V + E)' },
  { value: 'dijkstra', label: 'Dijkstra\'s Algorithm', complexity: 'O(V + E log V)' },
  { value: 'astar', label: 'A* Search', complexity: 'O(E)' },
  { value: 'greedy', label: 'Greedy Best-First', complexity: 'O(E log V)' },
];

interface ControlPanelProps {
  algorithm: string;
  onAlgorithmChange: (algo: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onStart: () => void;
  onReset: () => void;
  onGenerateMaze: () => void;
  onGenerateRecursiveMaze: () => void;
  onClearMaze: () => void;
  isRunning: boolean;
}

export default function ControlPanel({
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  onStart,
  onReset,
  onGenerateMaze,
  onGenerateRecursiveMaze,
  onClearMaze,
  isRunning,
}: ControlPanelProps) {
  const selectedAlgo = algorithms.find((a) => a.value === algorithm);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col"
    >
      <div className="px-5 py-4 border-b border-cyber-border/30">
        <h2 className="text-sm font-semibold text-cyber-text flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyber-blue" />
          Controls
        </h2>
      </div>

      <div className="p-5 space-y-5 flex-1">
        <div>
          <label className="block text-xs font-medium text-cyber-text-muted mb-2 uppercase tracking-wider">
            Algorithm
          </label>
          <div className="relative">
            <select
              value={algorithm}
              onChange={(e) => onAlgorithmChange(e.target.value)}
              disabled={isRunning}
              className="w-full appearance-none bg-cyber-card border border-cyber-border/50 rounded-lg px-4 py-2.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue/50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {algorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-text-muted pointer-events-none" />
          </div>
          {selectedAlgo && (
            <p className="mt-1.5 text-xs font-mono text-cyber-blue/70">
              {selectedAlgo.complexity}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-cyber-text-muted mb-2 uppercase tracking-wider">
            Speed
          </label>
          <div className="flex items-center gap-3">
            <Gauge className="w-4 h-4 text-cyber-text-muted flex-shrink-0" />
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              disabled={isRunning}
              className="flex-1 h-1.5 bg-cyber-card rounded-full appearance-none cursor-pointer accent-cyber-blue disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyber-blue [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,212,255,0.5)]"
            />
            <span className="text-xs font-mono text-cyber-text-dim w-8 text-right">
              {speed}%
            </span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={onStart}
            disabled={isRunning}
            className="w-full btn-cyber btn-cyber-primary text-sm justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Start'}
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-full btn-cyber btn-cyber-outline text-sm justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-cyber-text-muted mb-2 uppercase tracking-wider">
            Maze
          </label>
          <div className="space-y-2.5">
            <button
              onClick={onGenerateMaze}
              disabled={isRunning}
              className="w-full btn-cyber btn-cyber-outline text-sm justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              Random Maze
            </button>

            <button
              onClick={onGenerateRecursiveMaze}
              disabled={isRunning}
              className="w-full btn-cyber btn-cyber-outline text-sm justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Layers className="w-4 h-4" />
              Recursive Maze
            </button>

            <button
              onClick={onClearMaze}
              disabled={isRunning}
              className="w-full btn-cyber btn-cyber-outline text-sm justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Clear Maze
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-cyber-border/30">
        <p className="text-xs text-cyber-text-muted text-center">
          Click cells to set start/end points
        </p>
      </div>
    </motion.aside>
  );
}
