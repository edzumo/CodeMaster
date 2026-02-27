import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>CodeMaster</h2>
      <Link to="/dashboard">Problems</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/history">My Submissions</Link>
    </div>
  );
}