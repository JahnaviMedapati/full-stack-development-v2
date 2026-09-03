"""make task timestamps timezone aware

Revision ID: f1f879078b54
Revises: 2aa19948552a
Create Date: 2026-09-03
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f1f879078b54"
down_revision: Union[str, Sequence[str], None] = "2aa19948552a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "tasks",
        "created_at",
        existing_type=sa.DateTime(),
        type_=sa.DateTime(timezone=True),
        postgresql_using="created_at AT TIME ZONE 'UTC'",
    )

    op.alter_column(
        "tasks",
        "updated_at",
        existing_type=sa.DateTime(),
        type_=sa.DateTime(timezone=True),
        postgresql_using="updated_at AT TIME ZONE 'UTC'",
    )

    op.alter_column(
        "tasks",
        "completed_at",
        existing_type=sa.DateTime(),
        type_=sa.DateTime(timezone=True),
        postgresql_using="completed_at AT TIME ZONE 'UTC'",
    )

    op.alter_column(
        "tasks",
        "deleted_at",
        existing_type=sa.DateTime(),
        type_=sa.DateTime(timezone=True),
        postgresql_using="deleted_at AT TIME ZONE 'UTC'",
    )


def downgrade() -> None:
    op.alter_column(
        "tasks",
        "created_at",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DateTime(),
        postgresql_using="created_at AT TIME ZONE 'UTC'",
    )

    op.alter_column(
        "tasks",
        "updated_at",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DateTime(),
        postgresql_using="updated_at AT TIME ZONE 'UTC'",
    )

    op.alter_column(
        "tasks",
        "completed_at",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DateTime(),
        postgresql_using="completed_at AT TIME ZONE 'UTC'",
    )

    op.alter_column(
        "tasks",
        "deleted_at",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DateTime(),
        postgresql_using="deleted_at AT TIME ZONE 'UTC'",
    )
