import { useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, Shield, BarChart3, Code2, ArrowRight, Play,
  Trophy, BookOpen, Users, Star, ChevronRight,
  Cpu, Binary, GitBranch, Layers, Sparkles, Github,
  Eye, Network, Route, Brain
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Eye,
    title: 'Real-Time Visualization',
    description: 'Watch algorithms make decisions step-by-step with interactive node-by-node traversal and path highlighting.',
    color: 'text-cyber-blue',
    glow: 'bg-cyber-blue/20',
    border: 'group-hover:border-cyber-blue/40',
  },
  {
    icon: Network,
    title: 'Graph Exploration',
    description: 'Explore BFS, DFS, and graph algorithms on dynamic graphs with animated edge and node states.',
    color: 'text-cyber-purple',
    glow: 'bg-cyber-purple/20',
    border: 'group-hover:border-cyber-purple/40',
  },
  {
    icon: Route,
    title: 'Pathfinding Mastery',
    description: 'Compare A*, Dijkstra, and BFS side-by-side to understand how each algorithm navigates decision spaces.',
    color: 'text-cyber-green',
    glow: 'bg-cyber-green/20',
    border: 'group-hover:border-cyber-green/40',
  },
  {
    icon: Brain,
    title: 'DP Decision Trees',
    description: 'Visualize how dynamic programming breaks complex decisions into optimal subproblems with memoization.',
    color: 'text-cyber-yellow',
    glow: 'bg-cyber-yellow/20',
    border: 'group-hover:border-cyber-yellow/40',
  },
  {
    icon: Trophy,
    title: 'Compete & Rank',
    description: 'Challenge developers worldwide in the Algorithm Arena and climb the global leaderboard.',
    color: 'text-cyber-pink',
    glow: 'bg-cyber-pink/20',
    border: 'group-hover:border-cyber-pink/40',
  },
  {
    icon: Code2,
    title: 'Clean Implementations',
    description: 'Production-ready code with detailed comments, complexity analysis, and best practice patterns.',
    color: 'text-cyber-blue',
    glow: 'bg-cyber-blue/20',
    border: 'group-hover:border-cyber-blue/40',
  },
];

const algorithms = [
  { name: 'BFS', category: 'Graph Traversal', complexity: 'O(V + E)', icon: Network, desc: 'Breadth-first exploration' },
  { name: 'DFS', category: 'Graph Traversal', complexity: 'O(V + E)', icon: GitBranch, desc: 'Depth-first exploration' },
  { name: 'Dijkstra', category: 'Shortest Path', complexity: 'O(V + E log V)', icon: Route, desc: 'Weighted shortest path' },
  { name: 'A* Search', category: 'Pathfinding', complexity: 'O(E)', icon: Cpu, desc: 'Heuristic-guided search' },
  { name: 'Dynamic Programming', category: 'Optimization', complexity: 'O(n*m)', icon: Brain, desc: 'Optimal substructure' },
  { name: 'Quick Sort', category: 'Sorting', complexity: 'O(n log n)', icon: Layers, desc: 'Divide and conquer' },
  { name: 'Binary Search', category: 'Search', complexity: 'O(log n)', icon: Binary, desc: 'Logarithmic lookup' },
  { name: 'Kadane\'s', category: 'Array', complexity: 'O(n)', icon: BarChart3, desc: 'Maximum subarray' },
];

const metrics = [
  { value: '50+', label: 'Algorithms', suffix: '' },
  { value: '10M+', label: 'Executions', suffix: '' },
  { value: '99.9', label: 'Uptime %', suffix: '%' },
  { value: '<1', label: 'Avg Latency (ms)', suffix: 'ms' },
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; hue: number;
  }>>([]);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(60, Math.floor((width * height) / 25000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 190 : 270,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity * 0.15})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(200, 100%, 70%, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%)',
          backgroundSize: '100% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '0% 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.02) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="section-divider" />
      <FeaturesSection />
      <div className="section-divider" />
      <AlgorithmsSection />
      <div className="section-divider" />
      <MetricsSection />
      <div className="section-divider" />
      <CTASection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <AnimatedGrid />
      <ParticleField />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-radial-glow rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-radial-purple rounded-full blur-3xl opacity-60" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-blue/30 bg-cyber-blue/5 text-cyber-blue text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>
          Interactive Algorithm Simulations
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
        >
          <span className="text-cyber-text">Visualize Algorithms</span>
          <br />
          <span className="gradient-text neon-text-blue">Making Decisions</span>
          <br />
          <span className="text-cyber-text">in </span>
          <span className="gradient-text neon-text-purple">Real Time</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-cyber-text-dim mb-10 leading-relaxed"
        >
          Explore how <span className="text-cyber-blue font-medium">BFS</span>,{' '}
          <span className="text-cyber-purple font-medium">DFS</span>,{' '}
          <span className="text-cyber-green font-medium">A*</span>,{' '}
          <span className="text-cyber-yellow font-medium">Dijkstra</span>, and{' '}
          <span className="text-cyber-pink font-medium">Dynamic Programming</span> solve
          complex decision problems through interactive simulations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/arena" className="btn-cyber btn-cyber-primary text-base px-8">
            <Play className="w-5 h-5" />
            Start Exploring
          </Link>
          <Link to="/learn" className="btn-cyber btn-cyber-outline text-base px-8">
            <Eye className="w-5 h-5" />
            View Algorithms
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 relative"
        >
          <div className="glass-card rounded-xl p-1 max-w-4xl mx-auto neon-border-blue">
            <div className="bg-cyber-surface/90 rounded-lg p-6 font-mono text-sm text-left overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-cyber-red/80" />
                <div className="w-3 h-3 rounded-full bg-cyber-yellow/80" />
                <div className="w-3 h-3 rounded-full bg-cyber-green/80" />
                <span className="ml-2 text-cyber-text-muted text-xs">dijkstra-visualization.ts</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <p><span className="text-cyber-purple">function</span> <span className="text-cyber-blue">dijkstra</span><span className="text-cyber-text-dim">(graph: Graph, start: Node): Map&lt;Node, number&gt; {'{'}</span></p>
                <p className="pl-4"><span className="text-cyber-purple">const</span> <span className="text-cyber-text-dim">dist = new Map();</span></p>
                <p className="pl-4"><span className="text-cyber-purple">const</span> <span className="text-cyber-text-dim">pq = new PriorityQueue();</span></p>
                <p className="pl-4"><span className="text-cyber-purple">for</span> <span className="text-cyber-text-dim">(const node of graph.nodes) dist.set(node, Infinity);</span></p>
                <p className="pl-4"><span className="text-cyber-text-dim">dist.set(start, 0); pq.enqueue(start, 0);</span></p>
                <p className="pl-4"><span className="text-cyber-purple">while</span> <span className="text-cyber-text-dim">(!pq.isEmpty()) {'{'}</span></p>
                <p className="pl-8"><span className="text-cyber-purple">const</span> <span className="text-cyber-text-dim">current = pq.dequeue();</span></p>
                <p className="pl-8"><span className="text-cyber-purple">for</span> <span className="text-cyber-text-dim">(const [neighbor, weight] of graph.edges(current)) {'{'}</span></p>
                <p className="pl-12"><span className="text-cyber-purple">const</span> <span className="text-cyber-text-dim">newDist = dist.get(current) + weight;</span></p>
                <p className="pl-12"><span className="text-cyber-purple">if</span> <span className="text-cyber-text-dim">(newDist &lt; dist.get(neighbor)) {'{'}</span></p>
                <p className="pl-16"><span className="text-cyber-text-dim">dist.set(neighbor, newDist);</span></p>
                <p className="pl-16"><span className="text-cyber-text-dim">pq.enqueue(neighbor, newDist);</span></p>
                <p className="pl-12">{'}'}</p>
                <p className="pl-8">{'}'}</p>
                <p className="pl-4">{'}'}</p>
                <p><span className="text-cyber-purple">return</span> <span className="text-cyber-text-dim">dist;</span></p>
                <p><span className="text-cyber-text-dim">{'}'}</span></p>
                <p className="mt-2"><span className="text-cyber-text-muted">// Visualization: 12 nodes explored | 8 edges relaxed</span></p>
                <p><span className="text-cyber-text-muted">// Execution: 0.18ms | Beats 96.2% of submissions</span></p>
              </div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-cyber-blue/5 via-cyber-purple/5 to-cyber-blue/5 rounded-2xl blur-2xl -z-10" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-bg to-transparent z-20" />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-cyber-blue text-sm font-medium tracking-widest uppercase mb-4"
          >
            Capabilities
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Powerful Features</span> for
            Algorithm Exploration
          </h2>
          <p className="text-cyber-text-dim text-lg max-w-2xl mx-auto">
            From visualization to competition, everything you need to understand how algorithms make decisions.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`glass-card glass-card-hover rounded-xl p-6 group ${feature.border}`}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.glow} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-cyber-text mb-2 group-hover:text-cyber-blue transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-cyber-text-dim text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AlgorithmsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-radial-purple opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-cyber-purple text-sm font-medium tracking-widest uppercase mb-4"
          >
            Algorithm Library
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Supported Algorithms</span>
          </h2>
          <p className="text-cyber-text-dim text-lg max-w-2xl mx-auto">
            From graph traversal to pathfinding, visualize the algorithms that power real-world decisions.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {algorithms.map((algo, i) => (
            <motion.div
              key={algo.name}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass-card glass-card-hover rounded-xl p-5 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyber-blue/10 flex items-center justify-center group-hover:bg-cyber-blue/20 transition-colors">
                  <algo.icon className="w-4 h-4 text-cyber-blue group-hover:text-cyber-purple transition-colors" />
                </div>
                <span className="text-xs font-mono text-cyber-text-muted bg-cyber-card px-2 py-1 rounded">
                  {algo.complexity}
                </span>
              </div>
              <h3 className="font-semibold text-cyber-text mb-1 group-hover:text-cyber-blue transition-colors">
                {algo.name}
              </h3>
              <p className="text-xs text-cyber-text-muted mb-2">{algo.desc}</p>
              <span className="text-xs text-cyber-blue/60 bg-cyber-blue/5 px-2 py-0.5 rounded">{algo.category}</span>
              <div className="mt-3 flex items-center text-xs text-cyber-blue opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <span>Explore</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-cyber-blue hover:text-cyber-purple transition-colors font-medium group"
          >
            View all 50+ algorithms
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-cyber-green text-sm font-medium tracking-widest uppercase mb-4"
          >
            Performance
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Performance <span className="gradient-text">That Speaks</span>
          </h2>
          <p className="text-cyber-text-dim text-lg max-w-2xl mx-auto">
            Built for speed, reliability, and scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="glass-card glass-card-hover rounded-xl p-8 text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                {metric.value}
                {metric.suffix && (
                  <span className="text-lg">{metric.suffix}</span>
                )}
              </div>
              <div className="text-cyber-text-dim text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-40" />
      <div className="absolute inset-0 bg-radial-purple opacity-20" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to <span className="gradient-text neon-text-blue">Level Up</span>?
          </h2>
          <p className="text-cyber-text-dim text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers mastering algorithms through interactive
            challenges and real-time competition.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/arena" className="btn-cyber btn-cyber-primary text-base px-8">
              <Zap className="w-5 h-5" />
              Get Started Free
            </Link>
            <Link to="/learn" className="btn-cyber btn-cyber-outline text-base px-8">
              Explore Algorithms
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-cyber-text-muted">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>10K+ Developers</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-cyber-yellow" />
              <span>4.9 Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-cyber-green" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-cyber-border/50 bg-cyber-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-6 h-6 text-cyber-blue" />
              <span className="text-lg font-bold gradient-text">Techio</span>
            </div>
            <p className="text-cyber-text-muted text-sm leading-relaxed">
              Master algorithms through interactive visualization and competitive challenges.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-cyber-text mb-4">Platform</h4>
            <ul className="space-y-2">
              {['Arena', 'Learn', 'Leaderboard', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-cyber-text-muted hover:text-cyber-blue transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-cyber-text mb-4">Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'Blog', 'Community', 'Changelog'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-cyber-text-muted hover:text-cyber-blue transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-cyber-text mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Careers', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-cyber-text-muted hover:text-cyber-blue transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="section-divider mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cyber-text-muted">
            &copy; 2026 Techio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyber-text-muted hover:text-cyber-blue transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
