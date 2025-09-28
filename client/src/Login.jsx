import React, { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

export default function Login({ onLoginSuccess }) {
  const { login } = useAuth();   // <-- yaha se context ka login laaya
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);   // <-- context ka login call
    if (res.success) {
      alert("Login successful!");
      if (onLoginSuccess) onLoginSuccess(); // TodoList par redirect
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="card shadow p-4">
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
