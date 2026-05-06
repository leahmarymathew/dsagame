import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Crown, TrendingUp,
  ChevronUp, ChevronDown, Flame, Target
} from 'lucide-react';

const timeframes = ['Weekly', 'Monthly', 'All Time'];

const leaderboardData = [
  { rank: 1, name: 'AlgoMaster', score: 2847, solved: 312, streak: 45, trend: 'up', avatar: 'AM' },
  { rank: 2, name: 'ByteWizard', score: 2691, solved: 298, streak: 38, trend: 'up', avatar: 'BW' },
  { rank: 3, name: 'CodeNinja', score: 2534, solved: 287, streak: 52, trend: 'same', avatar: 'CN' },
  { rank: 4, name: 'RecursionKing', score: 2412, solved: 275, streak: 29, trend: 'down', avatar: 'RK' },
  { rank: 5, name: 'DataStructPro', score: 2356, solved: 268, streak: 33, trend: 'up', avatar: 'DP' },
  { rank: 6, name: 'GraphGuru', score: 2201, solved: 251, streak: 21, trend: 'down', avatar: 'GG' },
  { rank: 7, name: 'SortSage', score: 2145, solved: 245, streak: 18, trend: 'up', avatar: 'SS' },
  { rank: 8, name: 'BinaryBoss', score: 2089, solved: 239, streak: 27, trend: 'same', avatar: 'BB' },
  { rank: 9, name: 'TreeTraverser', score: 1978, solved: 228, streak: 15, trend: 'up', avatar: 'TT' },
  { rank: 10, name: 'HeapHero', score: 1923, solved: 221, streak: 12, trend: 'down', avatar: 'HH' },
  { rank: 11, name: 'DPDynamo', score: 1867, solved: 215, streak: 22, trend: 'up', avatar: 'DD' },
  { rank: 12, name: 'QueueQueen', score: 1812, solved: 208, streak: 9, trend: 'same', avatar: 'QQ' },
  { rank: 13, name: 'StackStar', score: 1756, solved: 201, streak: 14, trend: 'up', avatar: 'ST' },
  { rank: 14, name: 'LinkedListLord', score: 1701, solved: 195, streak: 8, trend: 'down', avatar: 'LL' },
  { rank: 15, name: 'HashHunter', score: 1645, solved: 189, streak: 11, trend: 'up', avatar: 'HH' },
];

const topThree = leaderboardData.slice(0, 3);

export default function Leaderboard() {
  const [activeTimeframe, setActiveTimeframe] = useState('Weekly');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-cyber-yellow" />
            <h1 className="text-3xl font-bold text-cyber-text">Leaderboard</h1>
          </div>
          <p className="text-cyber-text-dim">See how you rank against the best algorithm solvers.</p>
        </motion.div>

        <div className="flex items-center gap-2 mb-8">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTimeframe === tf
                  ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                  : 'text-cyber-text-muted hover:text-cyber-text-dim border border-cyber-border/50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {topThree.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`glass-card rounded-xl p-6 text-center relative overflow-hidden ${
                i === 0 ? 'border-cyber-yellow/30 neon-border-blue' : ''
              }`}
            >
              {i === 0 && (
                <div className="absolute inset-0 bg-gradient-to-b from-cyber-yellow/5 to-transparent" />
              )}
              <div className="relative">
                <div className="flex justify-center mb-4">
                  {i === 0 ? (
                    <Crown className="w-10 h-10 text-cyber-yellow" />
                  ) : i === 1 ? (
                    <Medal className="w-10 h-10 text-gray-300" />
                  ) : (
                    <Medal className="w-10 h-10 text-amber-700" />
                  )}
                </div>
                <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold ${
                  i === 0 ? 'bg-cyber-yellow/20 text-cyber-yellow border-2 border-cyber-yellow/40' :
                  i === 1 ? 'bg-gray-500/20 text-gray-300 border-2 border-gray-500/40' :
                  'bg-amber-800/20 text-amber-600 border-2 border-amber-700/40'
                }`}>
                  {user.avatar}
                </div>
                <h3 className="text-lg font-semibold text-cyber-text mb-1">{user.name}</h3>
                <div className="text-2xl font-bold gradient-text mb-3">{user.score.toLocaleString()}</div>
                <div className="flex items-center justify-center gap-4 text-xs text-cyber-text-muted">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" />{user.solved} solved</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-cyber-yellow" />{user.streak} day streak</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-cyber-border/30 text-xs font-medium text-cyber-text-muted">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4 sm:col-span-3">User</div>
            <div className="col-span-2 hidden sm:block">Score</div>
            <div className="col-span-2 hidden sm:block">Solved</div>
            <div className="col-span-2 hidden sm:block">Streak</div>
            <div className="col-span-7 sm:col-span-1 text-right">Trend</div>
          </div>

          {leaderboardData.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-cyber-border/10 hover:bg-cyber-card/30 transition-colors items-center"
            >
              <div className="col-span-1">
                <span className={`text-sm font-bold ${
                  user.rank <= 3 ? 'text-cyber-yellow' : 'text-cyber-text-muted'
                }`}>
                  #{user.rank}
                </span>
              </div>
              <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-card flex items-center justify-center text-xs font-bold text-cyber-text-dim border border-cyber-border/30">
                  {user.avatar}
                </div>
                <span className="text-sm font-medium text-cyber-text truncate">{user.name}</span>
              </div>
              <div className="col-span-2 hidden sm:block">
                <span className="text-sm font-semibold text-cyber-blue">{user.score.toLocaleString()}</span>
              </div>
              <div className="col-span-2 hidden sm:block">
                <span className="text-sm text-cyber-text-dim">{user.solved}</span>
              </div>
              <div className="col-span-2 hidden sm:flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-cyber-yellow" />
                <span className="text-sm text-cyber-text-dim">{user.streak}</span>
              </div>
              <div className="col-span-7 sm:col-span-1 flex items-center justify-end gap-1">
                {user.trend === 'up' && <ChevronUp className="w-4 h-4 text-cyber-green" />}
                {user.trend === 'down' && <ChevronDown className="w-4 h-4 text-cyber-red" />}
                {user.trend === 'same' && <TrendingUp className="w-4 h-4 text-cyber-text-muted" />}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
