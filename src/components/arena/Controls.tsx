export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export interface ControlsProps {
  algorithm: AlgorithmType;
  isRunning?: boolean;
  onAlgorithmChange?: (value: AlgorithmType) => void;
  onStart?: () => void;
  onReset?: () => void;
}

export default function Controls({
  algorithm,
  isRunning = false,
  onAlgorithmChange,
  onStart,
  onReset,
}: ControlsProps) {
  return (
    <section className="rounded-lg border border-cyber-border/30 bg-cyber-card/40 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-cyber-text">Controls</h3>

      <label className="block text-xs text-cyber-text-muted">
        Algorithm
        <select
          className="mt-1 w-full rounded-md border border-cyber-border/40 bg-cyber-bg/60 px-3 py-2 text-sm"
          value={algorithm}
          disabled={isRunning}
          onChange={(event) => onAlgorithmChange?.(event.target.value as AlgorithmType)}
        >
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
        </select>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onStart}
          disabled={isRunning}
          className="rounded-md bg-cyber-blue/20 px-3 py-2 text-sm text-cyber-blue disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isRunning}
          className="rounded-md bg-cyber-card px-3 py-2 text-sm text-cyber-text-muted disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
