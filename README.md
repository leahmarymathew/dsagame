# Techio — Master Algorithms

A cyberpunk-themed, interactive web application for learning and practising Data Structures & Algorithms (DSA). Techio combines structured learning, a competitive coding arena, a global leaderboard, and rich progress dashboards — all wrapped in a sleek neon aesthetic.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)

---

## Features

| Feature | Description |
|---|---|
| 🎓 **Learn** | Interactive algorithm tutorials with step-by-step visualisations across Sorting, Graph, Search, Dynamic Programming, and Pathfinding categories |
| ⚔️ **Algorithm Arena** | Solve curated coding challenges (Easy → Hard) with a built-in code viewer and test-case runner |
| 🏆 **Leaderboard** | Weekly / Monthly / All-Time global rankings, top-three podium cards, and per-user streak tracking |
| 📊 **Dashboard** | Personal stats — problems solved, streak, global rank, average speed, weekly activity chart, difficulty breakdown, and skill-progress bars |
| 🌐 **Responsive UI** | Fully responsive layout with a cyberpunk neon colour system and smooth Framer Motion animations |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Animation | [Framer Motion 12](https://www.framer.com/motion/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) with a custom `cyber` colour palette |
| Icons | [Lucide React](https://lucide.dev/) |
| Backend / Auth | [Supabase](https://supabase.com/) (`@supabase/supabase-js`) |
| Linting | ESLint 9 + `typescript-eslint` + `eslint-plugin-react-hooks` |

---

## Project Structure

```
dsagame/
├── public/
├── src/
│   ├── pages/
│   │   ├── Landing.tsx       # Marketing / hero page
│   │   ├── Dashboard.tsx     # User stats & activity overview
│   │   ├── Arena.tsx         # Coding challenge workspace
│   │   ├── Leaderboard.tsx   # Global rankings
│   │   └── Learn.tsx         # Algorithm tutorials browser
│   ├── App.tsx               # Root component & router setup
│   ├── main.tsx              # React DOM entry point
│   └── index.css             # Global styles & Tailwind directives
├── index.html                # HTML entry point (title: "Techio - Master Algorithms")
├── tailwind.config.js        # Custom cyber theme tokens
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Pages

### `/` — Landing
The public-facing hero page. Highlights key features (Real-Time Visualisation, Graph Exploration, Pathfinding Mastery, DP Decision Trees, Arena, and Clean Implementations), showcases supported algorithms with complexity tags, and provides call-to-action buttons linking to the Arena and Learn sections.

### `/dashboard` — Dashboard
Personalised statistics hub showing:
- **Stats cards** — problems solved, current streak, global rank, average speed
- **Weekly Activity** bar chart (last 7 days)
- **Difficulty Breakdown** — Easy / Medium / Hard progress bars
- **Skill Progress** — Sorting, Graphs, DP, Searching, Pathfinding
- **Recent Activity** feed with difficulty badges and solve status

### `/arena` — Algorithm Arena
Interactive problem-solving environment:
- Filterable challenge list (All / Easy / Medium / Hard) with accept-rate and category labels
- Problem description panel with constraints
- Collapsible TypeScript solution viewer
- Test-case results table (input, expected output, actual output, pass/fail)
- Submit Solution button with performance metrics (time, memory, percentile)

### `/leaderboard` — Leaderboard
Community competition page:
- Timeframe toggle: Weekly / Monthly / All Time
- Top-3 podium with crown/medal icons and animated entrance
- Full ranked table with score, problems solved, streak, and trend indicator

### `/learn` — Learn Algorithms
Structured learning catalogue:
- Search bar and category filter (Sorting, Graph, Search, DP, Pathfinding)
- Algorithm cards showing difficulty, time complexity, duration, and lesson count
- Detail panel with lesson-by-lesson plan and Start Learning / Review Lesson action

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/leahmarymathew/dsagame.git
cd dsagame

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Type-check and produce an optimised production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

---

## Contributing

1. Fork the repository and create a feature branch (`git checkout -b feature/your-feature`).
2. Commit your changes with a descriptive message.
3. Open a Pull Request — please include a brief description of what was changed and why.

All contributions are welcome, from bug fixes and performance improvements to new algorithm modules and UI enhancements.
