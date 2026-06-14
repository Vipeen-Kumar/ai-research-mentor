from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedUUIDModel


class RoadmapNode(TimestampedUUIDModel):
    __tablename__ = "roadmap_nodes"
    __table_args__ = (UniqueConstraint("roadmap_id", "sort_order", name="uq_roadmap_node_sort_order"),)

    roadmap_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("roadmaps.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    parent_node_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("roadmap_nodes.id", ondelete="SET NULL"),
        nullable=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    subtopics: Mapped[list[str]] = mapped_column(JSON, nullable=False, server_default='[]')
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)

    roadmap = relationship("Roadmap", back_populates="nodes")
    parent = relationship("RoadmapNode", remote_side="RoadmapNode.id")
