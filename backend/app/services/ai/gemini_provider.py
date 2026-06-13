"""
Gemini-powered roadmap generation provider.

Uses Google's Generative AI API to generate structured learning roadmaps
for any STEM topic with fallback to mock provider on failure.
"""

import json
import logging
from typing import Optional

import google.generativeai as genai

from app.services.ai.base_provider import (
    BaseRoadmapProvider,
    GeneratedRoadmap,
    GeneratedRoadmapNode,
)
from app.services.ai.mock_provider import MockRoadmapProvider

logger = logging.getLogger(__name__)


class GeminiRoadmapProvider(BaseRoadmapProvider):
    """
    Generates learning roadmaps using Google Gemini API.
    Falls back to mock provider if Gemini fails.
    """

    provider_name = "gemini"

    def __init__(self, api_key: str):
        """
        Initialize Gemini provider with API key.

        Args:
            api_key: Google Generative AI API key
        """
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        self.api_key = api_key
        self.fallback_provider = MockRoadmapProvider()

        # Configure Gemini API
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def generate_roadmap(self, topic: str) -> GeneratedRoadmap:
        """
        Generate a learning roadmap for the given topic using Gemini.

        Attempts to generate with Gemini first. On failure, retries once.
        If still failing, falls back to mock provider.

        Args:
            topic: The STEM topic to generate a roadmap for

        Returns:
            GeneratedRoadmap with nodes and connections

        Raises:
            ValueError: Only if both Gemini and mock provider fail (unlikely)
        """
        try:
            # Try Gemini first
            return self._generate_with_gemini(topic)
        except Exception as e:
            logger.warning(f"Gemini generation failed: {e}. Retrying...")

            try:
                # Retry once
                return self._generate_with_gemini(topic)
            except Exception as retry_error:
                logger.warning(f"Gemini retry failed: {retry_error}. Falling back to mock provider.")

                try:
                    # Fall back to mock provider
                    return self.fallback_provider.generate_roadmap(topic)
                except Exception as fallback_error:
                    logger.error(f"All generation methods failed: {fallback_error}")
                    raise ValueError(
                        f"Failed to generate roadmap for '{topic}'. "
                        "Please try again or contact support."
                    ) from fallback_error

    def _generate_with_gemini(self, topic: str) -> GeneratedRoadmap:
        """
        Internal method to generate roadmap with Gemini.

        Args:
            topic: The topic to generate roadmap for

        Returns:
            GeneratedRoadmap with structured nodes

        Raises:
            Exception: If Gemini API call fails or returns invalid JSON
        """
        prompt = self._build_prompt(topic)

        # Call Gemini API
        response = self.model.generate_content(prompt)
        response_text = response.text

        # Extract and parse JSON
        roadmap_data = self._extract_json(response_text)
        roadmap = self._parse_roadmap(roadmap_data, topic)

        logger.info(f"Successfully generated roadmap for '{topic}' using Gemini")
        return roadmap

    def _build_prompt(self, topic: str) -> str:
        """
        Build the prompt for Gemini to generate a learning roadmap.

        Args:
            topic: The STEM topic to create a roadmap for

        Returns:
            Formatted prompt string
        """
        return f"""You are an expert educational curriculum designer specializing in STEM topics.

Generate a structured learning roadmap for the topic: "{topic}"

Create a progressive learning path from foundational concepts to advanced topics.
Include 5-7 key learning steps that build upon each other.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{{
  "topic": "exact topic name",
  "summary": "brief description of the learning path (1-2 sentences)",
  "nodes": [
    {{
      "title": "node title",
      "difficulty": "Beginner|Intermediate|Advanced",
      "description": "what students will learn (1-2 sentences)",
      "duration": "X weeks"
    }}
  ]
}}

Important requirements:
1. Return ONLY valid JSON, no other text
2. Include 5-7 nodes
3. Difficulty should progress: Beginner → Intermediate → Advanced
4. Duration should be realistic (1-4 weeks per node)
5. Descriptions should be concise and focused
6. Nodes should form a logical learning progression
7. Each node title should be unique

Generate the roadmap now."""

    def _extract_json(self, text: str) -> dict:
        """
        Extract JSON from model response text.

        Handles responses that may include markdown code blocks or extra text.

        Args:
            text: Raw response text from Gemini

        Returns:
            Parsed JSON dictionary

        Raises:
            ValueError: If valid JSON cannot be extracted
        """
        # Try to extract from markdown code blocks first
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.find("```", start)
            if end > start:
                text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.find("```", start)
            if end > start:
                text = text[start:end].strip()

        # Try to find JSON object in text
        try:
            # Try direct parsing first
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to find JSON object boundaries
            start = text.find("{")
            end = text.rfind("}") + 1
            if start >= 0 and end > start:
                try:
                    return json.loads(text[start:end])
                except json.JSONDecodeError as e:
                    raise ValueError(f"Failed to parse JSON from response: {e}") from e

            raise ValueError("No valid JSON found in response")

    def _parse_roadmap(self, data: dict, original_topic: str) -> GeneratedRoadmap:
        """
        Parse and validate roadmap JSON from Gemini.

        Args:
            data: Dictionary with roadmap data
            original_topic: Original topic string (for fallback)

        Returns:
            GeneratedRoadmap object

        Raises:
            ValueError: If data is missing required fields or invalid
        """
        try:
            # Extract fields with validation
            topic = data.get("topic", original_topic).strip()
            summary = data.get("summary", "").strip()
            nodes_data = data.get("nodes", [])

            if not isinstance(nodes_data, list) or len(nodes_data) < 1:
                raise ValueError("'nodes' must be a non-empty list")

            if len(nodes_data) > 10:
                logger.warning(f"Too many nodes ({len(nodes_data)}), truncating to 10")
                nodes_data = nodes_data[:10]

            # Parse nodes
            nodes = []
            for i, node_data in enumerate(nodes_data):
                node = self._parse_node(node_data, i)
                nodes.append(node)

            if not nodes:
                raise ValueError("No valid nodes could be parsed")

            return GeneratedRoadmap(topic=topic, summary=summary, nodes=nodes)

        except (KeyError, TypeError, ValueError) as e:
            raise ValueError(f"Invalid roadmap data: {e}") from e

    def _parse_node(self, node_data: dict, index: int) -> GeneratedRoadmapNode:
        """
        Parse a single roadmap node from JSON.

        Args:
            node_data: Dictionary with node data
            index: Node index for error context

        Returns:
            GeneratedRoadmapNode object

        Raises:
            ValueError: If required fields are missing or invalid
        """
        try:
            title = node_data.get("title", "").strip()
            description = node_data.get("description", "").strip()

            if not title:
                raise ValueError("Node title is required and cannot be empty")

            if not description:
                raise ValueError(f"Node '{title}' is missing description")

            # Title and description length validation
            if len(title) > 100:
                title = title[:100]
                logger.warning(f"Node title truncated to 100 chars")

            if len(description) > 500:
                description = description[:500]
                logger.warning(f"Node description truncated to 500 chars")

            return GeneratedRoadmapNode(title=title, description=description)

        except (KeyError, TypeError) as e:
            raise ValueError(f"Invalid node at index {index}: {e}") from e

    @staticmethod
    def validate_api_key(api_key: Optional[str]) -> bool:
        """
        Validate that API key is set and appears valid.

        Args:
            api_key: The API key to validate

        Returns:
            True if valid, False otherwise
        """
        if not api_key:
            return False

        # Basic format check (Gemini keys typically start with 'AIza' or 'AQ.')
        if not isinstance(api_key, str) or len(api_key) < 20:
            return False

        return True
