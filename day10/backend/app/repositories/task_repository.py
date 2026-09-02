from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.task import Task


# =========================================================
# GET ACTIVE TASKS
# =========================================================

def get_all_tasks(
    db: Session,
    user_id: int
):
    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.deleted_at.is_(None)
        )
        .order_by(Task.created_at.desc())
        .all()
    )


# =========================================================
# GET TASK BY ID
# =========================================================

def get_task_by_id(
    db: Session,
    task_id: int,
    user_id: int
):
    return (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )


# =========================================================
# GET PROFILE TASKS
# Includes active + deleted tasks
# =========================================================

def get_profile_tasks(
    db: Session,
    user_id: int
):
    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id
        )
        .order_by(Task.created_at.desc())
        .all()
    )


# =========================================================
# CREATE TASK
# =========================================================

def create_task(
    db: Session,
    title: str,
    user_id: int
):
    task = Task(
        title=title,
        completed=False,
        important=False,
        user_id=user_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


# =========================================================
# UPDATE TASK
# =========================================================

def update_task(
    db: Session,
    task_id: int,
    title: str,
    completed: bool,
    user_id: int,
    important: bool | None = None
):
    task = get_task_by_id(
        db,
        task_id,
        user_id
    )

    if task is None:
        return None

    # Track when the task was completed
    if completed and not task.completed:
        task.completed_at = datetime.now(timezone.utc)

    # If a completed task becomes active again
    elif not completed and task.completed:
        task.completed_at = None

    task.title = title
    task.completed = completed
    task.updated_at = datetime.now(timezone.utc)

    # Only change important if the request actually provides it
    if important is not None:
        task.important = important

    db.commit()
    db.refresh(task)

    return task

# =========================================================
# SOFT DELETE TASK
# =========================================================


def delete_task(
    db: Session,
    task_id: int,
    user_id: int
):
    task = get_task_by_id(
        db,
        task_id,
        user_id
    )

    if task is None:
        return False

    task.deleted_at = datetime.now(timezone.utc)
    task.updated_at = datetime.now(timezone.utc)

    db.commit()

    return True

# =========================================================
# PERMANENTLY DELETE TASK
# =========================================================


def permanently_delete_task(
    db: Session,
    task_id: int,
    user_id: int
):
    task = get_task_by_id(
        db,
        task_id,
        user_id
    )

    if task is None:
        return False

    db.delete(task)
    db.commit()

    return True

# =========================================================
# UPDATE IMPORTANT STATUS
# =========================================================


def update_important(
    db: Session,
    task_id: int,
    user_id: int,
    important: bool
):
    task = get_task_by_id(
        db,
        task_id,
        user_id
    )

    if task is None:
        return None

    task.important = important
    task.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(task)

    return task
