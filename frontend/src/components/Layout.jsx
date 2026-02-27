import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}

const container = {
  display: "flex",
  height: "100vh",
  background: "#121212",
  color: "white"
};

const content = {
  flex: 1,
  padding: 30,
  overflowY: "auto"
};