export interface ComparisonMetrics {
  name: string;
  nodesVisited: number;
  pathLength: number;
  elapsedMs: number;
}

export interface ComparisonProps {
  left: ComparisonMetrics;
  right: ComparisonMetrics;
}

export default function Comparison({ left, right }: ComparisonProps) {
  return (
    <section className="rounded-lg border border-cyber-border/30 bg-cyber-card/40 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-cyber-text">Comparison</h3>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-cyber-text-muted">
            <th className="text-left py-1">Metric</th>
            <th className="text-right py-1">{left.name}</th>
            <th className="text-right py-1">{right.name}</th>
          </tr>
        </thead>
        <tbody>
          <Row label="Nodes" left={left.nodesVisited} right={right.nodesVisited} />
          <Row label="Path" left={left.pathLength} right={right.pathLength} />
          <Row label="Time (ms)" left={left.elapsedMs.toFixed(1)} right={right.elapsedMs.toFixed(1)} />
        </tbody>
      </table>
    </section>
  );
}

interface RowProps {
  label: string;
  left: number | string;
  right: number | string;
}

function Row({ label, left, right }: RowProps) {
  return (
    <tr className="border-t border-cyber-border/20">
      <td className="py-1.5 text-cyber-text-muted">{label}</td>
      <td className="py-1.5 text-right font-mono text-cyber-text">{left}</td>
      <td className="py-1.5 text-right font-mono text-cyber-text">{right}</td>
    </tr>
  );
}
