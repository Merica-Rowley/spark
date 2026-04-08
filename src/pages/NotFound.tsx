import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div
        style={{
          fontSize: 96,
          fontWeight: 500,
          opacity: 0.08,
          letterSpacing: -4,
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h1>Oops, this page doesn't exist</h1>
      <p style={{ color: "#666", margin: "0.5rem 0 2rem" }}>
        The page you're looking for may have been moved, deleted, or never
        existed.
      </p>
      <button onClick={() => navigate("/lists")}>← Back to home</button>
    </div>
  );
}
