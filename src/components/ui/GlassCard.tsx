import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

export interface GlassCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
  ...motionProps
}: GlassCardProps) {
  const baseClass = `glass-card rounded-xl overflow-hidden ${glow ? 'neon-border-blue' : ''}`;
  const hoverClass = hover ? 'glass-card-hover cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseClass} ${hoverClass} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
