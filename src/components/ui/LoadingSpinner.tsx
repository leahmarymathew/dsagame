import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'white';
}

const sizeMap = { sm: 4, md: 6, lg: 10 };
const colorMap = { blue: 'border-cyber-blue', green: 'border-cyber-green', white: 'border-cyber-text' };

export default function LoadingSpinner({ size = 'md', color = 'blue' }: LoadingSpinnerProps) {
  const sizeClass = `w-${sizeMap[size]} h-${sizeMap[size]}`;
  const colorClass = colorMap[color];

  return (
    <motion.div
      className={`${sizeClass} border-2 border-current/20 ${colorClass} rounded-full animate-spin`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}
