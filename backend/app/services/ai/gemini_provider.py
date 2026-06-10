from app.services.ai.base_provider import GeneratedRoadmap
from app.services.ai.mock_provider import MockRoadmapProvider


class GeminiRoadmapProvider(MockRoadmapProvider):
    provider_name = "gemini"

    def generate_roadmap(self, topic: str) -> GeneratedRoadmap:
        # Placeholder abstraction for a future Gemini integration.
        # This intentionally reuses deterministic mock outputs and never calls a real LLM.
        return super().generate_roadmap(topic)
