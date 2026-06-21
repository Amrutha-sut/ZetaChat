import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "./MyContext.jsx";
import "./AuthModal.css";

function AuthModal({ mode }) {
  const { onSuccessAuth } = useContext(MyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const flashMessage = location.state?.flashMessage || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      onSuccessAuth(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal-box">
        {flashMessage && (
          <div className="auth-flash-banner">
            <span>{flashMessage}</span>
          </div>
        )}
        <button className="auth-close-btn" onClick={() => navigate("/")}>
          &times;
        </button>
        <h2 className="auth-title">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h2>
        {error && <div className="auth-error-banner">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              placeholder="name@domain.com"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>
        <p className="auth-toggle-text">
          {mode === "signup" ? "Already have an account? " : "New to SigmaGPT? "}
          <span
            className="auth-toggle-link"
            onClick={() => navigate(mode === "signup" ? "/login" : "/signup")}
          >
            {mode === "signup" ? "Log In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
