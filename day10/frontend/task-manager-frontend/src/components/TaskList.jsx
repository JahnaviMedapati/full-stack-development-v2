import TaskItem from "./TaskItem";

function TaskList({
    tasks,
    onToggleTask,
    onDeleteTask,
    onUpdateTask,
    onToggleImportant,
}) {
    return (
        <div className="task-list">
            {tasks.length === 0 ? (
                <div className="empty-state">
                    <h2>All clear! ✨</h2>
                    <p>You don't have any tasks right now.</p>
                </div>
            ) : (
                tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleTask={onToggleTask}
                        onDeleteTask={onDeleteTask}
                        onUpdateTask={onUpdateTask}
                        onToggleImportant={onToggleImportant}
                    />
                ))
            )}
        </div>
    );
}

export default TaskList;