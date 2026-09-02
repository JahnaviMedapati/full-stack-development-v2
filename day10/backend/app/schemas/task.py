
from datetime import datetime

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    title: str
    completed: bool
    important: bool | None = None


class TaskImportantUpdate(BaseModel):
    important: bool


class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    important: bool
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
