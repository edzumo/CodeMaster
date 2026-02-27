import { useEffect, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/leaderboard/");
    setData(res.data);
  };

  return (
    <Layout>
      <h2>Leaderboard</h2>

      {data.map((entry, index) => (
        <div key={index} style={row}>
          <div>{index + 1}</div>
          <div>{entry.username}</div>
          <div>{entry.question}</div>
          <div>{entry.score}</div>
        </div>
      ))}
    </Layout>
  );
}

const row = {
  display: "grid",
  gridTemplateColumns: "50px 150px 1fr 80px",
  background: "#2b2b2b",
  padding: 10,
  marginBottom: 5
};