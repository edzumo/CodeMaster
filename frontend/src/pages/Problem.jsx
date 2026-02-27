import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../api";
import Layout from "../components/Layout";

export default function Problem() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  

  // Timer state
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // Debug terminal
  const [debugOutput, setDebugOutput] = useState("");

  // TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // LOAD QUESTION
  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const res = await API.get("/questions/");
      const q = res.data.find((x) => x.id === id);

      if (!q) return;

      setQuestion(q);

      if (q.function_templates && q.function_templates[language]) {
  setCode(q.function_templates[language]);
}
    } catch (err) {
      console.error("Failed to load question", err);
    }
  };

  useEffect(() => {
  if (question && question.function_templates) {
    const template = question.function_templates[language];
    if (template) {
      setCode(template);
    }
  }
}, [language, question]);

  const submit = async () => {
    setLoading(true);
    setDebugOutput("");

    const session_id = localStorage.getItem("session_id");

    if (!session_id) {
      setResult("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/submit/", {
        session_id,
        questionId: id,
        language,
        code,
      });

      if (res.data.error) {
        setResult("Execution Failed");
        setDebugOutput(res.data.error);
      } else {
        setDebugOutput("");
        setResult(
          `Score: ${res.data.score} (${res.data.passed}/${res.data.total}) - ${res.data.status}`
        );
      }
    } catch (err) {
      console.error(err);
      setResult("Submission failed");
      setDetails([]);
    }

    setLoading(false);
  };

  if (!question) {
    return (
      <Layout>
        <div style={{ padding: 40 }}>Loading...</div>
      </Layout>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Layout>
      <div className="problem-header">
        <h2>{question.title}</h2>

        <div>
          <span style={{ marginRight: 20 }}>
            ⏳ {minutes}:{seconds.toString().padStart(2, "0")}
          </span>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="btn btn-secondary"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={loading || timeLeft === 0}
            style={{ marginLeft: 10 }}
          >
            {loading ? "Running..." : "Submit"}
          </button>
        </div>
      </div>

      <div className="card">
        <p style={{ whiteSpace: "pre-line" }}>
          {question.description}
        </p>
      </div>

      <div className="editor-container">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      {debugOutput && (
        <div className="terminal">
          <div className="terminal-header">Debug Output</div>
          <pre>{debugOutput}</pre>
        </div>
      )}

      <div className="result-box">
        <strong>{result}</strong>
      </div>

      {details.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {details.map((t, index) => (
            <div key={index} className={`testcase ${t.status}`}>
              <div className="testcase-title">
                Test Case {index + 1} — {t.status.toUpperCase()}
              </div>

              <div className="muted">Input: {t.input}</div>
              <div className="muted">Expected: {t.expected}</div>
              <div className="muted">Output: {t.output}</div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}