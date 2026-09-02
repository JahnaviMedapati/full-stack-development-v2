from sqlalchemy.orm import Session

from app.auth import (
    hash_password,
    verify_password,
    create_access_token
)
from app.repositories import user_repository


def signup(
    db: Session,
    name: str,
    email: str,
    password: str
):
    existing_user = user_repository.get_user_by_email(
        db,
        email
    )

    if existing_user:
        return None

    hashed_password = hash_password(password)

    return user_repository.create_user(
        db,
        name,
        email,
        hashed_password
    )


def get_user_by_email(
    db: Session,
    email: str
):
    return user_repository.get_user_by_email(
        db,
        email
    )


def login(
    db: Session,
    email: str,
    password: str
):
    user = user_repository.get_user_by_email(
        db,
        email
    )

    if user is None:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }
