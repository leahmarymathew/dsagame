import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Clock, Database, Cpu, Target,
  ChevronDown, ChevronUp, Zap, GitBranch, Layers, Route
} from 'lucide-react';

interface AlgoDetail {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  useCases: string[];
  previewCells: { r: number; c: number; state: 'visited' | 'path' | 'start' | 'end' | 'wall' }[];
  gridRows: number;
  gridCols: number;
}

const algorithms: AlgoDetail[] = [
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    icon: Layers,
    color: 'text-cyan-400',
    glow: 'bg-cyan-400/10',
    description: 'Explores all neighbors at the current depth before moving to the next level. Guarantees the shortest path in unweighted graphs by expanding outward in concentric rings from the start node.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    useCases: ['Shortest path in unweighted graphs', 'Level-order traversal', 'Web crawling', 'Social network analysis', 'Peer-to-peer networks'],
    gridRows: 5,
    gridCols: 7,
    previewCells: [
      { r: 2, c: 0, state: 'start' },
      { r: 2, c: 1, state: 'visited' }, { r: 1, c: 1, state: 'visited' }, { r: 3, c: 1, state: 'visited' },
      { r: 2, c: 2, state: 'visited' }, { r: 1, c: 2, state: 'visited' }, { r: 3, c: 2, state: 'visited' },
      { r: 0, c: 2, state: 'visited' }, { r: 4, c: 2, state: 'visited' },
      { r: 2, c: 3, state: 'visited' }, { r: 1, c: 3, state: 'visited' }, { r: 3, c: 3, state: 'visited' },
      { r: 2, c: 4, state: 'path' }, { r: 2, c: 5, state: 'path' }, { r: 2, c: 6, state: 'end' },
    ],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    icon: GitBranch,
    color: 'text-amber-400',
    glow: 'bg-amber-400/10',
    description: 'Explores as far as possible along each branch before backtracking. Uses a stack (or recursion) to dive deep into the graph, making it memory-efficient but not guaranteed to find the shortest path.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    useCases: ['Cycle detection', 'Topological sorting', 'Maze generation', 'Connected components', 'Solving puzzles (Sudoku)'],
    gridRows: 5,
    gridCols: 7,
    previewCells: [
      { r: 2, c: 0, state: 'start' },
      { r: 2, c: 1, state: 'visited' }, { r: 2, c: 2, state: 'visited' }, { r: 2, c: 3, state: 'visited' },
      { r: 2, c: 4, state: 'visited' }, { r: 2, c: 5, state: 'visited' }, { r: 2, c: 6, state: 'end' },
      { r: 1, c: 3, state: 'visited' }, { r: 3, c: 3, state: 'visited' },
      { r: 1, c: 5, state: 'visited' },
    ],
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    icon: Target,
    color: 'text-emerald-400',
    glow: 'bg-emerald-400/10',
    description: 'Finds the shortest path from a source to all nodes in a weighted graph with non-negative edges. Uses a priority queue to always expand the node with the smallest known distance, guaranteeing optimality.',
    timeComplexity: 'O(V + E log V)',
    spaceComplexity: 'O(V)',
    useCases: ['GPS navigation systems', 'Network routing protocols', 'Flight scheduling', 'Robotics path planning', 'Resource allocation'],
    gridRows: 5,
    gridCols: 7,
    previewCells: [
      { r: 2, c: 0, state: 'start' },
      { r: 2, c: 1, state: 'visited' }, { r: 1, c: 1, state: 'visited' },
      { r: 1, c: 2, state: 'visited' }, { r: 1, c: 3, state: 'visited' },
      { r: 1, c: 4, state: 'visited' }, { r: 1, c: 5, state: 'visited' },
      { r: 2, c: 5, state: 'visited' }, { r: 2, c: 6, state: 'end' },
      { r: 2, c: 5, state: 'path' }, { r: 1, c: 5, state: 'path' },
      { r: 1, c: 4, state: 'path' }, { r: 1, c: 3, state: 'path' },
      { r: 1, c: 2, state: 'path' }, { r: 1, c: 1, state: 'path' },
      { r: 3, c: 2, state: 'wall' }, { r: 3, c: 4, state: 'wall' },
    ],
  },
  {
    id: 'astar',
    name: 'A* Search',
    icon: Zap,
    color: 'text-rose-400',
    glow: 'bg-rose-400/10',
    description: 'Combines Dijkstra\'s optimality with heuristic guidance to find the shortest path faster. Uses f(n) = g(n) + h(n) where g is actual cost and h is the heuristic estimate, making it both optimal and efficient.',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    useCases: ['Game AI pathfinding', 'Map navigation apps', 'Robot motion planning', 'Natural language processing', 'Video game character movement'],
    gridRows: 5,
    gridCols: 7,
    previewCells: [
      { r: 2, c: 0, state: 'start' },
      { r: 2, c: 1, state: 'visited' }, { r: 2, c: 2, state: 'visited' },
      { r: 2, c: 3, state: 'visited' }, { r: 2, c: 4, state: 'visited' },
      { r: 2, c: 5, state: 'visited' }, { r: 2, c: 6, state: 'end' },
      { r: 1, c: 3, state: 'wall' }, { r: 3, c: 3, state: 'wall' },
      { r: 2, c: 1, state: 'path' }, { r: 2, c: 2, state: 'path' },
      { r: 2, c: 3, state: 'path' }, { r: 2, c: 4, state: 'path' },
      { r: 2, c: 5, state: 'path' },
    ],
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    icon: Cpu,
    color: 'text-violet-400',
    glow: 'bg-violet-400/10',
    description: 'Solves complex problems by breaking them into overlapping subproblems and storing their solutions. Avoids redundant computation through memoization or tabulation, turning exponential problems into polynomial ones.',
    timeComplexity: 'Varies (O(n) to O(n^3))',
    spaceComplexity: 'Varies (O(n) to O(n^2))',
    useCases: ['Fibonacci sequence', 'Knapsack problem', 'Longest common subsequence', 'Edit distance', 'Matrix chain multiplication', 'Coin change'],
    gridRows: 4,
    gridCols: 6,
    previewCells: [
      { r: 0, c: 0, state: 'start' }, { r: 0, c: 1, state: 'visited' }, { r: 0, c: 2, state: 'visited' },
      { r: 0, c: 3, state: 'visited' }, { r: 0, c: 4, state: 'visited' }, { r: 0, c: 5, state: 'visited' },
      { r: 1, c: 0, state: 'visited' }, { r: 1, c: 1, state: 'visited' }, { r: 1, c: 2, state: 'path' },
      { r: 1, c: 3, state: 'path' }, { r: 1, c: 4, state: 'path' }, { r: 1, c: 5, state: 'end' },
      { r: 2, c: 0, state: 'visited' }, { r: 2, c: 1, state: 'visited' }, { r: 2, c: 2, state: 'visited' },
      { r: 2, c: 3, state: 'visited' }, { r: 2, c: 4, state: 'visited' }, { r: 2, c: 5, state: 'visited' },
      { r: 3, c: 0, state: 'visited' }, { r: 3, c: 1, state: 'visited' }, { r: 3, c: 2, state: 'visited' },
      { r: 3, c: 3, state: 'visited' }, { r: 3, c: 4, state: 'visited' }, { r: 3, c: 5, state: 'visited' },
    ],
  },
];

const cellStyles: Record<string, string> = {
  empty: 'bg-[#12121a] border-[#1e1e2e]/60',
  visited: 'bg-cyan-500/25 border-cyan-500/15',
  path: 'bg-violet-500/50 border-violet-500/30',
  start: 'bg-emerald-400 border-emerald-400/70',
  end: 'bg-rose-400 border-rose-400/70',
  wall: 'bg-[#3a3a4a] border-[#4a4a5a]/80',
};

function PreviewGrid({ algo }: { algo: AlgoDetail }) {
  const cells = algo.previewCells;
  const cellMap = new Map(cells.map((c) => [`${c.r}-${c.c}`, c.state]));

  return (
    <div
      className="grid gap-[2px] w-full max-w-[180px] mx-auto"
      style={{
        gridTemplateColumns: `repeat(${algo.gridCols}, 1fr)`,
        gridTemplateRows: `repeat(${algo.gridRows}, 1fr)`,
      }}
    >
      {Array.from({ length: algo.gridRows * algo.gridCols }, (_, i) => {
        const r = Math.floor(i / algo.gridCols);
        const c = i % algo.gridCols;
        const state = cellMap.get(`${r}-${c}`) || 'empty';
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (r * algo.gridCols + c) * 0.02, duration: 0.2 }}
            className={`aspect-square rounded-[2px] border ${cellStyles[state]}`}
          />
        );
      })}
    </div>
  );
}

export default function Learn() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-3xl font-bold text-cyber-text">Learn Algorithms</h1>
          </div>
          <p className="text-cyber-text-dim">
            Understand core algorithms with explanations, complexity analysis, and visual previews.
          </p>
        </motion.div>

        <div className="space-y-4">
          {algorithms.map((algo, i) => {
            const isExpanded = expandedId === algo.id;
            const Icon = algo.icon;

            return (
              <motion.div
                key={algo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                {/* Header - always visible */}
                <button
                  onClick={() => toggle(algo.id)}
                  className="w-full text-left p-5 flex items-center gap-4 hover:bg-cyber-card/30 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${algo.glow} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${algo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-cyber-text">{algo.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-cyber-text-muted">
                        <Clock className="w-3 h-3" /> {algo.timeComplexity}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-cyber-text-muted">
                        <Database className="w-3 h-3" /> {algo.spaceComplexity}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-cyber-text-muted" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-cyber-text-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-cyber-border/20 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-5">
                          <div className="space-y-4">
                            {/* Description */}
                            <p className="text-sm text-cyber-text-dim leading-relaxed">
                              {algo.description}
                            </p>

                            {/* Complexity cards */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-cyber-card rounded-lg p-3 border border-cyber-border/20">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="w-3.5 h-3.5 text-cyber-blue" />
                                  <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider">Time</span>
                                </div>
                                <p className="text-sm font-mono font-semibold text-cyber-blue">{algo.timeComplexity}</p>
                              </div>
                              <div className="bg-cyber-card rounded-lg p-3 border border-cyber-border/20">
                                <div className="flex items-center gap-2 mb-1">
                                  <Database className="w-3.5 h-3.5 text-cyber-green" />
                                  <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider">Space</span>
                                </div>
                                <p className="text-sm font-mono font-semibold text-cyber-green">{algo.spaceComplexity}</p>
                              </div>
                            </div>

                            {/* Use cases */}
                            <div>
                              <h3 className="flex items-center gap-2 text-xs font-medium text-cyber-text-muted uppercase tracking-wider mb-2">
                                <Route className="w-3.5 h-3.5" /> Use Cases
                              </h3>
                              <div className="flex flex-wrap gap-1.5">
                                {algo.useCases.map((uc) => (
                                  <span
                                    key={uc}
                                    className={`text-xs px-2 py-1 rounded-md ${algo.glow} ${algo.color} border border-cyber-border/20`}
                                  >
                                    {uc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Preview grid */}
                          <div className="flex items-center justify-center">
                            <div className="bg-cyber-card/50 rounded-lg p-3 border border-cyber-border/20 w-full">
                              <p className="text-[10px] text-cyber-text-muted uppercase tracking-wider text-center mb-2">Preview</p>
                              <PreviewGrid algo={algo} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
