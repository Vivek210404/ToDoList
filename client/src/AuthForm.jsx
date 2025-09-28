import React, { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

export default function AuthForm({ mode: initialMode = "login", onClose }) {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (mode === "signup") {
      const res = await signup({ name: name.trim(), email: email.trim(), password });
      if (!res.success) setMessage({ type: "danger", text: res.message });
      else {
        setMessage({ type: "success", text: "Signup successful — logged in." });
        setTimeout(() => onClose && onClose(), 700);
      }
    } else {
      const res = await login({ email: email.trim(), password });
      if (!res.success) setMessage({ type: "danger", text: res.message });
      else {
        setMessage({ type: "success", text: "Login successful." });
        setTimeout(() => onClose && onClose(), 500);
      }
    }
  };

  return (
    <div className="card mb-4 p-3">
      <h5 className="mb-3">{mode === "signup" ? "Create an account" : "Login"}</h5>
      {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div className="mb-2">
            <label className="form-label">Name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <button type="submit" className="btn btn-primary me-2">{mode === "signup" ? "Sign up" : "Login"}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setMessage(null); }}>
              {mode === "signup" ? "Switch to Login" : "Switch to Signup"}
            </button>
          </div>
          <div>
            <button type="button" className="btn btn-link" onClick={() => onClose && onClose()}>Close</button>
          </div>
        </div>
      </form>
    </div>
  );
}
