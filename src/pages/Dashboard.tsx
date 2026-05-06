import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Clock, Target, Flame,
  BookOpen, Trophy, ArrowUpRight, Code2, Zap
} from 'lucide-react';

const stats = [
  { label: 'Problems Solved', value: '142', change: '+12', icon: Target, color: 'text-cyber-blue' },
  { label: 'Current Streak', value: '7 days', change: '+2', icon: Flame, color: 'text-cyber-yellow' },
  { label: 'Global Rank', value: '#847', change: '+23', icon: Trophy, color: 'text-cyber-purple' },
  { label: 'Avg Speed', value: '1.2s', change: '-0.3s', icon: Clock, color: 'text-cyber-green' },
];

const recentActivity = [
  { name: 'Binary Search', status: 'Solved', time: '2m ago', difficulty: 'Easy' },
  { name: 'Merge Sort', status: 'Solved', time: '15m ago', difficulty: 'Medium' },
  { name: 'Dijkstra\'s Algorithm', status: 'Attempted', time: '1h ago', difficulty: 'Hard' },
  { name: 'Quick Sort', status: 'Solved', time: '2h ago', difficulty: 'Medium' },
  { name: 'BFS Graph Traversal', status: 'Solved', time: '3h ago', difficulty: 'Medium' },
];

const skillBreakdown = [
  { name: 'Sorting', progress: 85, color: 'bg-cyber-blue' },
  { name: 'Graphs', progress: 62, color: 'bg-cyber-purple' },
  { name: 'Dynamic Programming', progress: 45, color: 'bg-cyber-pink' },
  { name: 'Searching', progress: 90, color: 'bg-cyber-green' },
  { name: 'Pathfinding', progress: 38, color: 'bg-cyber-yellow' },
];

const weeklyData = [
  { day: 'Mon', solved: 5 },
  { day: 'Tue', solved: 8 },
  { day: 'Wed', solved: 3 },
  { day: 'Thu', solved: 12 },
  { day: 'Fri', solved: 7 },
  { day: 'Sat', solved: 10 },
  { day: 'Sun', solved: 6 },
];

const difficultyStats = [
  { level: 'Easy', solved: 68, total: 80, color: 'text-cyber-green' },
  { level: 'Medium', solved: 54, total: 90, color: 'text-cyber-yellow' },
  { level: 'Hard', solved: 20, total: 50, color: 'text-cyber-red' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-cyber-text mb-2">Dashboard</h1>
          <p className="text-cyber-text-dim">Track your progress and performance metrics.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card glass-card-hover rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="flex items-center gap-1 text-xs font-medium text-cyber-green">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-cyber-text">{stat.value}</div>
              <div className="text-sm text-cyber-text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-cyber-text flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyber-blue" />
                Weekly Activity
              </h2>
              <span className="text-sm text-cyber-text-muted">Last 7 days</span>
            </div>
            <div className="flex items-end gap-3 h-40">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div
                      className="w-full bg-gradient-to-t from-cyber-blue/80 to-cyber-blue/40 rounded-t-md transition-all group-hover:from-cyber-blue group-hover:to-cyber-purple/60"
                      style={{ height: `${(d.solved / 12) * 120}px` }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-cyber-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.solved}
                    </div>
                  </div>
                  <span className="text-xs text-cyber-text-muted">{d.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-cyber-text flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-cyber-purple" />
              Difficulty Breakdown
            </h2>
            <div className="space-y-5">
              {difficultyStats.map((d) => (
                <div key={d.level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${d.color}`}>{d.level}</span>
                    <span className="text-xs text-cyber-text-muted">{d.solved}/{d.total}</span>
                  </div>
                  <div className="h-2 bg-cyber-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(d.solved / d.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${d.level === 'Easy' ? 'bg-cyber-green' : d.level === 'Medium' ? 'bg-cyber-yellow' : 'bg-cyber-red'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-cyber-text flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-cyber-green" />
              Skill Progress
            </h2>
            <div className="space-y-4">
              {skillBreakdown.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-cyber-text-dim">{skill.name}</span>
                    <span className="text-xs font-mono text-cyber-text-muted">{skill.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-cyber-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className={`h-full rounded-full ${skill.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-cyber-text flex items-center gap-2 mb-6">
              <Code2 className="w-5 h-5 text-cyber-blue" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-cyber-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'Solved' ? 'bg-cyber-green' : 'bg-cyber-yellow'}`} />
                    <div>
                      <span className="text-sm font-medium text-cyber-text">{activity.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          activity.difficulty === 'Easy' ? 'text-cyber-green bg-cyber-green/10' :
                          activity.difficulty === 'Medium' ? 'text-cyber-yellow bg-cyber-yellow/10' :
                          'text-cyber-red bg-cyber-red/10'
                        }`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${activity.status === 'Solved' ? 'text-cyber-green' : 'text-cyber-yellow'}`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-cyber-text-muted mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
