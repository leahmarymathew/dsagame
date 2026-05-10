# Techio

Techio is an algorithm visualization platform focused on pathfinding education, experimentation, and performance comparison. It combines an interactive grid arena, algorithm animations, analytics, and leaderboard tracking.

## Highlights

- Interactive 20x20 pathfinding grid
- BFS, DFS, Dijkstra, and A* visualizations
- Maze generation workflows
- Real-time run analytics and comparison views
- Supabase-backed auth and leaderboard
- Responsive React + Tailwind interface
- C++ reference implementations and benchmarking

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase
- C++ (algorithm references)

## Project Structure

- [src](src): Frontend app source
- [src/algorithms](src/algorithms): TypeScript algorithm engines
- [src/components](src/components): UI and arena components
- [src/pages](src/pages): Route-level pages
- [src/lib](src/lib): Supabase and auth integration
- [supabase/migrations](supabase/migrations): Database schema migrations
- [cpp](cpp): C++ implementations and benchmark tools

## Quick Start

1. Install dependencies
   npm install
2. Create environment variables
   Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
3. Start development server
   npm run dev
4. Build production bundle
   npm run build

## Scripts

- npm run dev: Start local server
- npm run build: Create production build
- npm run preview: Preview production build
- npm run lint: Run ESLint
- npm run typecheck: Run TypeScript checks

## Core Experience

- Arena: Build grid scenarios and run pathfinding algorithms
- Compare: Evaluate algorithm behavior side-by-side
- Learn: Study algorithm concepts and tradeoffs
- Leaderboard: Track and rank run performance

## Deployment

Deployment notes are available in [DEPLOYMENT.md](DEPLOYMENT.md).

## License

Internal project. Add a license file if open-sourcing.
