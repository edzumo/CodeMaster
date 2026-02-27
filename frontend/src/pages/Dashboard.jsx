import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/questions/");
      setQuestions(res.data);

      const session_id = localStorage.getItem("session_id");

      if (session_id) {
        const hist = await API.get(`/history/?session_id=${session_id}`);
        setHistory(hist.data);
      }
    } catch (err) {
      console.error("Load failed", err);
    }
  };

  const isSolved = (questionId) => {
    return history.some(
      (h) => h.question_id === questionId && h.status === "pass"
    );
  };

  const badgeClass = (difficulty) => {
    if (!difficulty) return "badge badge-easy";

    const d = difficulty.toLowerCase();

    if (d === "easy") return "badge badge-easy";
    if (d === "medium") return "badge badge-medium";
    if (d === "hard") return "badge badge-hard";

    return "badge badge-easy";
  };

  return (
    <Layout>
      <h2 style={{ marginBottom: 30 }}>Problems</h2>

      <div className="problem-grid">
        {questions.map((q) => (
          <div key={q.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="card-title">{q.title}</div>
              {isSolved(q.id) && <span className="solved">✓ Solved</span>}
            </div>

            <div style={{ marginTop: 8 }}>
              <span className={badgeClass(q.difficulty)}>
                {q.difficulty || "Easy"}
              </span>
            </div>

            <div style={{ marginTop: 20 }}>
              <Link to={`/problem/${q.id}`}>
                <button className="btn btn-primary">Solve</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}