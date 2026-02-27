import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Problem from "./pages/Problem";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/problem/:id" element={<Problem />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}