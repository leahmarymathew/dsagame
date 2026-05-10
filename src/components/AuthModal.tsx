import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, User } from 'lucide-react';
import { useAuth } from '../lib/auth';
import CyberButton from './ui/CyberButton';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = useCallback(() => {
    setEmail('');
    setPassword('');
    setError(null);
    setShowPw(false);
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const switchMode = useCallback((m: 'login' | 'signup') => {
    setMode(m);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const fn = mode === 'login' ? signIn : signUp;
    const { error: err } = await fn(email, password);

    if (err) {
      setError(err);
      setSubmitting(false);
      return;
    }

    handleClose();
  }, [mode, email, password, signIn, signUp, handleClose]);

  const handleGuest = useCallback(() => {
    continueAsGuest();
    handleClose();
  }, [continueAsGuest, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden neon-border-blue"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 text-cyber-text-muted hover:text-cyber-text transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyber-blue/10 flex items-center justify-center mx-auto mb-3">
                  {mode === 'login' ? (
                    <LogIn className="w-6 h-6 text-cyber-blue" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-cyber-blue" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-cyber-text">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-cyber-text-muted mt-1">
                  {mode === 'login' ? 'Sign in to track your progress' : 'Join Techio and start solving'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 bg-cyber-card border border-cyber-border/50 rounded-lg text-sm text-cyber-text placeholder-cyber-text-muted focus:outline-none focus:border-cyber-blue/50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-text-muted" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 bg-cyber-card border border-cyber-border/50 rounded-lg text-sm text-cyber-text placeholder-cyber-text-muted focus:outline-none focus:border-cyber-blue/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-text-muted hover:text-cyber-text transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-cyber-red bg-cyber-red/10 border border-cyber-red/20 rounded-lg px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}

                <CyberButton
                  type="submit"
                  loading={submitting}
                  className="w-full justify-center"
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </CyberButton>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-cyber-border/30" />
                <span className="text-xs text-cyber-text-muted">or</span>
                <div className="flex-1 h-px bg-cyber-border/30" />
              </div>

              <button
                onClick={handleGuest}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-cyber-text-dim border border-cyber-border/50 rounded-lg hover:bg-cyber-card/50 hover:border-cyber-border transition-all"
              >
                <User className="w-4 h-4" />
                Continue as Guest
              </button>

              <p className="text-center text-xs text-cyber-text-muted mt-5">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-cyber-blue hover:underline font-medium"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
