from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from app.models.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    completed = Column(Boolean, default=False)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )
