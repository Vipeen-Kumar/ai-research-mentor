from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db_session
from app.schemas.health import HealthCheckResponse
from app.services.health_service import HealthService


router = APIRouter()
service = HealthService()


@router.get("", response_model=HealthCheckResponse)
def health_check(db: Session = Depends(get_db_session)) -> HealthCheckResponse:
    try:
        return service.check(db)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
