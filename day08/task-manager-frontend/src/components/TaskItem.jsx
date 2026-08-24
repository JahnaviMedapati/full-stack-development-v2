function TaskItem({ task, onToggleTask, onDeleteTask }) {
    return (
        <div className="task-item">
            <div className="task-content">
                <button
                    className={`check-button ${task.completed ? "checked" : ""}`}
                    onClick={() => onToggleTask(task.id)}
                    aria-label={
                        task.completed ? "Mark task incomplete" : "Mark task complete"
                    }
                >
                    {task.completed && "✓"}
                </button>

                <span className={task.completed ? "completed" : ""}>
                    {task.title}
                </span>
            </div>

            <div className="task-actions">
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
            </div>
        </div>
    );
}

export default TaskItem;