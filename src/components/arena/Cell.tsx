export type CellKind = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'exploring' | 'weight2' | 'weight3' | 'weight5';

export interface CellProps {
  row: number;
  col: number;
  kind: CellKind;
  weight?: number;
  disabled?: boolean;
  onPointerDown?: (row: number, col: number) => void;
  onPointerEnter?: (row: number, col: number) => void;
}

const kindClassName: Record<CellKind, string> = {
  empty: 'bg-[#12121a] border-[#1e1e2e]/60 hover:bg-[#1a1a2a] hover:border-cyan-500/20',
  wall: 'bg-[#3a3a4a] border-[#4a4a5a]/80 shadow-[inset_0_0_4px_rgba(0,0,0,0.4)]',
  start: 'bg-emerald-400 border-emerald-400/70 shadow-[0_0_12px_rgba(52,211,153,0.6),inset_0_0_6px_rgba(255,255,255,0.2)]',
  end: 'bg-rose-400 border-rose-400/70 shadow-[0_0_12px_rgba(251,113,133,0.6),inset_0_0_6px_rgba(255,255,255,0.2)]',
  visited: 'bg-cyan-500/25 border-cyan-500/15 shadow-[0_0_4px_rgba(0,212,255,0.15)]',
  path: 'bg-violet-500/50 border-violet-500/30 shadow-[0_0_8px_rgba(139,92,246,0.4)]',
  exploring: 'bg-cyan-400/50 border-cyan-400/30 shadow-[0_0_10px_rgba(0,212,255,0.5)]',
  weight2: 'bg-amber-900/40 border-amber-700/30 shadow-[inset_0_0_6px_rgba(180,83,9,0.2)]',
  weight3: 'bg-orange-900/40 border-orange-700/30 shadow-[inset_0_0_6px_rgba(194,65,12,0.25)]',
  weight5: 'bg-red-900/40 border-red-700/30 shadow-[inset_0_0_8px_rgba(185,28,28,0.3)]',
};

export default function Cell({
  row,
  col,
  kind,
  weight = 1,
  disabled = false,
  onPointerDown,
  onPointerEnter,
}: CellProps) {
  return (
    <button
      type="button"
      className={`aspect-square rounded-[3px] border transition-colors duration-100 ${kindClassName[kind]} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      aria-label={`cell-${row}-${col}`}
      onPointerDown={() => onPointerDown?.(row, col)}
      onPointerEnter={() => onPointerEnter?.(row, col)}
      disabled={disabled}
    >
      {weight > 1 ? <span className="text-[10px] text-cyber-text-muted">{weight}</span> : null}
    </button>
  );
}
