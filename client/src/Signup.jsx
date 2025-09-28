import React, { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Signup({ onSignupSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        onSignupSuccess(); 
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="card shadow p-4">
      <h3 className="mb-3">Signup</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-2"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <button type="submit" className="btn btn-success w-100">
          Signup
        </button>
      </form>
    </div>
  );
}
