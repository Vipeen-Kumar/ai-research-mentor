from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.repositories.health_repository import HealthRepository
from app.schemas.health import HealthCheckResponse


class HealthService:
    def __init__(self, repository: HealthRepository | None = None) -> None:
        self.repository = repository or HealthRepository()

    def check(self, db: Session) -> HealthCheckResponse:
        try:
            self.repository.ping(db)
        except SQLAlchemyError as exc:
            raise RuntimeError("Database connection failed.") from exc

        return HealthCheckResponse(status="ok", database="connected")
