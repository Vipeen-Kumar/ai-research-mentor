from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedUUIDModel


class Roadmap(TimestampedUUIDModel):
    __tablename__ = "roadmaps"

    topic_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    provider: Mapped[str] = mapped_column(String(100), nullable=False)
    topic_name: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)

    topic = relationship("Topic", back_populates="roadmaps")
    nodes = relationship(
        "RoadmapNode",
        back_populates="roadmap",
        cascade="all, delete-orphan",
        order_by="RoadmapNode.sort_order",
    )
