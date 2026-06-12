from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db_session, get_roadmap_service
from app.schemas.roadmap import (
    RoadmapGenerateRequest,
    RoadmapGenerateResponse,
    RoadmapSummaryResponse,
    RoadmapDetailResponse,
)
from app.services.roadmap_service import RoadmapService


router = APIRouter()


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
