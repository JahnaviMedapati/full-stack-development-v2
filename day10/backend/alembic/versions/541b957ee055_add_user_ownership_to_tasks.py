"""add user ownership to tasks

Revision ID: 541b957ee055
Revises: b608b2f5771d
Create Date: 2026-08-25 10:44:21.002874

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '541b957ee055'
down_revision: Union[str, Sequence[str], None] = "d4c8e2a1f7b3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add the column temporarily as nullable
    op.add_column(
        "tasks",
        sa.Column("user_id", sa.Integer(), nullable=True)
    )

    # Assign existing tasks to the first registered user
    op.execute("""
        UPDATE tasks
        SET user_id = (
            SELECT id
            FROM users
            ORDER BY id
            LIMIT 1
        )
        WHERE user_id IS NULL
    """)

    # Make sure every task now has an owner
    op.alter_column(
        "tasks",
        "user_id",
        existing_type=sa.Integer(),
        nullable=False
    )

    # Connect tasks.user_id -> users.id
    op.create_foreign_key(
        "fk_tasks_user_id_users",
        "tasks",
        "users",
        ["user_id"],
        ["id"]
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "fk_tasks_user_id_users",
        "tasks",
        type_="foreignkey"
    )

    op.drop_column(
        "tasks",
        "user_id"
    )
