from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedUUIDModel


class Topic(TimestampedUUIDModel):
    __tablename__ = "topics"

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)

    roadmaps = relationship("Roadmap", back_populates="topic", cascade="all, delete-orphan")
