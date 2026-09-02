import { useState } from "react";

function TaskItem({
    task,
    onToggleTask,
    onDeleteTask,
    onUpdateTask,
    onToggleImportant,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    function handleEditClick() {
        setEditTitle(task.title);
        setIsEditing(true);
    }

    function handleCancelEdit() {
        setEditTitle(task.title);
        setIsEditing(false);
    }

    async function handleSaveEdit() {
        const cleanTitle = editTitle.trim();

        if (!cleanTitle) {
            return;
        }

        await onUpdateTask(task.id, cleanTitle);

        setIsEditing(false);
    }

    return (
        <div className={`task-item ${isEditing ? "editing" : ""}`}>

            <div className="task-content">

                <button
                    className={`check-button ${task.completed ? "checked" : ""
                        }`}
                    onClick={() => onToggleTask(task.id)}
                    aria-label={
                        task.completed
                            ? "Mark task incomplete"
                            : "Mark task complete"
                    }
                >
                    {task.completed && "✓"}
                </button>

                {isEditing ? (
                    <input
                        className="edit-input"
                        value={editTitle}
                        onChange={(event) =>
                            setEditTitle(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSaveEdit();
                            }

                            if (event.key === "Escape") {
                                handleCancelEdit();
                            }
                        }}
                        autoFocus
                    />
                ) : (
                    <span
                        className={
                            task.completed ? "completed" : ""
                        }
                    >
                        {task.title}
                    </span>
                )}

            </div>

            <div className="task-actions">

                {isEditing ? (
                    <>
                        {/* SAVE */}
                        <button
                            className="save-button"
                            onClick={handleSaveEdit}
                            aria-label="Save task"
                            title="Save changes"
                        >
                            ✓
                        </button>

                        {/* CANCEL */}
                        <button
                            className="cancel-button"
                            onClick={handleCancelEdit}
                            aria-label="Cancel editing"
                            title="Cancel"
                        >
                            ×
                        </button>
                    </>
                ) : (
                    <>
                        {/* IMPORTANT */}
                        <button
                            type="button"
                            className={`important-button ${task.important
                                    ? "important-active"
                                    : ""
                                }`}
                            onClick={() =>
                                onToggleImportant(task.id)
                            }
                            aria-label={
                                task.important
                                    ? "Remove from important"
                                    : "Mark as important"
                            }
                            title={
                                task.important
                                    ? "Remove from important"
                                    : "Mark as important"
                            }
                        >
                            {task.important ? "★" : "☆"}
                        </button>

                        {/* EDIT */}
                        <button
                            className="edit-button"
                            onClick={handleEditClick}
                            aria-label={`Edit ${task.title}`}
                            title="Edit task"
                        >
                            🖋️
                        </button>

                        {/* DELETE */}
                        <button
                            className="delete-button"
                            onClick={() => onDeleteTask(task.id)}
                            aria-label={`Delete ${task.title}`}
                            title="Delete task"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 7H20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M10 11V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M14 11V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M6 7L7 20H17L18 7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                <path
                                    d="M9 7V4H15V7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </>
                )}

            </div>

        </div>
    );
}

export default TaskItem;