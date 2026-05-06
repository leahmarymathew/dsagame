import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Clock, Zap, Code2, Play, RotateCcw,
  ChevronDown, Trophy, AlertCircle, CheckCircle2,
  Terminal, BarChart3
} from 'lucide-react';

const challenges = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    acceptance: '78%',
    solved: true,
  },
  {
    id: 2,
    title: 'Merge Sorted Arrays',
    difficulty: 'Easy',
    category: 'Sorting',
    acceptance: '72%',
    solved: true,
  },
  {
    id: 3,
    title: 'Binary Tree Inversion',
    difficulty: 'Medium',
    category: 'Tree',
    acceptance: '65%',
    solved: false,
  },
  {
    id: 4,
    title: 'Dijkstra Shortest Path',
    difficulty: 'Hard',
    category: 'Graph',
    acceptance: '42%',
    solved: false,
  },
  {
    id: 5,
    title: 'Longest Substring',
    difficulty: 'Medium',
    category: 'String',
    acceptance: '58%',
    solved: false,
  },
  {
    id: 6,
    title: 'Maximum Flow',
    difficulty: 'Hard',
    category: 'Graph',
    acceptance: '35%',
    solved: false,
  },
  {
    id: 7,
    title: 'LRU Cache',
    difficulty: 'Medium',
    category: 'Design',
    acceptance: '52%',
    solved: true,
  },
  {
    id: 8,
    title: 'Quick Select',
    difficulty: 'Medium',
    category: 'Sorting',
    acceptance: '61%',
    solved: false,
  },
];

const filters = ['All', 'Easy', 'Medium', 'Hard'];

const sampleCode = `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
}`;

const testResults = [
  { input: '[2,7,11,15], 9', expected: '[0,1]', output: '[0,1]', passed: true },
  { input: '[3,2,4], 6', expected: '[1,2]', output: '[1,2]', passed: true },
  { input: '[3,3], 6', expected: '[0,1]', output: '[0,1]', passed: true },
];

export default function Arena() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]);
  const [showCode, setShowCode] = useState(false);

  const filteredChallenges = activeFilter === 'All'
    ? challenges
    : challenges.filter((c) => c.difficulty === activeFilter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Swords className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-3xl font-bold text-cyber-text">Algorithm Arena</h1>
          </div>
          <p className="text-cyber-text-dim">Challenge yourself with algorithmic problems and compete with others.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-cyber-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-cyber-blue" />
                  <span className="text-sm font-semibold text-cyber-text">Challenges</span>
                </div>
                <div className="flex gap-1.5">
                  {filters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        activeFilter === f
                          ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                          : 'text-cyber-text-muted hover:text-cyber-text-dim border border-transparent'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {filteredChallenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => { setSelectedChallenge(challenge); setShowCode(false); }}
                    className={`w-full text-left px-4 py-3 border-b border-cyber-border/20 transition-all hover:bg-cyber-card/50 ${
                      selectedChallenge.id === challenge.id ? 'bg-cyber-blue/5 border-l-2 border-l-cyber-blue' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {challenge.solved ? (
                          <CheckCircle2 className="w-4 h-4 text-cyber-green flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-cyber-border flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium text-cyber-text">{challenge.title}</span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-cyber-text-muted" />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 ml-6">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        challenge.difficulty === 'Easy' ? 'text-cyber-green bg-cyber-green/10' :
                        challenge.difficulty === 'Medium' ? 'text-cyber-yellow bg-cyber-yellow/10' :
                        'text-cyber-red bg-cyber-red/10'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-cyber-text-muted">{challenge.category}</span>
                      <span className="text-xs text-cyber-text-muted ml-auto">{challenge.acceptance}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-cyber-border/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-cyber-text">{selectedChallenge.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded ${
                    selectedChallenge.difficulty === 'Easy' ? 'text-cyber-green bg-cyber-green/10' :
                    selectedChallenge.difficulty === 'Medium' ? 'text-cyber-yellow bg-cyber-yellow/10' :
                    'text-cyber-red bg-cyber-red/10'
                  }`}>
                    {selectedChallenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyber-text-dim hover:text-cyber-text border border-cyber-border rounded-md transition-all hover:border-cyber-blue/30"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    {showCode ? 'Hide Code' : 'Show Code'}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-cyber-text mb-2">Problem Description</h3>
                  <p className="text-sm text-cyber-text-dim leading-relaxed">
                    Given an array of integers <code className="text-cyber-blue bg-cyber-blue/10 px-1 rounded text-xs">nums</code> and an integer{' '}
                    <code className="text-cyber-blue bg-cyber-blue/10 px-1 rounded text-xs">target</code>, return indices of the two numbers such that they add up to{' '}
                    <code className="text-cyber-blue bg-cyber-blue/10 px-1 rounded text-xs">target</code>.
                  </p>
                  <div className="mt-4 p-3 bg-cyber-card rounded-lg border border-cyber-border/30">
                    <p className="text-xs text-cyber-text-muted mb-1">Constraints:</p>
                    <ul className="text-xs text-cyber-text-dim space-y-1">
                      <li>- 2 &lt;= nums.length &lt;= 10^4</li>
                      <li>- Each input would have exactly one solution</li>
                      <li>- You may not use the same element twice</li>
                    </ul>
                  </div>
                </div>

                <AnimatePresence>
                  {showCode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="bg-cyber-surface rounded-lg border border-cyber-border/30 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-cyber-border/30">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-cyber-red/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-cyber-yellow/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-cyber-green/80" />
                            <span className="ml-2 text-xs text-cyber-text-muted font-mono">solution.ts</span>
                          </div>
                          <button className="text-xs text-cyber-text-muted hover:text-cyber-blue transition-colors">
                            Copy
                          </button>
                        </div>
                        <pre className="p-4 text-xs sm:text-sm font-mono text-cyber-text-dim overflow-x-auto">
                          <code>{sampleCode}</code>
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3 mb-6">
                  <button className="btn-cyber btn-cyber-primary text-sm">
                    <Play className="w-4 h-4" />
                    Run Code
                  </button>
                  <button className="btn-cyber btn-cyber-outline text-sm">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-cyber-text mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyber-green" />
                    Test Results
                  </h3>
                  <div className="space-y-2">
                    {testResults.map((test, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-cyber-card rounded-lg border border-cyber-border/20"
                      >
                        {test.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-cyber-green flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-cyber-red flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-cyber-text-muted">Input:</span>
                            <code className="text-cyber-blue font-mono truncate">{test.input}</code>
                          </div>
                          <div className="flex items-center gap-4 text-xs mt-1">
                            <span className="text-cyber-text-muted">Expected: <code className="text-cyber-green font-mono">{test.expected}</code></span>
                            <span className="text-cyber-text-muted">Output: <code className="text-cyber-blue font-mono">{test.output}</code></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-cyber-border/30 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-cyber-text-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Avg: 1.2s</span>
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Memory: 2.1MB</span>
                  <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> Beats: 78%</span>
                </div>
                <button className="btn-cyber btn-cyber-primary text-sm">
                  Submit Solution
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
