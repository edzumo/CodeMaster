import { useEffect, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const session_id = localStorage.getItem("session_id");
    const res = await API.get(`/history/?session_id=${session_id}`);
    setData(res.data);
  };

  return (
    <Layout>
      <h2>Submission History</h2>

      {data.map((s, index) => (
        <div key={index} style={row}>
          <div>{s.question}</div>
          <div>{s.language}</div>
          <div>{s.score}</div>
          <div>{s.status}</div>
        </div>
      ))}
    </Layout>
  );
}

const row = {
  display: "grid",
  gridTemplateColumns: "1fr 120px 80px 80px",
  background: "#2b2b2b",
  padding: 10,
  marginBottom: 5
};