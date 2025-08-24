import React from "react";
import TodoList from "./TodoList.jsx";

export default function App() {
  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">My Todo List</h1>
      <TodoList />
    </div>
  );
}
