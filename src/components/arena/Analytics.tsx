export interface AnalyticsProps {
  nodesVisited: number;
  pathLength: number;
  elapsedMs: number;
  foundPath: boolean;
}

export default function Analytics({
  nodesVisited,
  pathLength,
  elapsedMs,
  foundPath,
}: AnalyticsProps) {
  return (
    <section className="rounded-lg border border-cyber-border/30 bg-cyber-card/40 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-cyber-text">Analytics</h3>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Stat label="Nodes" value={nodesVisited} />
        <Stat label="Path" value={pathLength} />
        <Stat label="Time" value={`${elapsedMs.toFixed(1)} ms`} />
        <Stat label="Status" value={foundPath ? 'Found' : 'Not Found'} />
      </div>
    </section>
  );
}

interface StatProps {
  label: string;
  value: number | string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-md border border-cyber-border/20 bg-cyber-bg/40 p-2">
      <p className="text-cyber-text-muted">{label}</p>
      <p className="mt-1 text-cyber-text font-mono">{value}</p>
    </div>
  );
}
