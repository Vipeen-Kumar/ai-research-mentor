import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager for startup and shutdown events.
    
    Validates provider configuration at startup.
    """
    # Startup
    logger.info("=" * 60)
    logger.info("Starting AI Research Mentor API")
    logger.info(f"Environment: {settings.app_env}")
    logger.info(f"AI Provider: {settings.ai_provider}")
    
    if settings.ai_provider.lower() == "gemini":
        logger.info("Gemini provider configured")
        if settings.gemini_api_key:
            logger.info("Gemini API key: ✓ Configured")
        else:
            logger.warning("Gemini API key: ✗ NOT CONFIGURED")
            logger.warning("Falling back to mock provider")
    
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Research Mentor API")


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    debug=settings.app_debug,
    docs_url="/docs" if settings.docs_enabled else None,
    redoc_url="/redoc" if settings.docs_enabled else None,
    openapi_url="/openapi.json" if settings.docs_enabled else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_str)


@app.get("/", tags=["meta"])
def read_root() -> dict[str, str]:
    return {
        "message": "AI Research Mentor API is running.",
        "environment": settings.app_env,
    }


@app.get("/health/provider", tags=["meta"])
def health_check_provider() -> dict:
    """
    Health check endpoint for AI provider.
    
    Returns provider status and diagnostic information.
    Useful for monitoring and debugging.
    """
    from app.api.deps import get_ai_provider
    
    try:
        provider = get_ai_provider()
        
        # If Gemini, run detailed health check
        if hasattr(provider, 'health_check'):
            return provider.health_check()
        
        # Mock provider is always healthy
        return {
            "status": "healthy",
            "provider": provider.provider_name,
            "model": "mock (always available)"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }
