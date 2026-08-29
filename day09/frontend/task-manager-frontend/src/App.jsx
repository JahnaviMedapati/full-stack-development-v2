import { useEffect, useMemo, useState } from "react";
import "./App.css";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import Signup from "./components/Signup";

const API_URL = "http://127.0.0.1:8000";


// =========================================================
// BUBBLE TRANSITION
// =========================================================

function BubbleTransition({ onFinished }) {
  const bubbles = useMemo(() => {
    const result = [];

    // Dense grid + random jitter.
    // This creates the packed/overlapping look from your image.
    const columns = 24;
    const rows = 16;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {

        const baseX = (column / (columns - 1)) * 100;
        const baseY = (row / (rows - 1)) * 100;

        // Random movement around the grid position
        const jitterX = (Math.random() - 0.5) * 9;
        const jitterY = (Math.random() - 0.5) * 9;

        // Lots of small bubbles, some medium, some huge
        const random = Math.random();

        let size;

        if (random < 0.35) {
          // Tiny bubbles
          size = Math.floor(Math.random() * 25) + 8;
        } else if (random < 0.70) {
          // Small / medium bubbles
          size = Math.floor(Math.random() * 45) + 25;
        } else if (random < 0.92) {
          // Medium / large bubbles
          size = Math.floor(Math.random() * 75) + 55;
        } else {
          // Huge bubbles
          size = Math.floor(Math.random() * 110) + 100;
        }

        result.push({
          id: `${row}-${column}`,
          x: baseX + jitterX,
          y: baseY + jitterY,
          size,
          delay: Math.random() * 1.1,
          duration: 1.1 + Math.random() * 0.9,
          driftX: (Math.random() - 0.5) * 80,
          driftY: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          opacity: 0.45 + Math.random() * 0.45,
        });
      }
    }

    // Extra bubbles to fill gaps.
    // These are completely random and create the dense "bubble wall".
    for (let i = 0; i < 80; i++) {
      const random = Math.random();

      let size;

      if (random < 0.55) {
        size = Math.floor(Math.random() * 30) + 8;
      } else if (random < 0.85) {
        size = Math.floor(Math.random() * 60) + 25;
      } else {
        size = Math.floor(Math.random() * 100) + 60;
      }

      result.push({
        id: `extra-${i}`,
        x: Math.random() * 108 - 4,
        y: Math.random() * 108 - 4,
        size,
        delay: Math.random() * 1.3,
        duration: 1.1 + Math.random() * 1,
        driftX: (Math.random() - 0.5) * 100,
        driftY: (Math.random() - 0.5) * 100,
        rotation: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.5,
      });
    }

    return result;
  }, []);

  useEffect(() => {
    // Keep the transition for the full 9 seconds.
    // The dashboard is already rendered underneath it,
    // including its normal 4 floating bubbles.

    const timer = setTimeout(() => {
      onFinished();
    }, 8200);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="bubble-transition">

      <div className="bubble-field">

        {bubbles.map((bubble) => (
          <span
            key={bubble.id}
            className="storm-bubble"
            style={{
              "--x": `${bubble.x}%`,
              "--y": `${bubble.y}%`,
              "--size": `${bubble.size}px`,
              "--delay": `${bubble.delay}s`,
              "--duration": `${bubble.duration}s`,
              "--drift-x": `${bubble.driftX}px`,
              "--drift-y": `${bubble.driftY}px`,
              "--opacity": bubble.opacity,
              "--rotation": `${bubble.rotation}deg`,
            }}
          />
        ))}

      </div>

      {/* Sparkle layer */}
      <div className="transition-sparkles">

        {Array.from({ length: 90 }).map((_, index) => (
          <span
            key={index}
            className="sparkle"
            style={{
              "--spark-x": `${Math.random() * 100}%`,
              "--spark-y": `${Math.random() * 100}%`,
              "--spark-delay": `${1.7 + Math.random() * 1.3}s`,
              "--spark-size": `${4 + Math.random() * 12}px`,
              "--spark-distance": `${30 + Math.random() * 120}px`,
            }}
          >
            {index % 3 === 0 ? "✦" : index % 3 === 1 ? "✧" : "·"}
          </span>
        ))}

      </div>

      {/* Center bunny */}
      <div className="transition-bunny">
        🐰
      </div>

      {/* Small Tuduu branding */}
      <div className="transition-brand">
        <span>🐰</span>
        <strong>tuduu</strong>
      </div>

    </div>
  );
}


// =========================================================
// APP
// =========================================================

function App() {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token");
  });

  const [showSignup, setShowSignup] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showTransition, setShowTransition] = useState(true);


  // =======================================================
  // TRANSITION HELPER
  // =======================================================

  function startTransition() {
    setShowTransition(true);
  }


  function finishTransition() {
    setShowTransition(false);
  }


  // =======================================================
  // LOGIN
  // =======================================================

  function handleLogin(data) {

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.access_token);
    setUser(data.user);
    setError("");

    // Login -> Dashboard
    startTransition();
  }


  // =======================================================
  // LOGOUT
  // =======================================================

  function handleLogout() {

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setTasks([]);
    setError("");

    // Dashboard -> Login
    startTransition();
  }


  // =======================================================
  // FETCH TASKS
  // =======================================================

  async function fetchTasks() {

    if (!token) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please login again.");
      }

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


  useEffect(() => {

    if (token) {
      fetchTasks();
    }

  }, [token]);


  // =======================================================
  // ADD TASK
  // =======================================================

  async function addTask(title) {

    try {

      setError("");

      const response = await fetch(`${API_URL}/tasks/`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: title,
        }),
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);

    } catch (err) {

      setError(err.message);

    }
  }


  // =======================================================
  // TOGGLE TASK
  // =======================================================

  async function toggleTask(id) {

    const task = tasks.find(
      (task) => task.id === id
    );

    if (!task) {
      return;
    }

    try {

      setError("");

      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: task.title,
            completed: !task.completed,
          }),
        }
      );

      if (response.status === 401) {
        handleLogout();
        throw new Error(
          "Session expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === id
            ? updatedTask
            : currentTask
        )
      );

    } catch (err) {

      setError(err.message);

    }
  }


  // =======================================================
  // DELETE TASK
  // =======================================================

  async function deleteTask(id) {

    try {

      setError("");

      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        throw new Error(
          "Session expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
      );

    } catch (err) {

      setError(err.message);

    }
  }


  // =======================================================
  // AUTH SCREEN
  // =======================================================

  if (!user || !token) {

    if (showSignup) {

      return (
        <>
          <Signup
            onSignupSuccess={() => {
              setShowSignup(false);
              startTransition();
            }}
            onSwitchToLogin={() => {
              setShowSignup(false);
              startTransition();
            }}
          />

          {showTransition && (
            <BubbleTransition
              onFinished={finishTransition}
            />
          )}
        </>
      );
    }

    return (
      <>
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => {
            setShowSignup(true);
            startTransition();
          }}
        />

        {showTransition && (
          <BubbleTransition
            onFinished={finishTransition}
          />
        )}
      </>
    );
  }


  // =======================================================
  // DASHBOARD LOADING
  // =======================================================

  if (loading) {

    return (
      <>
        <div className="app">
          <div className="loading-screen">
            <div className="loading-bunny">
              🐰
            </div>

            <p>tuduu is getting your tasks...</p>
          </div>
        </div>

        {showTransition && (
          <BubbleTransition
            onFinished={finishTransition}
          />
        )}
      </>
    );
  }


  // =======================================================
  // DASHBOARD
  // =======================================================

  return (
    <>
      <div className="app">

        <div className="bubbles">
          <span className="bubble bubble-1"></span>
          <span className="bubble bubble-2"></span>
          <span className="bubble bubble-3"></span>
          <span className="bubble bubble-4"></span>
        </div>


        <div className="container">

          <header className="header">

            <div className="brand-small">
              <span className="brand-bunny">
                🐰
              </span>

              <span>
                tuduu
              </span>
            </div>

            <p className="eyebrow">
              ✦ YOUR LITTLE PRODUCTIVITY SPACE ✦
            </p>

            <h1>
              Get things done.
            </h1>

            <p className="subtitle">
              Welcome back, {user.name}! ♡
            </p>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </header>


          {error && (
            <p className="error">
              {error}
            </p>
          )}


          <TaskForm
            onAddTask={addTask}
          />


          <TaskList
            tasks={tasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />

        </div>

      </div>


      {showTransition && (
        <BubbleTransition
          onFinished={finishTransition}
        />
      )}
    </>
  );
}


export default App;