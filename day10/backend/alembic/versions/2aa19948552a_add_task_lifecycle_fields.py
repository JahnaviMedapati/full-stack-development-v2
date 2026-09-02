"""add task lifecycle fields

Revision ID: 2aa19948552a
Revises: 541b957ee055
Create Date: 2026-09-02
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2aa19948552a"
down_revision: Union[str, Sequence[str], None] = "541b957ee055"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Existing tasks need a value for this new NOT NULL column.
    op.add_column(
        "tasks",
        sa.Column(
            "important",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )

    op.add_column(
        "tasks",
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.add_column(
        "tasks",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.add_column(
        "tasks",
        sa.Column(
            "completed_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.add_column(
        "tasks",
        sa.Column(
            "deleted_at",
            sa.DateTime(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("tasks", "deleted_at")
    op.drop_column("tasks", "completed_at")
    op.drop_column("tasks", "updated_at")
    op.drop_column("tasks", "created_at")
    op.drop_column("tasks", "important")
