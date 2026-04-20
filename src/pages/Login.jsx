import { useState } from "react";
import { registerUser, loginUser } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") await registerUser(email, password);
      else await loginUser(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdf0f3 0%, #fdf8f5 50%, #f0e8f5 100%)",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 12px 48px rgba(107,45,94,0.12)",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "2.8rem", marginBottom: 8 }}>🌺</div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.8rem",
              color: "var(--plum)",
              marginBottom: 4,
            }}
          >
            FemFlow
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Your personal cycle companion
          </p>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            background: "var(--blush)",
            borderRadius: 50,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {["login", "register"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 50,
                border: "none",
                background: mode === m ? "var(--rose)" : "transparent",
                color: mode === m ? "#fff" : "var(--text-muted)",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fdf0f0",
                border: "1px solid #f0c0c0",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: "0.85rem",
                color: "#c0392b",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            disabled={loading}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}