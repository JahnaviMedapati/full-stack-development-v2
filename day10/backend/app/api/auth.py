from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest
from app.services import auth_service


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup", status_code=201)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):
    user = auth_service.signup(
        db,
        data.name,
        data.email,
        data.password
    )

    if user is None:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    result = auth_service.login(
        db,
        data.email,
        data.password
    )

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result
