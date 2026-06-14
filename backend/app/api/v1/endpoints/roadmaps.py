from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.api.deps import get_db_session, get_roadmap_service, get_ai_provider
from app.schemas.roadmap import (
    RoadmapGenerateRequest,
    RoadmapGenerateResponse,
    RoadmapSummaryResponse,
    RoadmapDetailResponse,
)
from app.services.roadmap_service import RoadmapService
from app.services.ai.base_provider import BaseRoadmapProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/debug/provider",
    status_code=status.HTTP_200_OK,
    summary="Debug: Get current AI provider configuration",
    description="Returns which AI provider is currently active and its configuration.",
)
def debug_get_provider(
    provider: BaseRoadmapProvider = Depends(get_ai_provider),
) -> dict:
    """Debug endpoint to verify which provider is active."""
    logger.warning(f"=== /debug/provider endpoint called ===")
    logger.warning(f"Provider type: {type(provider).__name__}")
    logger.warning(f"Provider name: {provider.provider_name}")
    
    from app.core.config import settings
    
    return {
        "provider": provider.provider_name,
        "provider_class": provider.__class__.__name__,
        "api_provider_setting": settings.ai_provider,
        "gemini_configured": settings.ai_provider.lower() == "gemini",
        "api_key_loaded": bool(settings.gemini_api_key),
        "api_key_first_20": settings.gemini_api_key[:20] if settings.gemini_api_key else None,
        "is_gemini_provider": provider.__class__.__name__ == "GeminiRoadmapProvider",
    }


@router.get(
    "/debug/gemini",
    status_code=status.HTTP_200_OK,
    summary="Debug: Test Gemini API directly",
    description="Calls Gemini API directly and returns raw response. Tests new SDK.",
)
def debug_gemini_test(
    provider: BaseRoadmapProvider = Depends(get_ai_provider),
) -> dict:
    """Debug endpoint to test Gemini integration directly."""
    logger.warning("=" * 60)
    logger.warning("/debug/gemini endpoint called")
    logger.warning("=" * 60)
    
    # Check if provider is Gemini
    if provider.__class__.__name__ != "GeminiRoadmapProvider":
        logger.error(f"Provider is {provider.__class__.__name__}, not GeminiRoadmapProvider")
        return {
            "status": "error",
            "message": f"Expected GeminiRoadmapProvider, got {provider.__class__.__name__}",
            "provider_class": provider.__class__.__name__,
        }
    
    try:
        logger.warning("Testing Gemini health check...")
        health = provider.health_check()
        logger.warning(f"Health check result: {health}")
        
        # Try to generate a simple roadmap
        logger.warning("Testing Gemini with simple topic: 'Python Basics'")
        test_roadmap = provider.generate_roadmap("Python Basics")
        logger.warning(f"Generated roadmap: {test_roadmap.topic}")
        logger.warning(f"Nodes: {[n.title for n in test_roadmap.nodes]}")
        
        return {
            "status": "success",
            "message": "Gemini integration working",
            "model": provider.MODEL_NAME,
            "health_check": health,
            "test_roadmap": {
                "topic": test_roadmap.topic,
                "summary": test_roadmap.summary,
                "node_count": len(test_roadmap.nodes),
                "node_titles": [n.title for n in test_roadmap.nodes],
            }
        }
        
    except Exception as e:
        logger.exception(f"Gemini test failed: {e}")
        return {
            "status": "error",
            "message": f"Gemini test failed: {type(e).__name__}: {e}",
            "model": provider.MODEL_NAME,
            "error_details": str(e),
        }


@router.post(
    "/generate",
    response_model=RoadmapGenerateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate and persist a STEM learning roadmap",
    description=(
        "Generates a deterministic STEM roadmap through the configured AI provider abstraction, "
        "persists the result in PostgreSQL, and returns node and edge data for graph rendering."
    ),
)
def generate_roadmap(
    payload: RoadmapGenerateRequest,
    db: Session = Depends(get_db_session),
    roadmap_service: RoadmapService = Depends(get_roadmap_service),
) -> RoadmapGenerateResponse:
    logger.warning(f"=== /roadmaps/generate endpoint called ===")
    logger.warning(f"Topic: {payload.topic}")
    return roadmap_service.generate(db=db, topic=payload.topic)


@router.get(
    "",
    response_model=list[RoadmapSummaryResponse],
    status_code=status.HTTP_200_OK,
    summary="List all saved roadmaps",
    description="Returns metadata for all previously generated and saved roadmaps, ordered by creation date descending.",
)
def list_roadmaps(
    db: Session = Depends(get_db_session),
    roadmap_service: RoadmapService = Depends(get_roadmap_service),
) -> list[RoadmapSummaryResponse]:
    return roadmap_service.list_roadmaps(db=db)


@router.get(
    "/{roadmap_id}",
    response_model=RoadmapDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get detailed roadmap by ID",
    description="Returns the full details (nodes and edges) for a specific saved roadmap.",
)
def get_roadmap(
    roadmap_id: str,
    db: Session = Depends(get_db_session),
    roadmap_service: RoadmapService = Depends(get_roadmap_service),
) -> RoadmapDetailResponse:
    roadmap = roadmap_service.get_roadmap_detail(db=db, roadmap_id=roadmap_id)
    if roadmap is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap with ID '{roadmap_id}' not found.",
        )
    return roadmap
