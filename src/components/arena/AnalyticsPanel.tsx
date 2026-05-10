import { motion } from 'framer-motion';
import {
  BarChart3, Clock, Route,
  Activity, CircleDot, Cpu, Database, Gauge
} from 'lucide-react';

interface AnalyticsPanelProps {
  nodesExplored: number;
  pathLength: number;
  pathCost: number;
  executionTime: number;
  complexity: string;
  algorithm: string;
  status: 'idle' | 'running' | 'complete' | 'no-path';
}

const statusConfig = {
  idle: { label: 'Ready', color: 'text-cyber-text-muted', bg: 'bg-cyber-card', dot: 'bg-cyber-text-muted' },
  running: { label: 'Running', color: 'text-cyber-blue', bg: 'bg-cyber-blue/10', dot: 'bg-cyber-blue animate-pulse' },
  complete: { label: 'Path Found', color: 'text-cyber-green', bg: 'bg-cyber-green/10', dot: 'bg-cyber-green' },
  'no-path': { label: 'No Path', color: 'text-cyber-red', bg: 'bg-cyber-red/10', dot: 'bg-cyber-red' },
};

const timeComplexities: Record<string, string> = {
  bfs: 'O(V + E)',
  dfs: 'O(V + E)',
  dijkstra: 'O(V + E log V)',
  astar: 'O(E log V)',
  greedy: 'O(E log V)',
};

const spaceComplexities: Record<string, string> = {
  bfs: 'O(V)',
  dfs: 'O(V)',
  dijkstra: 'O(V)',
  astar: 'O(V)',
  greedy: 'O(V)',
};

function EfficiencyGauge({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  const stroke = score >= 80 ? '#34d399' : score >= 50 ? '#fbbf24' : '#fb7185';

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <motion.circle
          cx="32" cy="32" r={radius} fill="none" stroke={stroke} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <span className={`absolute text-xs font-bold font-mono ${color}`}>{score}</span>
    </div>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 bg-cyber-card rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

export default function AnalyticsPanel({
  nodesExplored,
  pathLength,
  pathCost,
  executionTime,
  complexity,
  algorithm,
  status,
}: AnalyticsPanelProps) {
  const statusInfo = statusConfig[status];
  const tc = timeComplexities[algorithm] || complexity;
  const sc = spaceComplexities[algorithm] || 'O(V)';

  const totalCells = 20 * 20;
  const explorationPct = totalCells > 0 ? (nodesExplored / totalCells) * 100 : 0;
  const efficiencyScore = status === 'complete'
    ? Math.round(Math.max(0, Math.min(100, 100 - explorationPct + (pathLength > 0 ? 20 : 0))))
    : 0;

  const stats = [
    { icon: CircleDot, label: 'Nodes Explored', value: nodesExplored, color: 'text-cyber-blue', glow: 'bg-cyber-blue/10' },
    { icon: Route, label: 'Path Length', value: pathLength, color: 'text-cyber-purple', glow: 'bg-cyber-purple/10' },
    { icon: Route, label: 'Path Cost', value: pathCost > 0 ? pathCost : '--', color: 'text-amber-400', glow: 'bg-amber-400/10' },
    { icon: Clock, label: 'Execution Time', value: executionTime > 0 ? `${executionTime.toFixed(1)}ms` : '--', color: 'text-cyber-green', glow: 'bg-cyber-green/10' },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col"
    >
      <div className="px-5 py-4 border-b border-cyber-border/30">
        <h2 className="text-sm font-semibold text-cyber-text flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyber-purple" />
          Analytics
        </h2>
      </div>

      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {/* Status */}
        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${statusInfo.bg} border border-cyber-border/20`}>
          <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
          <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>

        {/* Efficiency gauge + complexity */}
        <div className="flex items-center gap-4 p-3 bg-cyber-card/50 rounded-lg border border-cyber-border/20">
          <EfficiencyGauge score={efficiencyScore} />
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyber-yellow" />
              <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider">Time</span>
              <span className="text-xs font-mono text-cyber-yellow ml-auto">{tc}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyber-blue" />
              <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider">Space</span>
              <span className="text-xs font-mono text-cyber-blue ml-auto">{sc}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider">Efficiency</span>
              <span className="text-xs font-mono text-emerald-400 ml-auto">{efficiencyScore}/100</span>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 p-3 bg-cyber-card/50 rounded-lg border border-cyber-border/20">
              <div className={`w-8 h-8 rounded-md ${stat.glow} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cyber-text-muted">{stat.label}</p>
                <p className={`text-sm font-semibold font-mono ${stat.color} truncate`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Execution time chart */}
        <div className="p-3 bg-cyber-card/50 rounded-lg border border-cyber-border/20 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyber-green" />
            <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider">Execution Timeline</span>
          </div>
          <MiniBar value={executionTime} max={500} color="bg-cyber-green/60" />
          <div className="flex justify-between text-[9px] font-mono text-cyber-text-dim">
            <span>0ms</span>
            <span>500ms</span>
          </div>
        </div>

        {/* Exploration chart */}
        <div className="p-3 bg-cyber-card/50 rounded-lg border border-cyber-border/20 space-y-2">
          <div className="flex items-center gap-2">
            <CircleDot className="w-3.5 h-3.5 text-cyber-blue" />
            <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider">Grid Coverage</span>
            <span className="text-[10px] font-mono text-cyber-blue ml-auto">{explorationPct.toFixed(1)}%</span>
          </div>
          <MiniBar value={nodesExplored} max={totalCells} color="bg-cyber-blue/60" />
          <div className="flex justify-between text-[9px] font-mono text-cyber-text-dim">
            <span>0</span>
            <span>{totalCells} cells</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-cyber-border/30">
        <div className="flex items-center gap-2 text-xs text-cyber-text-muted">
          <Activity className="w-3.5 h-3.5" />
          <span>Real-time metrics update during execution</span>
        </div>
      </div>
    </motion.aside>
  );
}
