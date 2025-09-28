import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./AuthContext.jsx";

export default function TodoList() {
  const { currentUser, isAuthenticated, authFetch } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await authFetch("/api/todos");
        if (!res.ok) throw new Error("Failed to load todos");
        const data = await res.json();
        setTodos(
          data.todos.map((t) => ({
            id: t._id,
            task: t.task,
            isDone: !!t.isDone,
          }))
        );
      } else {
        const g = JSON.parse(localStorage.getItem("todos_guest") || "[]");
        setTodos(
          g.length ? g : [{ id: uuidv4(), task: "Sample task", isDone: false }]
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [currentUser]);

  useEffect(() => {
    if (!isAuthenticated)
      localStorage.setItem("todos_guest", JSON.stringify(todos));
  }, [todos, isAuthenticated]);

  const addNewTask = async () => {
    if (newTodo.trim() === "") return;
    if (isAuthenticated) {
      try {
        const res = await authFetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ task: newTodo.trim() }),
        });
        if (!res.ok) throw new Error("Add failed");
        const added = await res.json();
        setTodos((prev) => [
          ...prev,
          { id: added.id, task: added.task, isDone: false },
        ]);
      } catch (err) {
        console.error(err);
      }
    } else {
      const newItem = { id: uuidv4(), task: newTodo, isDone: false };
      setTodos((prev) => [...prev, newItem]);
    }
    setNewTodo("");
  };

  const deleteTodo = async (id) => {
    if (isAuthenticated) {
      try {
        await authFetch(`/api/todos/${id}`, { method: "DELETE" });
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error(err);
      }
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const markAsDone = async (id) => {
    if (isAuthenticated) {
      try {
        await authFetch(`/api/todos/${id}`, {
          method: "PUT",
          body: JSON.stringify({ isDone: true }),
        });
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isDone: true } : t))
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isDone: true } : t))
      );
    }
  };

  const markAllDone = async () => {
    if (isAuthenticated) {
      await Promise.all(
        todos.map((t) =>
          !t.isDone
            ? authFetch(`/api/todos/${t.id}`, {
                method: "PUT",
                body: JSON.stringify({ isDone: true }),
              })
            : Promise.resolve()
        )
      );
      setTodos((prev) => prev.map((t) => ({ ...t, isDone: true })));
    } else {
      setTodos((prev) => prev.map((t) => ({ ...t, isDone: true })));
    }
  };

  return (
    <div className="card shadow p-4">
      {!isAuthenticated && (
        <div className="alert alert-info">
          You are not logged in — tasks saved locally in guest storage.
          Signup/login to save tasks to your account.
        </div>
      )}

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Add a task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="btn btn-success" onClick={addNewTask}>
          Add
        </button>
      </div>

      {loading ? (
        <div>Loading todos…</div>
      ) : (
        <ul className="list-group">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span
                style={
                  todo.isDone
                    ? { textDecorationLine: "line-through", color: "gray" }
                    : {}
                }
              >
                {todo.task}
              </span>
              <div>
                <button
                  className="btn btn-sm btn-outline-danger me-2"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => markAsDone(todo.id)}
                  disabled={todo.isDone}
                >
                  Done
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <div className="text-center mt-3">
          <button className="btn btn-warning" onClick={markAllDone}>
            Mark All as Done
          </button>
        </div>
      )}
    </div>
  );
}
