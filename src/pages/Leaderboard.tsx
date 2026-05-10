import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Crown, Search, Clock, CircleDot,
  Filter, Zap, GitBranch, Layers, Target, Cpu
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Run {
  id: string;
  username: string;
  algorithm: string;
  completion_time_ms: number;
  nodes_explored: number;
  efficiency_score: number;
  grid_size: number;
  created_at: string;
}

const algoIcons: Record<string, React.ElementType> = {
  bfs: Layers,
  dfs: GitBranch,
  dijkstra: Target,
  astar: Zap,
};

const algoColors: Record<string, string> = {
  bfs: 'text-cyan-400',
  dfs: 'text-amber-400',
  dijkstra: 'text-emerald-400',
  astar: 'text-rose-400',
};

const algoGlows: Record<string, string> = {
  bfs: 'bg-cyan-400/10',
  dfs: 'bg-amber-400/10',
  dijkstra: 'bg-emerald-400/10',
  astar: 'bg-rose-400/10',
};

const algoFilters = ['All', 'BFS', 'DFS', 'Dijkstra', 'A*'];
const algoFilterMap: Record<string, string> = { All: '', BFS: 'bfs', DFS: 'dfs', Dijkstra: 'dijkstra', 'A*': 'astar' };

export default function Leaderboard() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [algoFilter, setAlgoFilter] = useState('All');
  const [bestAlgo, setBestAlgo] = useState<{ algo: string; avgScore: number; avgTime: number; count: number } | null>(null);

  const fetchRuns = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('leaderboard_runs')
      .select('*')
      .order('efficiency_score', { ascending: false })
      .order('completion_time_ms', { ascending: true })
      .limit(50);

    const algoKey = algoFilterMap[algoFilter];
    if (algoKey) query = query.eq('algorithm', algoKey);

    const { data, error } = await query;
    if (!error && data) {
      let filtered = data as Run[];
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (r) => r.username.toLowerCase().includes(q) || r.algorithm.toLowerCase().includes(q)
        );
      }
      setRuns(filtered);
    }
    setLoading(false);
  }, [algoFilter, search]);

  const fetchBestAlgo = useCallback(async () => {
    const { data } = await supabase
      .from('leaderboard_runs')
      .select('algorithm, efficiency_score, completion_time_ms');
    if (!data || data.length === 0) { setBestAlgo(null); return; }

    const buckets: Record<string, { total: number; score: number; time: number }> = {};
    for (const r of data) {
      if (!buckets[r.algorithm]) buckets[r.algorithm] = { total: 0, score: 0, time: 0 };
      buckets[r.algorithm].total++;
      buckets[r.algorithm].score += r.efficiency_score;
      buckets[r.algorithm].time += r.completion_time_ms;
    }

    let best: string | null = null;
    let bestAvg = -1;
    for (const [algo, b] of Object.entries(buckets)) {
      const avg = b.score / b.total;
      if (avg > bestAvg) { bestAvg = avg; best = algo; }
    }

    if (best && buckets[best]) {
      const b = buckets[best];
      setBestAlgo({ algo: best, avgScore: Math.round(b.score / b.total), avgTime: Math.round(b.time / b.total), count: b.total });
    }
  }, []);

  useEffect(() => { fetchRuns(); }, [fetchRuns]);
  useEffect(() => { fetchBestAlgo(); }, [fetchBestAlgo]);

  const topThree = runs.slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-cyber-yellow" />
            <h1 className="text-3xl font-bold text-cyber-text">Leaderboard</h1>
          </div>
          <p className="text-cyber-text-dim">Top algorithm runs ranked by efficiency.</p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex-1 flex items-center gap-2 w-full sm:w-auto">
            <Search className="w-4 h-4 text-cyber-text-muted flex-shrink-0" />
            <input
              type="text" placeholder="Search by username or algorithm..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-cyber-text placeholder-cyber-text-muted outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-cyber-text-muted flex-shrink-0" />
            {algoFilters.map((f) => (
              <button
                key={f} onClick={() => setAlgoFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  algoFilter === f
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                    : 'text-cyber-text-muted border border-cyber-border/50 hover:border-cyber-border'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Best algorithm card */}
        {bestAlgo && (
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg ${algoGlows[bestAlgo.algo] || 'bg-cyber-blue/10'} flex items-center justify-center flex-shrink-0`}>
              {(() => { const Icon = algoIcons[bestAlgo.algo] || Cpu; return <Icon className={`w-5 h-5 ${algoColors[bestAlgo.algo] || 'text-cyber-blue'}`} />; })()}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cyber-text">Best Performing Algorithm</h3>
              <p className="text-xs text-cyber-text-muted mt-0.5">
                {bestAlgo.algo.toUpperCase()} averages {bestAlgo.avgScore}/100 efficiency across {bestAlgo.count} runs
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <p className="text-cyber-text-muted">Avg Score</p>
                <p className="font-mono font-semibold text-cyber-green">{bestAlgo.avgScore}</p>
              </div>
              <div className="text-center">
                <p className="text-cyber-text-muted">Avg Time</p>
                <p className="font-mono font-semibold text-cyber-blue">{bestAlgo.avgTime}ms</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 podium */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {topThree.map((run, i) => {
              const Icon = algoIcons[run.algorithm] || Cpu;
              const color = algoColors[run.algorithm] || 'text-cyber-blue';
              const glow = algoGlows[run.algorithm] || 'bg-cyber-blue/10';
              return (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                  className={`glass-card rounded-xl p-6 text-center relative overflow-hidden ${i === 0 ? 'border-cyber-yellow/30 neon-border-blue' : ''}`}
                >
                  {i === 0 && <div className="absolute inset-0 bg-gradient-to-b from-cyber-yellow/5 to-transparent" />}
                  <div className="relative">
                    <div className="flex justify-center mb-3">
                      {i === 0 ? <Crown className="w-9 h-9 text-cyber-yellow" /> : i === 1 ? <Medal className="w-9 h-9 text-gray-300" /> : <Medal className="w-9 h-9 text-amber-700" />}
                    </div>
                    <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold ${glow} ${color} border border-cyber-border/30`}>
                      {run.username.slice(0, 2).toUpperCase()}
                    </div>
                    <h3 className="text-base font-semibold text-cyber-text mb-0.5">{run.username}</h3>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span className="text-xs text-cyber-text-muted">{run.algorithm.toUpperCase()}</span>
                    </div>
                    <div className="text-2xl font-bold gradient-text mb-2">{run.efficiency_score}<span className="text-sm text-cyber-text-muted">/100</span></div>
                    <div className="flex items-center justify-center gap-4 text-xs text-cyber-text-muted">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{run.completion_time_ms.toFixed(1)}ms</span>
                      <span className="flex items-center gap-1"><CircleDot className="w-3 h-3" />{run.nodes_explored} nodes</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-cyber-border/30 text-xs font-medium text-cyber-text-muted">
            <div className="col-span-1">#</div>
            <div className="col-span-3">User</div>
            <div className="col-span-2 hidden sm:block">Algorithm</div>
            <div className="col-span-2 hidden sm:block">Time</div>
            <div className="col-span-2 hidden sm:block">Nodes</div>
            <div className="col-span-6 sm:col-span-2 text-right">Score</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
            </div>
          ) : runs.length === 0 ? (
            <div className="py-12 text-center text-sm text-cyber-text-muted">
              No runs recorded yet. Head to the Arena to set a score!
            </div>
          ) : (
            runs.map((run, i) => {
              const Icon = algoIcons[run.algorithm] || Cpu;
              const color = algoColors[run.algorithm] || 'text-cyber-blue';
              return (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}
                  className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-cyber-border/10 hover:bg-cyber-card/30 transition-colors items-center"
                >
                  <div className="col-span-1">
                    <span className={`text-sm font-bold ${i < 3 ? 'text-cyber-yellow' : 'text-cyber-text-muted'}`}>
                      {i + 1}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-cyber-card flex items-center justify-center text-[10px] font-bold text-cyber-text-dim border border-cyber-border/30">
                      {run.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-cyber-text truncate">{run.username}</span>
                  </div>
                  <div className="col-span-2 hidden sm:flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-xs text-cyber-text-dim">{run.algorithm.toUpperCase()}</span>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className="text-sm font-mono text-cyber-text-dim">{run.completion_time_ms.toFixed(1)}ms</span>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className="text-sm font-mono text-cyber-text-dim">{run.nodes_explored}</span>
                  </div>
                  <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-cyber-card rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${run.efficiency_score >= 80 ? 'bg-emerald-400' : run.efficiency_score >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                        style={{ width: `${run.efficiency_score}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-semibold text-cyber-blue w-8 text-right">{run.efficiency_score}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
