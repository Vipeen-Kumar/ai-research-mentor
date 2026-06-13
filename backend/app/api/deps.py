from collections.abc import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.repositories.roadmap_repository import RoadmapRepository
from app.services.ai.base_provider import BaseRoadmapProvider
from app.services.ai.gemini_provider import GeminiRoadmapProvider
from app.services.ai.mock_provider import MockRoadmapProvider
from app.services.roadmap_service import RoadmapService


def get_db_session() -> Generator[Session, None, None]:
    yield from get_db()


def get_roadmap_repository() -> RoadmapRepository:
    return RoadmapRepository()


def get_ai_provider() -> BaseRoadmapProvider:
    if settings.ai_provider.lower() == "gemini":
        if not settings.gemini_api_key:
            raise ValueError(
                "GEMINI_API_KEY environment variable is not set. "
                "Set it in .env or disable Gemini by setting AI_PROVIDER=mock"
            )
        return GeminiRoadmapProvider(api_key=settings.gemini_api_key)

    return MockRoadmapProvider()


def get_roadmap_service(
    repository: RoadmapRepository = Depends(get_roadmap_repository),
    provider: BaseRoadmapProvider = Depends(get_ai_provider),
) -> RoadmapService:
    return RoadmapService(repository=repository, provider=provider)
