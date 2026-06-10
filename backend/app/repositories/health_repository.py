from sqlalchemy import text
from sqlalchemy.orm import Session


class HealthRepository:
    def ping(self, db: Session) -> None:
        db.execute(text("SELECT 1"))
