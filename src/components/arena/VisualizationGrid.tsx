import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, Move, Crosshair } from 'lucide-react';
import ArenaCell from './Cell';

export type CellState = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'exploring' | 'weight2' | 'weight3' | 'weight5';

export interface Cell {
  row: number;
  col: number;
  state: CellState;
  weight: number;
}

interface VisualizationGridProps {
  grid: Cell[][];
  onCellClick: (row: number, col: number) => void;
  onCellDrag: (row: number, col: number) => void;
  isRunning: boolean;
  interactionMode: 'wall' | 'start' | 'end';
}

const modeIcons = {
  wall: Move,
  start: Crosshair,
  end: Crosshair,
};

export default function VisualizationGrid({
  grid,
  onCellClick,
  onCellDrag,
  isRunning,
  interactionMode,
}: VisualizationGridProps) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const isDragging = useRef(false);
  const ModeIcon = modeIcons[interactionMode];

  const handlePointerDown = useCallback((row: number, col: number) => {
    isDragging.current = true;
    onCellClick(row, col);
  }, [onCellClick]);

  const handlePointerEnter = useCallback((row: number, col: number) => {
    if (isDragging.current) {
      onCellDrag(row, col);
    }
  }, [onCellDrag]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-cyber-text flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-cyber-blue" />
          Visualization
          <span className="text-xs font-normal text-cyber-text-muted flex items-center gap-1 ml-2">
            <ModeIcon className="w-3 h-3" />
            {interactionMode === 'wall' ? 'Draw walls' : interactionMode === 'start' ? 'Place start' : 'Place end'}
          </span>
        </h2>
        <div className="flex items-center gap-3 text-[11px] text-cyber-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" /> Start
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-rose-400 shadow-[0_0_4px_rgba(251,113,133,0.5)]" /> End
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#3a3a4a]" /> Wall
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-cyan-500/25" /> Visited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-violet-500/50" /> Path
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-900/40" /> x2
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-orange-900/40" /> x3
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-red-900/40" /> x5
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex-1 flex items-center justify-center">
        <div
          className="grid w-full max-w-[640px] aspect-square select-none touch-none"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: '1px',
          }}
        >
          <AnimatePresence mode="popLayout">
            {grid.map((row, ri) =>
              row.map((cell, ci) => {
                return (
                  <motion.div
                    key={`${ri}-${ci}`}
                    layout
                    initial={false}
                    animate={{
                      scale: cell.state === 'exploring'
                        ? [1, 1.15, 1]
                        : cell.state === 'path'
                        ? [1, 1.08, 1]
                        : 1,
                    }}
                    transition={
                      cell.state === 'exploring' || cell.state === 'path'
                        ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.1 }
                    }
                  >
                    <ArenaCell
                      row={ri}
                      col={ci}
                      kind={cell.state}
                      weight={cell.weight}
                      disabled={isRunning}
                      onPointerDown={handlePointerDown}
                      onPointerEnter={handlePointerEnter}
                    />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
