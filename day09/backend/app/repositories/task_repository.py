from sqlalchemy.orm import Session

from app.models.task import Task


def get_all_tasks(
    db: Session,
    user_id: int
):
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .all()
    )


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


def create_task(
    db: Session,
    title: str,
    user_id: int
):
    task = Task(
        title=title,
        completed=False,
        user_id=user_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def update_task(
    db: Session,
    task_id: int,
    title: str,
    completed: bool,
    user_id: int
):
    task = get_task_by_id(
        db,
        task_id,
        user_id
    )

    if task is None:
        return None

    task.title = title
    task.completed = completed

    db.commit()
    db.refresh(task)

    return task


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

    db.delete(task)
    db.commit()

    return True
