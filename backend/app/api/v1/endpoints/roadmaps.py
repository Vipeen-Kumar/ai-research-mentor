from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db_session, get_roadmap_service
from app.schemas.roadmap import RoadmapGenerateRequest, RoadmapGenerateResponse
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
