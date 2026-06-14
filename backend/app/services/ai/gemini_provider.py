"""
Gemini-powered roadmap generation provider using the new Google GenAI SDK.

Uses Google's Generative AI API to generate structured learning roadmaps
for any STEM topic with retry logic for rate limiting.

CONFIGURATION:
- Model: gemini-2.5-flash (latest available)
- Timeout: 5 seconds per API call
- Retry: Exponential backoff on 429 errors
- Max retries: 3 attempts
"""

import json
import logging
import time
from typing import Optional

from google import genai
from google.genai.errors import APIError

from app.services.ai.base_provider import (
    BaseRoadmapProvider,
    GeneratedRoadmap,
    GeneratedRoadmapNode,
)
from app.services.ai.mock_provider import MockRoadmapProvider

logger = logging.getLogger(__name__)

# Retry configuration
MAX_RETRIES = 3
INITIAL_RETRY_DELAY = 1  # seconds
MAX_RETRY_DELAY = 32  # seconds (2^5)
TIMEOUT_SECONDS = 5


class GeminiRoadmapProvider(BaseRoadmapProvider):
    """
    Generates learning roadmaps using Google Gemini API (new SDK).
    
    Uses the latest genai SDK with proper error handling and retry logic.
    Includes exponential backoff for rate limiting.
    """

    provider_name = "gemini"
    MODEL_NAME = "gemini-2.5-flash"  # Latest model (supports all features)

    def __init__(self, api_key: str):
        """
        Initialize Gemini provider with API key using new SDK.

        Args:
            api_key: Google Generative AI API key

        Raises:
            ValueError: If API key is missing or invalid
        """
        logger.warning("=" * 60)
        logger.warning("GeminiRoadmapProvider.__init__() called")
        logger.warning("=" * 60)
        logger.warning(f"USING GEMINI PROVIDER with API key starting: {api_key[:20]}")
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        logger.warning(f"API key present: {bool(api_key)}, length: {len(api_key)}")
        
        self.api_key = api_key
        self.fallback_provider = MockRoadmapProvider()

        try:
            # Initialize new SDK client
            logger.warning(f"Initializing Gemini client with model: {self.MODEL_NAME}")
            self.client = genai.Client(api_key=api_key)
            logger.warning(f"✓ Gemini client initialized successfully")
            logger.warning(f"✓ Using model: {self.MODEL_NAME}")
            logger.warning("=" * 60)
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {type(e).__name__}: {e}")
            logger.exception("Full traceback:")
            raise ValueError(f"Failed to initialize Gemini provider: {e}") from e

    def generate_roadmap(self, topic: str) -> GeneratedRoadmap:
        """
        Generate a learning roadmap for the given topic using Gemini.

        Includes retry logic with exponential backoff for rate limiting.

        Args:
            topic: The STEM topic to generate a roadmap for

        Returns:
            GeneratedRoadmap with nodes and connections

        Raises:
            ValueError: If generation fails after all retries
        """
        normalized_topic = topic.strip()
        logger.warning("=" * 60)
        logger.warning(f"generate_roadmap() called for topic: '{normalized_topic}'")
        logger.warning("=" * 60)

        attempt = 0
        retry_delay = INITIAL_RETRY_DELAY

        while attempt < MAX_RETRIES:
            attempt += 1
            logger.warning(f"Attempt {attempt}/{MAX_RETRIES}")

            try:
                roadmap = self._generate_with_gemini(normalized_topic)
                logger.warning(f"✓ Successfully generated roadmap on attempt {attempt}")
                logger.warning("=" * 60)
                return roadmap

            except APIError as api_error:
                error_code = getattr(api_error, 'status_code', None)
                error_msg = str(api_error)
                
                logger.exception(f"Gemini API error (attempt {attempt}): {error_code} - {error_msg}")
                logger.error(f"Full API error: {api_error}")

                # Handle rate limiting with exponential backoff
                if error_code == 429 or "quota" in error_msg.lower():
                    if attempt < MAX_RETRIES:
                        logger.warning(f"Rate limited (429). Retrying in {retry_delay}s...")
                        time.sleep(retry_delay)
                        retry_delay = min(retry_delay * 2, MAX_RETRY_DELAY)
                        continue
                    else:
                        logger.error(f"Rate limited after {MAX_RETRIES} attempts. Giving up.")
                        raise ValueError(f"Gemini API quota exceeded after {MAX_RETRIES} attempts") from api_error

                # For other API errors, raise immediately (no retry)
                logger.error(f"Non-recoverable API error: {error_code}")
                raise ValueError(f"Gemini API error: {error_msg}") from api_error

            except Exception as e:
                logger.exception(f"Unexpected error (attempt {attempt}): {type(e).__name__}: {e}")
                logger.error(f"Full exception: {e}")
                
                # Retry on any other error
                if attempt < MAX_RETRIES:
                    logger.warning(f"Retrying in {retry_delay}s...")
                    time.sleep(retry_delay)
                    retry_delay = min(retry_delay * 2, MAX_RETRY_DELAY)
                    continue
                else:
                    logger.error(f"Failed after {MAX_RETRIES} attempts. Raising exception.")
                    raise ValueError(f"Failed to generate roadmap for '{normalized_topic}': {e}") from e

        # Should not reach here, but just in case
        raise ValueError(f"Failed to generate roadmap for '{normalized_topic}' after {MAX_RETRIES} attempts")

    def _generate_with_gemini(self, topic: str) -> GeneratedRoadmap:
        """
        Internal method to call Gemini API and parse response.

        Args:
            topic: The topic to generate roadmap for

        Returns:
            GeneratedRoadmap object

        Raises:
            Exception: If API call or parsing fails
        """
        logger.warning(f"_generate_with_gemini() called for topic: '{topic}'")
        
        # Build prompt
        prompt = self._build_prompt(topic)
        logger.warning(f"Prompt built ({len(prompt)} chars)")

        # Call Gemini API
        logger.warning("GEMINI API CALL START")
        call_start = time.time()
        
        try:
            response = self.client.models.generate_content(
                model=self.MODEL_NAME,
                contents=prompt,
            )
            call_elapsed = time.time() - call_start
            logger.warning(f"GEMINI API CALL SUCCESS in {call_elapsed:.2f}s")
            
        except Exception as e:
            logger.exception("GEMINI API CALL FAILED")
            raise

        # Log raw response
        response_text = response.text if hasattr(response, 'text') else str(response)
        logger.warning(f"Raw response ({len(response_text)} chars):")
        logger.warning(f"First 1000 chars: {response_text[:1000]}")

        if not response_text:
            logger.error("Gemini returned empty response")
            raise ValueError("Gemini API returned empty response")

        # Extract JSON
        logger.warning("Extracting JSON from response...")
        try:
            roadmap_data = self._extract_json(response_text)
            logger.warning(f"Extracted JSON successfully")
        except Exception as e:
            logger.exception(f"Failed to extract JSON: {e}")
            raise

        # Parse roadmap
        logger.warning("Parsing roadmap structure...")
        try:
            roadmap = self._parse_roadmap(roadmap_data, topic)
            logger.warning(f"✓ Successfully parsed roadmap: {roadmap.topic}")
            return roadmap
        except Exception as e:
            logger.exception(f"Failed to parse roadmap: {e}")
            raise

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

Return ONLY a valid JSON object (no markdown, no explanation, no code fences) with this exact structure:
{{
  "topic": "exact topic name",
  "summary": "brief description of the learning path (1-2 sentences)",
  "nodes": [
    {{
      "title": "node title",
      "difficulty": "Beginner|Intermediate|Advanced",
      "description": "what students will learn (1-2 sentences)",
      "duration": "X weeks",
      "subtopics": [
        "subtopic 1",
        "subtopic 2",
        "subtopic 3",
        "subtopic 4"
      ]
    }}
  ]
}}

Important requirements:
1. Return ONLY valid JSON, no markdown, no code fences, no explanation
2. Include 5-7 nodes
3. Difficulty should progress: Beginner → Intermediate → Advanced
4. Duration should be realistic (1-4 weeks per node)
5. Descriptions should be concise and focused on "{topic}"
6. Each node title should be specific to "{topic}"
7. Each node must contain 4-8 meaningful subtopics
8. Nodes should form a logical learning progression
9. All content must be relevant to "{topic}"

Generate the roadmap now."""

    def _extract_json(self, text: str) -> dict:
        """
        Extract JSON from response text.

        Handles markdown code blocks and extra text.

        Args:
            text: Raw response text from Gemini

        Returns:
            Parsed JSON dictionary

        Raises:
            ValueError: If valid JSON cannot be extracted
        """
        # Remove markdown code fences if present
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.find("```", start)
            if end > start:
                text = text[start:end].strip()
                logger.warning("Removed ```json markdown fences")
        elif "```" in text:
            start = text.find("```") + 3
            end = text.find("```", start)
            if end > start:
                text = text[start:end].strip()
                logger.warning("Removed ``` markdown fences")

        # Try direct parsing
        try:
            data = json.loads(text)
            logger.warning("JSON parsed successfully")
            return data
        except json.JSONDecodeError:
            pass

        # Try to find JSON object boundaries
        start = text.find("{")
        end = text.rfind("}") + 1
        
        if start >= 0 and end > start:
            json_str = text[start:end]
            try:
                data = json.loads(json_str)
                logger.warning("JSON parsed from extracted boundaries")
                return data
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse extracted JSON: {e}")
                logger.error(f"Attempted JSON: {json_str[:500]}")
                raise ValueError(f"Invalid JSON extracted: {e}") from e

        raise ValueError("No valid JSON found in response")

    def _parse_roadmap(self, data: dict, original_topic: str) -> GeneratedRoadmap:
        """
        Parse and validate roadmap JSON.

        Args:
            data: Dictionary with roadmap data
            original_topic: Original topic string

        Returns:
            GeneratedRoadmap object

        Raises:
            ValueError: If data is invalid
        """
        try:
            # Validate required fields
            if not isinstance(data, dict):
                raise ValueError(f"Expected dict, got {type(data).__name__}")

            topic = data.get("topic", original_topic)
            if not isinstance(topic, str) or not topic.strip():
                logger.warning(f"Invalid topic field, using original: {original_topic}")
                topic = original_topic

            topic = topic.strip()
            logger.warning(f"Parsed topic: '{topic}'")

            summary = data.get("summary", "")
            if not isinstance(summary, str):
                summary = ""
            summary = summary.strip()
            logger.warning(f"Parsed summary: '{summary[:100]}...'")

            nodes_data = data.get("nodes", [])
            if not isinstance(nodes_data, list):
                raise ValueError(f"'nodes' must be a list, got {type(nodes_data).__name__}")

            if len(nodes_data) == 0:
                raise ValueError("'nodes' list is empty")

            if len(nodes_data) > 10:
                logger.warning(f"Too many nodes ({len(nodes_data)}), truncating to 10")
                nodes_data = nodes_data[:10]

            # Parse nodes
            nodes = []
            for i, node_data in enumerate(nodes_data):
                try:
                    node = self._parse_node(node_data, i)
                    nodes.append(node)
                    logger.warning(f"Parsed node {i+1}: '{node.title}' ({node.description[:50]}...)")
                except Exception as e:
                    logger.error(f"Failed to parse node {i}: {e}")
                    raise

            if not nodes:
                raise ValueError("No valid nodes parsed")

            logger.warning(f"✓ Roadmap validation complete: {len(nodes)} nodes")
            return GeneratedRoadmap(topic=topic, summary=summary, nodes=nodes)

        except Exception as e:
            logger.exception(f"Roadmap parsing failed: {e}")
            raise ValueError(f"Invalid roadmap data: {e}") from e

    def _parse_node(self, node_data: dict, index: int) -> GeneratedRoadmapNode:
        """
        Parse a single roadmap node.

        Args:
            node_data: Dictionary with node data
            index: Node index

        Returns:
            GeneratedRoadmapNode object

        Raises:
            ValueError: If required fields are missing
        """
        if not isinstance(node_data, dict):
            raise ValueError(f"Node must be dict, got {type(node_data).__name__}")

        title = node_data.get("title", "")
        if not isinstance(title, str) or not title.strip():
            raise ValueError(f"Node {index}: title is required and must be non-empty")

        title = title.strip()

        description = node_data.get("description", "")
        if not isinstance(description, str):
            description = ""
        description = description.strip()

        if not description:
            raise ValueError(f"Node {index} '{title}': description is required")

        # Validate lengths
        if len(title) > 100:
            logger.warning(f"Node {index}: title truncated to 100 chars")
            title = title[:100]

        if len(description) > 500:
            logger.warning(f"Node {index}: description truncated to 500 chars")
            description = description[:500]
            
        subtopics = node_data.get("subtopics", [])
        if not isinstance(subtopics, list):
            subtopics = []
        subtopics = [str(s).strip() for s in subtopics if str(s).strip()]
        
        if not subtopics:
            subtopics = ["Introduction", "Core Concepts", "Applications"]

        logger.warning(f"Node {index} validated: '{title}' with {len(subtopics)} subtopics")
        return GeneratedRoadmapNode(title=title, description=description, subtopics=subtopics)

    @staticmethod
    def validate_api_key(api_key: Optional[str]) -> bool:
        """
        Validate API key format.

        Args:
            api_key: The API key to validate

        Returns:
            True if valid, False otherwise
        """
        if not api_key:
            return False

        if not isinstance(api_key, str) or len(api_key) < 20:
            return False

        return True

    def health_check(self) -> dict:
        """
        Verify Gemini provider is operational.

        Returns:
            Dictionary with health check results
        """
        logger.warning("Running health check for Gemini provider")
        
        try:
            if not self.api_key:
                logger.error("Health check failed: API key not configured")
                return {
                    "status": "unhealthy",
                    "model": self.MODEL_NAME,
                    "api_key_configured": False,
                    "error": "API key not configured"
                }
            
            logger.warning("Testing API call...")
            call_start = time.time()
            
            response = self.client.models.generate_content(
                model=self.MODEL_NAME,
                contents="Return valid JSON: {\"test\": true}",
            )
            
            call_elapsed = time.time() - call_start
            
            if not response or not response.text:
                logger.error("Health check failed: Empty API response")
                return {
                    "status": "unhealthy",
                    "model": self.MODEL_NAME,
                    "api_key_configured": True,
                    "error": "API returned empty response"
                }
            
            logger.warning(f"✓ Health check passed ({call_elapsed:.2f}s)")
            return {
                "status": "healthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "response_time_ms": int(call_elapsed * 1000)
            }
            
        except Exception as e:
            logger.error(f"Health check failed: {type(e).__name__}: {e}")
            logger.exception("Full traceback:")
            return {
                "status": "unhealthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "error": str(e)
            }
