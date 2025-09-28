import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("todo_user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("todo_token") || null);

  useEffect(() => {
    if (token) localStorage.setItem("todo_token", token);
    else localStorage.removeItem("todo_token");
  }, [token]);

  const signup = async ({ name, email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Signup failed" };

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem("todo_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Network error" };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Login failed" };

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem("todo_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Network error" };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("todo_user");
    localStorage.removeItem("todo_token");
  };

  const authFetch = async(path, opts = {}) => {
    const headers = (opts.headers = opts.headers || {});
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (res.status === 401) logout()
    return res;
  };

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout, isAuthenticated: !!currentUser, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
