import { useState, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Cpu, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../lib/auth';

const AuthModal = lazy(() => import('./AuthModal'));

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Arena', path: '/arena' },
  { name: 'Compare', path: '/compare' },
  { name: 'Learn', path: '/learn' },
  { name: 'Leaderboard', path: '/leaderboard' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, isGuest, signOut } = useAuth();

  const displayName = user?.email?.split('@')[0] ?? (isGuest ? 'Guest' : null);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-border/50 bg-cyber-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Cpu className="w-8 h-8 text-cyber-blue transition-colors group-hover:text-cyber-purple" />
                <div className="absolute inset-0 w-8 h-8 bg-cyber-blue/20 rounded-full blur-lg group-hover:bg-cyber-purple/20 transition-colors" />
              </div>
              <span className="text-xl font-bold gradient-text">Techio</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-cyber-blue'
                      : 'text-cyber-text-dim hover:text-cyber-text'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user || isGuest ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-border/30">
                    <div className="w-5 h-5 rounded-full bg-cyber-blue/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-cyber-blue" />
                    </div>
                    <span className="text-xs font-medium text-cyber-text-dim max-w-[100px] truncate">
                      {displayName}
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-cyber-text-dim hover:text-cyber-text border border-cyber-border rounded-lg transition-all hover:border-cyber-red/30 hover:bg-cyber-red/5"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="btn-cyber btn-cyber-primary text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-cyber-text-dim hover:text-cyber-text border border-cyber-border rounded-lg transition-all hover:border-cyber-blue/30 hover:bg-cyber-blue/5"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-cyber-text-dim hover:text-cyber-text transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-cyber-border/50 bg-cyber-bg/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20'
                        : 'text-cyber-text-dim hover:text-cyber-text hover:bg-cyber-card'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {user || isGuest ? (
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="w-full block px-4 py-3 rounded-lg text-sm font-medium text-cyber-red hover:bg-cyber-red/10 text-left"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setAuthModalOpen(true); setIsOpen(false); }}
                    className="w-full block px-4 py-3 rounded-lg text-sm font-medium text-cyber-bg bg-gradient-to-r from-cyber-blue to-cyber-blue-dim text-center mt-2"
                  >
                    Sign In
                  </button>
                )}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-cyber-text-dim hover:text-cyber-text hover:bg-cyber-card transition-all"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <Suspense fallback={null}>
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </Suspense>
    </>
  );
}
