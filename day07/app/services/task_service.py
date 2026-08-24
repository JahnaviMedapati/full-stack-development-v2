from sqlalchemy.orm import Session

from app.repositories import task_repository


def get_tasks(db: Session):
    return task_repository.get_all_tasks(db)


def get_task(db: Session, task_id: int):
    return task_repository.get_task_by_id(db, task_id)


def create_task(db: Session, title: str):
    return task_repository.create_task(db, title)


def update_task(
    db: Session,
    task_id: int,
    title: str,
    completed: bool
):
    return task_repository.update_task(
        db,
        task_id,
        title,
        completed
    )


def delete_task(db: Session, task_id: int):
    return task_repository.delete_task(db, task_id)
