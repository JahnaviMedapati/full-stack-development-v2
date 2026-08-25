import { useEffect, useState } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000/tasks/";

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);
  async function addTask(title) {
    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [...currentTasks, newTask]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(id) {
    const task = tasks.find((task) => task.id === id);

    if (!task) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === id ? updatedTask : currentTask
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      setError("");

      const response = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="app">Loading tasks...</div>;
  }

  if (error) {
    return <div className="app">Error: {error}</div>;
  }
  return (
    <div className="app">
      <div className="bubbles">
        <span className="bubble bubble-1"></span>
        <span className="bubble bubble-2"></span>
        <span className="bubble bubble-3"></span>
        <span className="bubble bubble-4"></span>
      </div>

      <div className="container">
        <header className="header">
          <div>
            <p className="eyebrow">✦ PRODUCTIVITY ✦</p>

            <h1>Task Manager</h1>

            <p className="subtitle">
              Stay organized. Get things done. ♡
            </p>
          </div>
        </header>

        <TaskForm onAddTask={addTask} />

        <TaskList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;