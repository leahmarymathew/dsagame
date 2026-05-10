import { motion } from 'framer-motion';
import { BarChart3, CircleDot, Route, Clock, ArrowLeftRight } from 'lucide-react';

interface AlgoMetrics {
  nodesExplored: number;
  pathLength: number;
  pathCost: number;
  executionTime: number;
  found: boolean;
}

interface ComparisonPanelProps {
  algoA: string;
  algoB: string;
  metricsA: AlgoMetrics;
  metricsB: AlgoMetrics;
  complexityA: string;
  complexityB: string;
}

const algoLabels: Record<string, string> = {
  bfs: 'BFS',
  dfs: 'DFS',
  dijkstra: 'Dijkstra',
  astar: 'A*',
};

const colorA = { text: 'text-cyan-400', bg: 'bg-cyan-400/15', bar: 'bg-cyan-400/60', barGlow: 'shadow-[0_0_8px_rgba(0,212,255,0.3)]' };
const colorB = { text: 'text-amber-400', bg: 'bg-amber-400/15', bar: 'bg-amber-400/60', barGlow: 'shadow-[0_0_8px_rgba(180,83,9,0.3)]' };

function BarComparison({ label, icon: Icon, valueA, valueB, unit }: {
  label: string;
  icon: React.ElementType;
  valueA: number;
  valueB: number;
  unit?: string;
}) {
  const max = Math.max(valueA, valueB, 1);
  const pctA = (valueA / max) * 100;
  const pctB = (valueB / max) * 100;
  const winner = valueA < valueB ? 'a' : valueB < valueA ? 'b' : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-cyber-text-muted" />
        <span className="text-xs font-medium text-cyber-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono w-6 ${colorA.text}`}>{algoLabels[label] ? '' : ''}</span>
          <div className="flex-1 h-3 bg-cyber-card rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctA}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${colorA.bar} ${winner === 'a' ? colorA.barGlow : ''}`}
            />
          </div>
          <span className={`text-xs font-mono w-16 text-right ${winner === 'a' ? colorA.text : 'text-cyber-text-dim'}`}>
            {valueA}{unit || ''} {winner === 'a' && valueA !== valueB ? ' *' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono w-6 ${colorB.text}`}>{algoLabels[label] ? '' : ''}</span>
          <div className="flex-1 h-3 bg-cyber-card rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctB}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className={`h-full rounded-full ${colorB.bar} ${winner === 'b' ? colorB.barGlow : ''}`}
            />
          </div>
          <span className={`text-xs font-mono w-16 text-right ${winner === 'b' ? colorB.text : 'text-cyber-text-dim'}`}>
            {valueB}{unit || ''} {winner === 'b' && valueA !== valueB ? ' *' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonPanel({
  algoA,
  algoB,
  metricsA,
  metricsB,
  complexityA,
  complexityB,
}: ComparisonPanelProps) {
  const hasResults = metricsA.found || metricsB.found;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-cyber-border/30">
        <h2 className="text-sm font-semibold text-cyber-text flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyber-purple" />
          Comparison
        </h2>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1.5 rounded-md ${colorA.bg} border border-cyan-400/20`}>
            <span className={`text-sm font-semibold ${colorA.text}`}>{algoLabels[algoA] || algoA}</span>
            <span className="text-[10px] text-cyber-text-muted ml-1.5 font-mono">{complexityA}</span>
          </div>
          <ArrowLeftRight className="w-4 h-4 text-cyber-text-muted" />
          <div className={`px-3 py-1.5 rounded-md ${colorB.bg} border border-amber-400/20`}>
            <span className={`text-sm font-semibold ${colorB.text}`}>{algoLabels[algoB] || algoB}</span>
            <span className="text-[10px] text-cyber-text-muted ml-1.5 font-mono">{complexityB}</span>
          </div>
        </div>

        {hasResults ? (
          <div className="space-y-4">
            <BarComparison
              label="Nodes Explored"
              icon={CircleDot}
              valueA={metricsA.nodesExplored}
              valueB={metricsB.nodesExplored}
            />
            <BarComparison
              label="Path Length"
              icon={Route}
              valueA={metricsA.pathLength}
              valueB={metricsB.pathLength}
            />
            <BarComparison
              label="Path Cost"
              icon={Route}
              valueA={metricsA.pathCost}
              valueB={metricsB.pathCost}
            />
            <BarComparison
              label="Exec Time"
              icon={Clock}
              valueA={Number(metricsA.executionTime.toFixed(1))}
              valueB={Number(metricsB.executionTime.toFixed(1))}
              unit="ms"
            />
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-cyber-text-muted">
            Run comparison to see results
          </div>
        )}

        {hasResults && (
          <div className="text-[10px] text-cyber-text-muted border-t border-cyber-border/20 pt-3">
            * lower is better
          </div>
        )}
      </div>
    </motion.div>
  );
}
