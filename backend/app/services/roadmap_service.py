from sqlalchemy.orm import Session
import logging

from app.repositories.roadmap_repository import RoadmapRepository
from app.schemas.roadmap import (
    RoadmapEdgeResponse,
    RoadmapGenerateResponse,
    RoadmapNodeResponse,
    RoadmapSummaryResponse,
    RoadmapDetailResponse,
)
from app.services.ai.base_provider import BaseRoadmapProvider

logger = logging.getLogger(__name__)


class RoadmapService:
    def __init__(
        self,
        repository: RoadmapRepository,
        provider: BaseRoadmapProvider,
    ) -> None:
        self.repository = repository
        self.provider = provider
        logger.warning(f"=== RoadmapService initialized ===")
        logger.warning(f"Provider: {provider.provider_name}")
        logger.warning(f"Provider class: {provider.__class__.__name__}")

    def generate(self, db: Session, topic: str) -> RoadmapGenerateResponse:
        normalized_topic = topic.strip()
        logger.warning(f"=== RoadmapService.generate() called ===")
        logger.warning(f"Topic: {normalized_topic}")
        logger.warning(f"Using provider: {self.provider.provider_name} ({self.provider.__class__.__name__})")
        generated_roadmap = self.provider.generate_roadmap(normalized_topic)
        topic_record = self.repository.get_or_create_topic(db, generated_roadmap.topic)
        roadmap = self.repository.create_roadmap(
            db=db,
            topic=topic_record,
            provider_name=self.provider.provider_name,
            generated_roadmap=generated_roadmap,
        )

        ordered_nodes = sorted(roadmap.nodes, key=lambda node: node.sort_order)
        nodes = [
            RoadmapNodeResponse(
                id=node.id,
                title=node.title,
                description=node.description,
                subtopics=node.subtopics,
                order=node.sort_order,
            )
            for node in ordered_nodes
        ]
        edges = [
            RoadmapEdgeResponse(
                id=f"{node.parent_node_id}->{node.id}",
                source=node.parent_node_id,
                target=node.id,
            )
            for node in ordered_nodes
            if node.parent_node_id is not None
        ]

        return RoadmapGenerateResponse(
            roadmap_id=roadmap.id,
            topic=roadmap.topic_name,
            provider=roadmap.provider,
            summary=roadmap.summary,
            nodes=nodes,
            edges=edges,
        )

    def list_roadmaps(self, db: Session) -> list[RoadmapSummaryResponse]:
        roadmaps = self.repository.get_all_roadmaps(db)
        return [
            RoadmapSummaryResponse(
                id=roadmap.id,
                topic=roadmap.topic_name,
                created_at=roadmap.created_at,
                node_count=len(roadmap.nodes),
            )
            for roadmap in roadmaps
        ]

    def get_roadmap_detail(self, db: Session, roadmap_id: str) -> RoadmapDetailResponse | None:
        roadmap = self.repository.get_roadmap_by_id(db, roadmap_id)
        if roadmap is None:
            return None

        ordered_nodes = sorted(roadmap.nodes, key=lambda node: node.sort_order)
        nodes = [
            RoadmapNodeResponse(
                id=node.id,
                title=node.title,
                description=node.description,
                subtopics=node.subtopics,
                order=node.sort_order,
            )
            for node in ordered_nodes
        ]
        edges = [
            RoadmapEdgeResponse(
                id=f"{node.parent_node_id}->{node.id}",
                source=node.parent_node_id,
                target=node.id,
            )
            for node in ordered_nodes
            if node.parent_node_id is not None
        ]

        return RoadmapDetailResponse(
            id=roadmap.id,
            topic=roadmap.topic_name,
            nodes=nodes,
            edges=edges,
        )
