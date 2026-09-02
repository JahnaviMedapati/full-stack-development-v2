from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskUpdate,
    TaskImportantUpdate
)
from app.services import task_service
from app.models.user import User


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# =========================================================
# GET ACTIVE TASKS
# Dashboard only shows tasks that are not deleted
# =========================================================

@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return task_service.get_tasks(
        db,
        current_user.id
    )


# =========================================================
# CREATE TASK
# =========================================================

@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return task_service.create_task(
        db,
        task.title,
        current_user.id
    )


# =========================================================
# UPDATE TASK
# =========================================================

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_task = task_service.update_task(
        db,
        task_id,
        task.title,
        task.completed,
        current_user.id,
        task.important
    )

    if updated_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return updated_task

# =========================================================
# UPDATE IMPORTANT STATUS
# =========================================================


@router.patch("/{task_id}/important", response_model=TaskResponse)
def update_important(
    task_id: int,
    task: TaskImportantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_task = task_service.update_important(
        db,
        task_id,
        current_user.id,
        task.important
    )

    if updated_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return updated_task
# =========================================================
# SOFT DELETE TASK
# =========================================================


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = task_service.delete_task(
        db,
        task_id,
        current_user.id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "message": "Task deleted successfully"
    }
