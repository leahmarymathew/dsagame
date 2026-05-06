import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Arena from './pages/Arena';
import Leaderboard from './pages/Leaderboard';
import Learn from './pages/Learn';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyber-bg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
