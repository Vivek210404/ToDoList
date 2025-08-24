import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function TodoList() {
  let [todos, setTodos] = useState([
    { task: "Sample task", id: uuidv4(), isDone: false },
  ]);
  let [newTodo, setNewTodo] = useState("");

  let addNewTask = () => {
    if (newTodo.trim() === "") return;
    setTodos((prevTodos) => [
      ...prevTodos,
      { task: newTodo, id: uuidv4(), isDone: false },
    ]);
    setNewTodo("");
  };

  let updateTodoValue = (event) => {
    setNewTodo(event.target.value);
  };

  let deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  let markAllDone = () => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => ({ ...todo, isDone: true }))
    );
  };

  let markAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: true } : todo
      )
    );
  };

  return (
    <div className="card shadow p-4">
      {/* Input + Add button */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Add a task..."
          value={newTodo}
          onChange={updateTodoValue}
        />
        <button className="btn btn-success" onClick={addNewTask}>
          Add
        </button>
      </div>

      {/* Task List */}
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

      {/* Mark All Done */}
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
