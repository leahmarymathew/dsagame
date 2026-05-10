import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function CyberButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: CyberButtonProps) {
  const baseClass = 'btn-cyber inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all';

  const variantClass = {
    primary: 'btn-cyber-primary',
    outline: 'btn-cyber-outline',
    ghost: 'bg-transparent border border-cyber-border/50 text-cyber-text-dim hover:text-cyber-text hover:border-cyber-border/80',
  }[variant];

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={`${baseClass} ${sizeClasses[size]} ${variantClass} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />}
      {children}
    </motion.button>
  );
}
