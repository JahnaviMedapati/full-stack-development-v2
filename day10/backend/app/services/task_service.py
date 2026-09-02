from sqlalchemy.orm import Session

from app.repositories import task_repository


def get_tasks(
    db: Session,
    user_id: int
):
    return task_repository.get_all_tasks(
        db,
        user_id
    )


def get_task(
    db: Session,
    task_id: int,
    user_id: int
):
    return task_repository.get_task_by_id(
        db,
        task_id,
        user_id
    )


def get_profile_tasks(
    db: Session,
    user_id: int
):
    return task_repository.get_profile_tasks(
        db,
        user_id
    )


def create_task(
    db: Session,
    title: str,
    user_id: int
):
    return task_repository.create_task(
        db,
        title,
        user_id
    )


def update_task(
    db: Session,
    task_id: int,
    title: str,
    completed: bool,
    user_id: int,
    important: bool | None = None
):
    return task_repository.update_task(
        db,
        task_id,
        title,
        completed,
        user_id,
        important
    )


def delete_task(
    db: Session,
    task_id: int,
    user_id: int
):
    return task_repository.delete_task(
        db,
        task_id,
        user_id
    )


def permanently_delete_task(
    db: Session,
    task_id: int,
    user_id: int
):
    return task_repository.permanently_delete_task(
        db,
        task_id,
        user_id
    )


def update_important(
    db: Session,
    task_id: int,
    user_id: int,
    important: bool
):
    return task_repository.update_important(
        db,
        task_id,
        user_id,
        important
    )
