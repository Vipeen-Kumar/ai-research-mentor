from app.core.config import Settings


def test_default_api_prefix() -> None:
    settings = Settings()
    assert settings.api_v1_str == "/api/v1"
