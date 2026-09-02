import { useEffect, useState } from "react";

function Profile({ user, token, onBack }) {
    const [profileTasks, setProfileTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // =====================================================
    // FETCH PROFILE TASK HISTORY
    // =====================================================

    useEffect(() => {
        async function fetchProfileTasks() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://127.0.0.1:8000/profile/tasks",
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "We couldn't load your task history."
                    );
                }

                const data = await response.json();

                setProfileTasks(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                console.error(
                    "Profile tasks error:",
                    err
                );

                setError(
                    err.message ||
                    "Something went wrong while loading your history."
                );
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            fetchProfileTasks();
        }
    }, [token]);

    // =====================================================
    // PERMANENTLY DELETE TASK
    // =====================================================

    async function permanentlyDeleteTask(id) {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this task? This cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `http://127.0.0.1:8000/profile/tasks/${id}/permanent`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "We couldn't permanently delete this task."
                );
            }

            setProfileTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task.id !== id
                )
            );
        } catch (err) {
            console.error(
                "Permanent delete error:",
                err
            );

            setError(
                err.message ||
                "Something went wrong while deleting the task."
            );
        }
    }

    // =====================================================
    // FILTER TASKS
    // =====================================================

    const filteredTasks = profileTasks.filter((task) => {
        if (activeFilter === "active") {
            return (
                !task.completed &&
                !task.deleted_at
            );
        }

        if (activeFilter === "completed") {
            return task.completed;
        }

        if (activeFilter === "important") {
            return task.important;
        }

        return true;
    });

    // =====================================================
    // PROFILE
    // =====================================================

    return (
        <div className="profile-page">

            <div className="profile-container">

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="profile-back"
                    onClick={onBack}
                >
                    ← Back to workspace
                </button>

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="profile-header">

                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                        <p className="profile-kicker">
                            PERSONAL PROFILE
                        </p>

                        <h1>
                            {user?.name || "User"}
                        </h1>

                        <p>
                            Your Tuduu account and workspace
                        </p>
                    </div>

                </div>

                {/* =================================================
                    PROFILE CARD
                ================================================= */}

                <div className="profile-card">

                    <div className="profile-card-heading">
                        <div>
                            <span>ACCOUNT</span>

                            <h2>
                                Profile information
                            </h2>
                        </div>
                    </div>

                    {/* NAME */}

                    <div className="profile-field">
                        <label>Name</label>

                        <div className="profile-value">
                            {user?.name || "Not available"}
                        </div>
                    </div>

                    {/* EMAIL */}

                    <div className="profile-field">
                        <label>Email</label>

                        <div className="profile-value">
                            {user?.email || "Not available"}
                        </div>
                    </div>

                    {/* WORKSPACE */}

                    <div className="profile-field">
                        <label>Workspace</label>

                        <div className="profile-value">
                            Personal workspace
                        </div>
                    </div>

                </div>

                {/* =================================================
                    PROFILE ERROR
                ================================================= */}

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
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* =================================================
                    TASK HISTORY
                ================================================= */}

                <div className="profile-history">

                    {/* HISTORY HEADER */}

                    <div className="profile-history-heading">

                        <div>
                            <span>
                                PRODUCTIVITY
                            </span>

                            <h2>
                                Task history
                            </h2>
                        </div>

                        <span>
                            {profileTasks.length} total
                        </span>

                    </div>

                    {/* =================================================
                        FILTER BUTTONS
                    ================================================= */}

                    <div className="profile-filters">

                        <button
                            type="button"
                            className={`profile-filter-button ${activeFilter === "all"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveFilter("all")
                            }
                        >
                            All
                        </button>

                        <button
                            type="button"
                            className={`profile-filter-button ${activeFilter === "active"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveFilter("active")
                            }
                        >
                            Active
                        </button>

                        <button
                            type="button"
                            className={`profile-filter-button ${activeFilter === "completed"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveFilter("completed")
                            }
                        >
                            Completed
                        </button>

                        <button
                            type="button"
                            className={`profile-filter-button ${activeFilter === "important"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveFilter("important")
                            }
                        >
                            ⭐ Important
                        </button>

                    </div>

                    {/* =================================================
                        TASK LIST
                    ================================================= */}

                    <div className="profile-task-list">

                        {loading ? (

                            <div className="profile-empty">

                                <span>
                                    🐰
                                </span>

                                <h3>
                                    Loading your history...
                                </h3>

                                <p>
                                    Getting your productivity records ready.
                                </p>

                            </div>

                        ) : filteredTasks.length === 0 ? (

                            <div className="profile-empty">

                                <span>
                                    🐰
                                </span>

                                <h3>
                                    No tasks here yet
                                </h3>

                                <p>
                                    Tasks matching this filter will appear here.
                                </p>

                            </div>

                        ) : (

                            filteredTasks.map((task) => (

                                <div
                                    className="profile-task"
                                    key={task.id}
                                >

                                    {/* =================================================
                                        TASK INFORMATION
                                    ================================================= */}

                                    <div className="profile-task-main">

                                        <div
                                            className={`profile-task-status ${task.completed
                                                    ? "completed"
                                                    : "active"
                                                }`}
                                        >
                                            {task.completed
                                                ? "✓"
                                                : "○"}
                                        </div>

                                        <div>

                                            <h3>
                                                {task.title}
                                            </h3>

                                            <p>
                                                {task.deleted_at
                                                    ? "Deleted"
                                                    : task.completed
                                                        ? "Completed"
                                                        : "Active"}
                                            </p>

                                        </div>

                                    </div>

                                    {/* =================================================
                                        TASK META
                                    ================================================= */}

                                    <div className="profile-task-meta">

                                        {/* TIMESTAMPS */}

                                        <div className="profile-task-dates">

                                            <span>
                                                Created:{" "}
                                                {new Date(
                                                    task.created_at
                                                ).toLocaleString()}
                                            </span>

                                            <span>
                                                Updated:{" "}
                                                {new Date(
                                                    task.updated_at
                                                ).toLocaleString()}
                                            </span>

                                            {task.completed_at && (
                                                <span>
                                                    Completed:{" "}
                                                    {new Date(
                                                        task.completed_at
                                                    ).toLocaleString()}
                                                </span>
                                            )}

                                            {task.deleted_at && (
                                                <span>
                                                    Deleted:{" "}
                                                    {new Date(
                                                        task.deleted_at
                                                    ).toLocaleString()}
                                                </span>
                                            )}

                                        </div>

                                        {/* BADGES + ACTIONS */}

                                        <div className="profile-task-actions">

                                            {task.important && (
                                                <span className="profile-important-badge">
                                                    ★ Important
                                                </span>
                                            )}

                                            {task.deleted_at && (
                                                <span className="profile-deleted-badge">
                                                    🗑 Deleted
                                                </span>
                                            )}

                                            {task.deleted_at && (
                                                <button
                                                    type="button"
                                                    className="profile-permanent-delete"
                                                    onClick={() =>
                                                        permanentlyDeleteTask(
                                                            task.id
                                                        )
                                                    }
                                                    title="Permanently delete task"
                                                >
                                                    Remove permanently
                                                </button>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

                {/* =================================================
                    PROFILE FOOTER
                ================================================= */}

                <div className="profile-footer">

                    <span>
                        🐰
                    </span>

                    <span>
                        tuduu
                    </span>

                </div>

            </div>

        </div>
    );
}

export default Profile;