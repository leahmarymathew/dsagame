import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Play, ChevronRight, Clock, BarChart3,
  Layers, GitBranch, Binary, Sparkles, Cpu,
  Search, Filter, CheckCircle2, Lock
} from 'lucide-react';

const categories = [
  { name: 'All', icon: Layers },
  { name: 'Sorting', icon: Layers },
  { name: 'Graph', icon: GitBranch },
  { name: 'Search', icon: Binary },
  { name: 'DP', icon: Sparkles },
  { name: 'Pathfinding', icon: Cpu },
];

const algorithms = [
  {
    id: 1, name: 'Bubble Sort', category: 'Sorting', difficulty: 'Easy',
    duration: '10 min', lessons: 3, completed: true,
    description: 'Learn the simplest sorting algorithm and understand the basics of comparison-based sorting.',
    complexity: 'O(n^2)',
  },
  {
    id: 2, name: 'Quick Sort', category: 'Sorting', difficulty: 'Medium',
    duration: '25 min', lessons: 5, completed: true,
    description: 'Master the divide-and-conquer approach with the most practical sorting algorithm.',
    complexity: 'O(n log n)',
  },
  {
    id: 3, name: 'Merge Sort', category: 'Sorting', difficulty: 'Medium',
    duration: '20 min', lessons: 4, completed: false,
    description: 'Understand stable sorting and the merge operation with detailed visualizations.',
    complexity: 'O(n log n)',
  },
  {
    id: 4, name: 'Binary Search', category: 'Search', difficulty: 'Easy',
    duration: '15 min', lessons: 3, completed: true,
    description: 'Learn the fundamental search algorithm and its variations for sorted data.',
    complexity: 'O(log n)',
  },
  {
    id: 5, name: 'BFS', category: 'Graph', difficulty: 'Medium',
    duration: '30 min', lessons: 6, completed: false,
    description: 'Explore breadth-first traversal and its applications in shortest path problems.',
    complexity: 'O(V + E)',
  },
  {
    id: 6, name: 'DFS', category: 'Graph', difficulty: 'Medium',
    duration: '25 min', lessons: 5, completed: false,
    description: 'Deep dive into depth-first search and its use in cycle detection and topological sorting.',
    complexity: 'O(V + E)',
  },
  {
    id: 7, name: 'Dijkstra\'s Algorithm', category: 'Pathfinding', difficulty: 'Hard',
    duration: '40 min', lessons: 8, completed: false,
    description: 'Master the shortest path algorithm with priority queues and step-by-step visualizations.',
    complexity: 'O(V + E log V)',
  },
  {
    id: 8, name: 'A* Search', category: 'Pathfinding', difficulty: 'Hard',
    duration: '35 min', lessons: 7, completed: false,
    description: 'Learn heuristic-guided pathfinding used in games and navigation systems.',
    complexity: 'O(E)',
  },
  {
    id: 9, name: 'Fibonacci DP', category: 'DP', difficulty: 'Easy',
    duration: '15 min', lessons: 3, completed: true,
    description: 'Start your dynamic programming journey with the classic Fibonacci sequence problem.',
    complexity: 'O(n)',
  },
  {
    id: 10, name: 'Knapsack Problem', category: 'DP', difficulty: 'Hard',
    duration: '45 min', lessons: 9, completed: false,
    description: 'Tackle the 0/1 knapsack problem and understand optimal substructure.',
    complexity: 'O(n*W)',
  },
  {
    id: 11, name: 'Heap Sort', category: 'Sorting', difficulty: 'Medium',
    duration: '20 min', lessons: 4, completed: false,
    description: 'Learn heap-based sorting and understand the heap data structure.',
    complexity: 'O(n log n)',
  },
  {
    id: 12, name: 'Longest Common Subsequence', category: 'DP', difficulty: 'Hard',
    duration: '35 min', lessons: 6, completed: false,
    description: 'Solve the LCS problem and understand string matching with dynamic programming.',
    complexity: 'O(m*n)',
  },
];

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgo, setSelectedAlgo] = useState<typeof algorithms[0] | null>(null);

  const filtered = algorithms.filter((algo) => {
    const matchesCategory = activeCategory === 'All' || algo.category === activeCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedCount = algorithms.filter((a) => a.completed).length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-3xl font-bold text-cyber-text">Learn Algorithms</h1>
          </div>
          <p className="text-cyber-text-dim">Interactive tutorials with step-by-step visualizations.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex-1 flex items-center gap-2 w-full sm:w-auto">
            <Search className="w-4 h-4 text-cyber-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-cyber-text placeholder-cyber-text-muted outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-cyber-text-muted">
            <Filter className="w-3.5 h-3.5" />
            <span>{completedCount}/{algorithms.length} completed</span>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeCategory === cat.name
                  ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                  : 'text-cyber-text-muted hover:text-cyber-text-dim border border-cyber-border/50 hover:border-cyber-border'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-8 text-center"
                >
                  <p className="text-cyber-text-muted">No algorithms found matching your criteria.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {filtered.map((algo, i) => (
                    <motion.button
                      key={algo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedAlgo(algo)}
                      className={`w-full text-left glass-card glass-card-hover rounded-xl p-5 flex items-start gap-4 ${
                        selectedAlgo?.id === algo.id ? 'border-cyber-blue/40' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        algo.completed
                          ? 'bg-cyber-green/20'
                          : 'bg-cyber-card'
                      }`}>
                        {algo.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                        ) : (
                          <Lock className="w-5 h-5 text-cyber-text-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-cyber-text group-hover:text-cyber-blue transition-colors">
                            {algo.name}
                          </h3>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            algo.difficulty === 'Easy' ? 'text-cyber-green bg-cyber-green/10' :
                            algo.difficulty === 'Medium' ? 'text-cyber-yellow bg-cyber-yellow/10' :
                            'text-cyber-red bg-cyber-red/10'
                          }`}>
                            {algo.difficulty}
                          </span>
                          <span className="text-xs font-mono text-cyber-text-muted bg-cyber-card px-1.5 py-0.5 rounded ml-auto">
                            {algo.complexity}
                          </span>
                        </div>
                        <p className="text-sm text-cyber-text-dim line-clamp-2 mb-2">{algo.description}</p>
                        <div className="flex items-center gap-4 text-xs text-cyber-text-muted">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{algo.duration}</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{algo.lessons} lessons</span>
                          <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{algo.category}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-cyber-text-muted flex-shrink-0 mt-1" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {selectedAlgo ? (
                  <motion.div
                    key={selectedAlgo.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <div className="p-6 border-b border-cyber-border/30">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-cyber-text">{selectedAlgo.name}</h2>
                        <span className={`text-xs px-2 py-1 rounded ${
                          selectedAlgo.difficulty === 'Easy' ? 'text-cyber-green bg-cyber-green/10' :
                          selectedAlgo.difficulty === 'Medium' ? 'text-cyber-yellow bg-cyber-yellow/10' :
                          'text-cyber-red bg-cyber-red/10'
                        }`}>
                          {selectedAlgo.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-cyber-text-dim leading-relaxed">{selectedAlgo.description}</p>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-cyber-card rounded-lg p-3">
                          <p className="text-xs text-cyber-text-muted mb-1">Time Complexity</p>
                          <p className="text-sm font-mono font-semibold text-cyber-blue">{selectedAlgo.complexity}</p>
                        </div>
                        <div className="bg-cyber-card rounded-lg p-3">
                          <p className="text-xs text-cyber-text-muted mb-1">Duration</p>
                          <p className="text-sm font-semibold text-cyber-text">{selectedAlgo.duration}</p>
                        </div>
                        <div className="bg-cyber-card rounded-lg p-3">
                          <p className="text-xs text-cyber-text-muted mb-1">Lessons</p>
                          <p className="text-sm font-semibold text-cyber-text">{selectedAlgo.lessons}</p>
                        </div>
                        <div className="bg-cyber-card rounded-lg p-3">
                          <p className="text-xs text-cyber-text-muted mb-1">Category</p>
                          <p className="text-sm font-semibold text-cyber-text">{selectedAlgo.category}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <h3 className="text-sm font-semibold text-cyber-text mb-3">Lesson Plan</h3>
                        <div className="space-y-2">
                          {Array.from({ length: selectedAlgo.lessons }, (_, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-cyber-card/50 transition-colors"
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                i < (selectedAlgo.completed ? selectedAlgo.lessons : 2)
                                  ? 'bg-cyber-green/20 text-cyber-green'
                                  : 'bg-cyber-card text-cyber-text-muted'
                              }`}>
                                {i < (selectedAlgo.completed ? selectedAlgo.lessons : 2) ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  i + 1
                                )}
                              </div>
                              <span className={`text-sm ${
                                i < (selectedAlgo.completed ? selectedAlgo.lessons : 2)
                                  ? 'text-cyber-text'
                                  : 'text-cyber-text-muted'
                              }`}>
                                {i === 0 ? 'Introduction' :
                                 i === 1 ? 'Core Concept' :
                                 i === 2 ? 'Implementation' :
                                 i === 3 ? 'Visualization' :
                                 i === 4 ? 'Optimization' :
                                 i === 5 ? 'Practice Problems' :
                                 i === 6 ? 'Advanced Variants' :
                                 i === 7 ? 'Real-world Applications' :
                                 `Lesson ${i + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full btn-cyber btn-cyber-primary text-sm justify-center mt-4">
                        <Play className="w-4 h-4" />
                        {selectedAlgo.completed ? 'Review Lesson' : 'Start Learning'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-xl p-8 text-center"
                  >
                    <BookOpen className="w-12 h-12 text-cyber-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-cyber-text mb-2">Select an Algorithm</h3>
                    <p className="text-sm text-cyber-text-muted">Choose an algorithm from the list to see its details and lesson plan.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
