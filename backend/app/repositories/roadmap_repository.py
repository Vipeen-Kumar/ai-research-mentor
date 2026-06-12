import re

from sqlalchemy.orm import Session

from app.models.roadmap import Roadmap
from app.models.roadmap_node import RoadmapNode
from app.models.topic import Topic
from app.services.ai.base_provider import GeneratedRoadmap


def normalize_topic_slug(topic_name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", topic_name.strip().lower())
    return slug.strip("-")


class RoadmapRepository:
    def get_topic_by_slug(self, db: Session, slug: str) -> Topic | None:
        return db.query(Topic).filter(Topic.slug == slug).first()

    def get_or_create_topic(self, db: Session, topic_name: str) -> Topic:
        slug = normalize_topic_slug(topic_name)
        topic = self.get_topic_by_slug(db, slug)
        if topic is not None:
            return topic

        topic = Topic(name=topic_name, slug=slug)
        db.add(topic)
        db.flush()
        return topic

    def create_roadmap(
        self,
        db: Session,
        topic: Topic,
        provider_name: str,
        generated_roadmap: GeneratedRoadmap,
    ) -> Roadmap:
        roadmap = Roadmap(
            topic_id=topic.id,
            provider=provider_name,
            topic_name=generated_roadmap.topic,
            summary=generated_roadmap.summary,
        )
        db.add(roadmap)
        db.flush()

        previous_node_id: str | None = None
        for index, generated_node in enumerate(generated_roadmap.nodes, start=1):
            roadmap_node = RoadmapNode(
                roadmap_id=roadmap.id,
                parent_node_id=previous_node_id,
                title=generated_node.title,
                description=generated_node.description,
                sort_order=index,
            )
            db.add(roadmap_node)
            db.flush()
            previous_node_id = roadmap_node.id

        db.commit()
        db.refresh(roadmap)
        return roadmap

    def get_all_roadmaps(self, db: Session) -> list[Roadmap]:
        from sqlalchemy.orm import joinedload
        return db.query(Roadmap).options(joinedload(Roadmap.nodes)).order_by(Roadmap.created_at.desc()).all()

    def get_roadmap_by_id(self, db: Session, roadmap_id: str) -> Roadmap | None:
        from sqlalchemy.orm import joinedload
        return db.query(Roadmap).options(joinedload(Roadmap.nodes)).filter(Roadmap.id == roadmap_id).first()

