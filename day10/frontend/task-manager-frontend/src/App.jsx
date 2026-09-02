import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Profile from "./components/Profile";
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

    const columns = 24;
    const rows = 16;

    // Main bubble field
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const baseX = (column / (columns - 1)) * 100;
        const baseY = (row / (rows - 1)) * 100;

        const jitterX = (Math.random() - 0.5) * 9;
        const jitterY = (Math.random() - 0.5) * 9;

        const random = Math.random();

        let size;

        if (random < 0.35) {
          size = Math.floor(Math.random() * 25) + 8;
        } else if (random < 0.7) {
          size = Math.floor(Math.random() * 45) + 25;
        } else if (random < 0.92) {
          size = Math.floor(Math.random() * 75) + 55;
        } else {
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
          opacity: 0.45 + Math.random() * 0.45,
        });
      }
    }

    // Extra bubbles
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
        duration: 1.1 + Math.random(),
        driftX: (Math.random() - 0.5) * 100,
        driftY: (Math.random() - 0.5) * 100,
        opacity: 0.4 + Math.random() * 0.5,
      });
    }

    return result;
  }, []);

  const sparkles = useMemo(() => {
    return Array.from({ length: 90 }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: 1.7 + Math.random() * 1.3,
      size: 4 + Math.random() * 12,
      distance: 30 + Math.random() * 120,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 3600);

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
            }}
          />
        ))}
      </div>


      <div className="transition-sparkles">
        {sparkles.map((sparkle, index) => (
          <span
            key={sparkle.id}
            className="sparkle"
            style={{
              "--spark-x": `${sparkle.x}%`,
              "--spark-y": `${sparkle.y}%`,
              "--spark-delay": `${sparkle.delay}s`,
              "--spark-size": `${sparkle.size}px`,
              "--spark-distance": `${sparkle.distance}px`,
            }}
          >
            {index % 3 === 0
              ? "✦"
              : index % 3 === 1
                ? "✧"
                : "·"}
          </span>
        ))}
      </div>


      <div className="transition-bunny">
        🐰
      </div>


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

  // =======================================================
  // SESSION RESTORATION
  // =======================================================

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token");
  });


  // =======================================================
  // UI STATE
  // =======================================================

  const [showSignup, setShowSignup] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showTransition, setShowTransition] = useState(true);

  const [showProfile, setShowProfile] = useState(false);
  // =======================================================
  // TRANSITION
  // =======================================================

  const startTransition = useCallback(() => {
    setShowTransition(true);
  }, []);

  const finishTransition = useCallback(() => {
    setShowTransition(false);
  }, []);


  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setTasks([]);
    setError("");

    startTransition();
  }, [startTransition]);


  // =======================================================
  // API HELPER
  // =======================================================

  async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.body
            ? { "Content-Type": "application/json" }
            : {}),
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
          ...(options.headers || {}),
        },
      }
    );

    if (response.status === 401) {
      handleLogout();

      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    return response;
  }


  // =======================================================
  // FETCH TASKS
  // =======================================================

  const fetchTasks = useCallback(async () => {

    if (!token) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();

        return;
      }

      if (!response.ok) {
        throw new Error(
          "We couldn't load your tasks."
        );
      }

      const data = await response.json();

      setTasks(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error("Fetch tasks error:", err);

      setError(
        err.message ||
        "Something went wrong while loading your workspace."
      );

    } finally {

      setLoading(false);

    }

  }, [token, handleLogout]);


  // =======================================================
  // LOAD TASKS AFTER LOGIN
  // =======================================================

  useEffect(() => {

    if (token) {
      fetchTasks();
    }

  }, [token, fetchTasks]);


  // =======================================================
  // LOGIN
  // =======================================================

  function handleLogin(data) {

    if (!data?.access_token || !data?.user) {
      setError(
        "Login succeeded, but your account information was missing."
      );

      return;
    }

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setToken(data.access_token);

    setUser(data.user);

    setTasks([]);

    setError("");

    startTransition();
  }


  // =======================================================
  // SIGNUP SUCCESS
  // =======================================================

  function handleSignupSuccess() {

    setShowSignup(false);

    setError("");

    startTransition();
  }


  // =======================================================
  // ADD TASK
  // =======================================================

  async function addTask(title) {

    const cleanTitle = title?.trim();

    if (!cleanTitle) {
      return;
    }

    try {

      setError("");

      const response = await apiRequest(
        "/tasks/",
        {
          method: "POST",

          body: JSON.stringify({
            title: cleanTitle,
          }),
        }
      );

      if (!response.ok) {

        let message =
          "We couldn't create that task.";

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            message =
              typeof errorData.detail === "string"
                ? errorData.detail
                : message;
          }
        } catch {
          // Ignore invalid error response
        }

        throw new Error(message);
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);

    } catch (err) {

      console.error("Add task error:", err);

      setError(
        err.message ||
        "Something went wrong while creating your task."
      );

    }
  }


  // =======================================================
  // TOGGLE TASK
  // =======================================================

  async function toggleTask(id) {

    const task = tasks.find(
      (currentTask) =>
        currentTask.id === id
    );

    if (!task) {
      return;
    }

    try {

      setError("");

      const response = await apiRequest(
        `/tasks/${id}`,
        {
          method: "PUT",

          body: JSON.stringify({
            title: task.title,
            completed: !task.completed,
          }),
        }
      );

      if (response.status === 404) {
        throw new Error(
          "That task no longer exists."
        );
      }

      if (!response.ok) {
        throw new Error(
          "We couldn't update that task."
        );
      }

      const updatedTask =
        await response.json();

      setTasks((currentTasks) =>
        currentTasks.map(
          (currentTask) =>
            currentTask.id === id
              ? updatedTask
              : currentTask
        )
      );

    } catch (err) {

      console.error(
        "Toggle task error:",
        err
      );

      setError(
        err.message ||
        "Something went wrong while updating your task."
      );

    }
  }


  // =======================================================
  // DELETE TASK
  // =======================================================

  async function deleteTask(id) {

    try {

      setError("");

      const response = await apiRequest(
        `/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 404) {
        throw new Error(
          "That task no longer exists."
        );
      }

      if (!response.ok) {
        throw new Error(
          "We couldn't delete that task."
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
      );

    } catch (err) {

      console.error(
        "Delete task error:",
        err
      );

      setError(
        err.message ||
        "Something went wrong while deleting your task."
      );

    }
  }

  async function updateTask(id, newTitle) {

    const task = tasks.find(
      (currentTask) => currentTask.id === id
    );

    if (!task) {
      return;
    }

    try {

      setError("");

      const response = await apiRequest(
        `/tasks/${id}`,
        {
          method: "PUT",

          body: JSON.stringify({
            title: newTitle,
            completed: task.completed,
          }),
        }
      );

      if (response.status === 404) {
        throw new Error(
          "That task no longer exists."
        );
      }

      if (!response.ok) {
        throw new Error(
          "We couldn't update that task."
        );
      }

      const updatedTask =
        await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === id
            ? updatedTask
            : currentTask
        )
      );

    } catch (err) {

      console.error(
        "Update task error:",
        err
      );

      setError(
        err.message ||
        "Something went wrong while updating your task."
      );

      throw err;
    }
  }
  async function toggleImportant(id) {
    try {
      const task = tasks.find((task) => task.id === id);

      if (!task) return;

      const updatedTask = await apiRequest(
        `/tasks/${id}/important`,
        {
          method: "PATCH",
          body: JSON.stringify({
            important: !task.important,
          }),
        }
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Failed to update important status:", error);
    }
  }
  // =======================================================
  // TASK STATS
  // =======================================================

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingTasks =
    totalTasks - completedTasks;


  // =======================================================
  // COMPLETION PERCENTAGE
  // =======================================================

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
        (completedTasks / totalTasks) * 100
      );


  // =======================================================
  // AUTH SCREEN
  // =======================================================

  if (!user || !token) {

    if (showSignup) {

      return (
        <>
          <Signup
            onSignupSuccess={
              handleSignupSuccess
            }
            onSwitchToLogin={() => {
              setShowSignup(false);
              setError("");
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
            setError("");
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
  // LOADING SCREEN
  // =======================================================
  if (showProfile) {
    return (
      <>
        <Profile
          user={user}
          token={token}
          onBack={() => setShowProfile(false)}
        />

        {showTransition && (
          <BubbleTransition
            onFinished={finishTransition}
          />
        )}
      </>
    );
  }
  if (loading) {

    return (
      <>
        <div className="app">

          <div className="bubbles">
            <span className="bubble bubble-1" />
            <span className="bubble bubble-2" />
            <span className="bubble bubble-3" />
            <span className="bubble bubble-4" />
          </div>

          <div className="loading-screen">

            <div className="loading-bunny">
              🐰
            </div>

            <p>
              tuduu is getting your workspace ready...
            </p>

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

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="bubbles">

          <span className="bubble bubble-1" />

          <span className="bubble bubble-2" />

          <span className="bubble bubble-3" />

          <span className="bubble bubble-4" />

        </div>


        <div className="container">


          {/* =================================================
              NAVBAR
          ================================================= */}

          <nav className="navbar">

            <div className="navbar-brand">

              <div className="navbar-logo">
                🐰
              </div>

              <span>
                tuduu
              </span>

            </div>


            <div className="navbar-right">

              <button
                type="button"
                className="user-pill"
                onClick={() => setShowProfile(true)}
                aria-label="Open profile"
              >

                <div className="user-avatar">
                  {user?.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="user-info">

                  <span className="user-name">
                    {user?.name || "User"}
                  </span>

                  <span className="user-status">
                    Personal workspace
                  </span>

                </div>

              </button>


              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Log out
              </button>

            </div>

          </nav>


          {/* =================================================
              HERO
          ================================================= */}

          <section className="dashboard-hero">

            <div>

              <p className="eyebrow">
                ✦ YOUR PRODUCTIVITY SPACE
              </p>

              <h1>
                Get things done.
              </h1>

              <p className="subtitle">
                A calmer way to organize your day.
              </p>

            </div>

          </section>


          {/* =================================================
              STATS
          ================================================= */}

          <section className="stats-grid">

            <div className="stat-card">

              <span className="stat-label">
                Total
              </span>

              <strong>
                {totalTasks}
              </strong>

              <span className="stat-description">
                {totalTasks === 1
                  ? "task in your workspace"
                  : "tasks in your workspace"}
              </span>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Completed
              </span>

              <strong>
                {completedTasks}
              </strong>

              <span className="stat-description">
                {completionPercentage}% of your workload
              </span>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Remaining
              </span>

              <strong>
                {pendingTasks}
              </strong>

              <span className="stat-description">
                {pendingTasks === 0
                  ? "you're all caught up ✦"
                  : "tasks still to go"}
              </span>

            </div>

          </section>


          {/* =================================================
              TASK WORKSPACE
          ================================================= */}

          <main className="task-section">

            <div className="section-heading">

              <div>

                <span className="section-kicker">
                  WORKSPACE
                </span>

                <h2>
                  Your tasks
                </h2>

              </div>


              <span className="task-count">
                {pendingTasks}{" "}
                {pendingTasks === 1
                  ? "remaining"
                  : "remaining"}
              </span>

            </div>


            {/* ERROR */}

            {error && (
              <div
                className="error"
                role="alert"
              >
                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setError("")
                  }
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}


            {/* ADD TASK */}

            <TaskForm
              onAddTask={addTask}
            />


            {/* TASK LIST */}
            <TaskList
              tasks={tasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onToggleImportant={toggleImportant}
            />

          </main>


          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="dashboard-footer">

            <span>
              a little space to get things done
            </span>

            <span>
              🐰 tuduu
            </span>

          </footer>

        </div>

      </div>


      {/* =================================================
          TRANSITION
      ================================================= */}

      {showTransition && (
        <BubbleTransition
          onFinished={finishTransition}
        />
      )}

    </>
  );
}


export default App;