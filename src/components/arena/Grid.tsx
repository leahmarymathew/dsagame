import Cell, { type CellKind } from './Cell';

export interface GridNode {
  row: number;
  col: number;
  kind: CellKind;
  weight?: number;
}

export interface GridProps {
  rows: number;
  cols: number;
  cells?: GridNode[];
  onCellClick?: (row: number, col: number) => void;
}

export default function Grid({ rows, cols, cells = [], onCellClick }: GridProps) {
  const map = new Map(cells.map((cell) => [`${cell.row}:${cell.col}`, cell]));

  return (
    <div className="inline-grid gap-[2px] rounded-lg border border-cyber-border/30 bg-cyber-bg/40 p-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: rows * cols }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const node = map.get(`${row}:${col}`);

        return (
          <Cell
            key={`${row}-${col}`}
            row={row}
            col={col}
            kind={node?.kind ?? 'empty'}
            weight={node?.weight ?? 1}
            onPointerDown={onCellClick}
          />
        );
      })}
    </div>
  );
}
