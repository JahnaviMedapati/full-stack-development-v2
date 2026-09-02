from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.task import TaskResponse
from app.services import task_service


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# =========================================================
# GET TASK HISTORY
# =========================================================

@router.get("/tasks", response_model=list[TaskResponse])
def get_profile_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return task_service.get_profile_tasks(
        db,
        current_user.id
    )


# =========================================================
# PERMANENTLY DELETE TASK
# =========================================================

@router.delete("/tasks/{task_id}/permanent")
def permanently_delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = task_service.permanently_delete_task(
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
        "message": "Task permanently deleted"
    }
