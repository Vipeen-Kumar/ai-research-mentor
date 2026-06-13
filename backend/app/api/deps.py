import logging
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

logger = logging.getLogger(__name__)


def get_db_session() -> Generator[Session, None, None]:
    yield from get_db()


def get_roadmap_repository() -> RoadmapRepository:
    return RoadmapRepository()


def get_ai_provider() -> BaseRoadmapProvider:
    """
    Dependency to get the configured AI provider.
    
    Returns GeminiRoadmapProvider if AI_PROVIDER=gemini and API key is set.
    Otherwise returns MockRoadmapProvider as fallback.
    """
    if settings.ai_provider.lower() == "gemini":
        if not settings.gemini_api_key:
            logger.warning(
                "Gemini provider requested but GEMINI_API_KEY not set. "
                "Falling back to mock provider."
            )
            return MockRoadmapProvider()
        
        try:
            logger.debug("Instantiating Gemini provider")
            return GeminiRoadmapProvider(api_key=settings.gemini_api_key)
        except ValueError as e:
            logger.error(f"Failed to instantiate Gemini provider: {e}. Using mock provider.")
            return MockRoadmapProvider()
    
    logger.debug("Using mock provider")
    return MockRoadmapProvider()


def get_roadmap_service(
    repository: RoadmapRepository = Depends(get_roadmap_repository),
    provider: BaseRoadmapProvider = Depends(get_ai_provider),
) -> RoadmapService:
    return RoadmapService(repository=repository, provider=provider)
