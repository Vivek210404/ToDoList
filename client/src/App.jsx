import React, { useState, useEffect } from "react";
import TodoList from "./TodoList.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(true); // default → signup

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowSignup(true); // after logout, go back to signup page
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">My Todo List</h1>

      {!isLoggedIn ? (
        <>
          {showSignup ? (
            <>
              <Signup onSignupSuccess={() => setShowSignup(false)} />
              <p className="mt-3 text-center">
                Already have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setShowSignup(false)}
                >
                  Login here
                </button>
              </p>
            </>
          ) : (
            <>
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
              <p className="mt-3 text-center">
                Don’t have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setShowSignup(true)}
                >
                  Signup here
                </button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <TodoList />
          <div className="text-center mt-3">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
