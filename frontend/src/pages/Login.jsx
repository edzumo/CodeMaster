import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!username.trim()) return;

    try {
      const res = await API.post("/login/", {
        username: username.trim()
      });

      localStorage.setItem("username", res.data.username);
      localStorage.setItem("session_id", res.data.session_id);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>CodeMaster</h2>
        <input
          placeholder="Enter Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <button onClick={login} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1e1e1e",
  },
  card: {
    background: "#2b2b2b",
    padding: 30,
    borderRadius: 8,
    width: 300,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 15,
    background: "#1e1e1e",
    color: "white",
    border: "1px solid #444",
  },
  button: {
    width: "100%",
    marginTop: 15,
    padding: 10,
    background: "#007bff",
    color: "white",
    border: "none",
  },
};