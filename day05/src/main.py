from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.task_manager import TaskManager


class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    title: str
    completed: bool


app = FastAPI(title="Task Manager API")

manager = TaskManager()


@app.get("/tasks")
def get_tasks():
    return manager.list_tasks()


@app.post("/tasks", status_code=201)
def create_task(task: TaskCreate):
    return manager.add_task(task.title)


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    task = manager.get_task(task_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate):
    updated_task = manager.update_task(
        task_id,
        task.title,
        task.completed
    )

    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    deleted = manager.delete_task(task_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}
