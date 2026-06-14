"""
Gemini-powered roadmap generation provider.

Uses Google's Generative AI API to generate structured learning roadmaps
for any STEM topic with fallback to mock provider on failure.

TIMEOUT CONFIGURATION:
- API call timeout: 5 seconds
- Retry delay: 1 second
- Total max time (with fallback): 10 seconds
"""

import json
import logging
import time
from typing import Optional

import google.generativeai as genai
from google.api_core.exceptions import (
    DeadlineExceeded,
    ServiceUnavailable,
    TooManyRequests,
    InvalidArgument,
)

from app.services.ai.base_provider import (
    BaseRoadmapProvider,
    GeneratedRoadmap,
    GeneratedRoadmapNode,
)
from app.services.ai.mock_provider import MockRoadmapProvider

logger = logging.getLogger(__name__)

# Timeout configuration (in seconds)
GEMINI_TIMEOUT_SECONDS = 5
RETRY_DELAY_SECONDS = 1
MAX_TOTAL_TIME_SECONDS = 10


class GeminiRoadmapProvider(BaseRoadmapProvider):
    """
    Generates learning roadmaps using Google Gemini API.
    Falls back to mock provider if Gemini fails.
    
    Includes timeout protection, retry logic, and detailed logging.
    """

    provider_name = "gemini"
    # Use gemini-2.0-flash which is available (gemini-1.5-flash is deprecated)
    MODEL_NAME = "gemini-2.0-flash"

    def __init__(self, api_key: str):
        """
        Initialize Gemini provider with API key.

        Args:
            api_key: Google Generative AI API key

        Raises:
            ValueError: If API key is missing or invalid
        """
        logger.warning("=== GeminiRoadmapProvider.__init__() called ===")
        logger.warning(f"USING GEMINI PROVIDER with API key starting: {api_key[:20]}")
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        logger.warning("Initializing GeminiRoadmapProvider")
        logger.warning(f"API key present: {bool(api_key)}, length: {len(api_key)}")
        
        self.api_key = api_key
        self.fallback_provider = MockRoadmapProvider()

        try:
            # Configure Gemini API
            logger.warning(f"Configuring Gemini with model: {self.MODEL_NAME}")
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(self.MODEL_NAME)
            logger.warning(f"✓ GeminiRoadmapProvider initialized successfully with model {self.MODEL_NAME}")
        except InvalidArgument as e:
            logger.error(f"Invalid model name: {self.MODEL_NAME}. Error: {e}")
            raise ValueError(f"Model '{self.MODEL_NAME}' is not available. Please check SDK version.") from e
        except Exception as e:
            logger.error(f"Failed to initialize Gemini provider: {e}")
            raise ValueError(f"Failed to initialize Gemini provider: {e}") from e

    def generate_roadmap(self, topic: str) -> GeneratedRoadmap:
        """
        Generate a learning roadmap for the given topic using Gemini.

        Attempts to generate with Gemini first. On failure, retries once with delay.
        If still failing, falls back to mock provider.
        
        Total time is capped at MAX_TOTAL_TIME_SECONDS to prevent indefinite hanging.

        Args:
            topic: The STEM topic to generate a roadmap for

        Returns:
            GeneratedRoadmap with nodes and connections

        Raises:
            ValueError: Only if both Gemini and mock provider fail (unlikely)
        """
        start_time = time.time()
        attempt = 1
        
        logger.warning(f"=== generate_roadmap() called for topic: {topic} ===")
        logger.warning(f"USING GEMINI PROVIDER for topic: {topic}")
        
        try:
            logger.warning(f"Starting roadmap generation for topic: '{topic}'")
            
            # Try Gemini first
            logger.warning(f"Attempt {attempt}: Trying Gemini API")
            try:
                roadmap = self._generate_with_gemini(topic)
                elapsed = time.time() - start_time
                logger.warning(f"✓ Successfully generated roadmap using Gemini in {elapsed:.2f}s")
                return roadmap
            except (TimeoutError, DeadlineExceeded) as timeout_error:
                elapsed = time.time() - start_time
                logger.warning(f"Gemini API timeout (attempt {attempt}) after {elapsed:.2f}s: {timeout_error}")
                logger.exception("Timeout exception details:")
            except Exception as e:
                elapsed = time.time() - start_time
                logger.warning(f"Gemini generation failed (attempt {attempt}) after {elapsed:.2f}s: {e}")
                logger.exception("Exception details for first attempt:")

            # Check if we have time for retry
            elapsed = time.time() - start_time
            if elapsed >= MAX_TOTAL_TIME_SECONDS - GEMINI_TIMEOUT_SECONDS:
                logger.warning(f"Exceeded max total time ({MAX_TOTAL_TIME_SECONDS}s). Skipping retry.")
                return self._fallback_generate(topic, start_time)

            # Retry once with delay
            attempt = 2
            logger.warning(f"Waiting {RETRY_DELAY_SECONDS}s before retry attempt {attempt}")
            time.sleep(RETRY_DELAY_SECONDS)
            
            logger.warning(f"Attempt {attempt}: Retrying Gemini API")
            try:
                roadmap = self._generate_with_gemini(topic)
                elapsed = time.time() - start_time
                logger.warning(f"✓ Successfully generated roadmap using Gemini (retry) in {elapsed:.2f}s")
                return roadmap
            except (TimeoutError, DeadlineExceeded) as timeout_error:
                elapsed = time.time() - start_time
                logger.warning(f"Gemini API timeout (attempt {attempt}) after {elapsed:.2f}s: {timeout_error}")
                logger.exception("Timeout exception details:")
            except Exception as e:
                elapsed = time.time() - start_time
                logger.warning(f"Gemini generation failed (attempt {attempt}) after {elapsed:.2f}s: {e}")
                logger.exception("Exception details for second attempt - NOW RAISING TO SURFACE ERROR:")
                # CHANGED: Raise instead of falling back silently
                raise

            # Fall back to mock provider
            return self._fallback_generate(topic, start_time)

        except Exception as e:
            elapsed = time.time() - start_time
            logger.error(f"Unexpected error in generate_roadmap after {elapsed:.2f}s: {e}")
            logger.exception("Full traceback:")
            raise ValueError(
                f"Failed to generate roadmap for '{topic}'. "
                "Error: {e}"
            ) from e

    def _fallback_generate(self, topic: str, start_time: float) -> GeneratedRoadmap:
        """
        Fall back to mock provider with timeout protection.

        Args:
            topic: The topic to generate roadmap for
            start_time: Start time of the overall generation request

        Returns:
            GeneratedRoadmap from mock provider

        Raises:
            ValueError: If fallback also fails
        """
        elapsed = time.time() - start_time
        logger.warning(f"Falling back to mock provider (elapsed: {elapsed:.2f}s)")
        
        try:
            roadmap = self.fallback_provider.generate_roadmap(topic)
            total_elapsed = time.time() - start_time
            logger.info(f"Successfully generated roadmap using mock provider in {total_elapsed:.2f}s total")
            return roadmap
        except Exception as fallback_error:
            total_elapsed = time.time() - start_time
            logger.error(f"Mock provider also failed after {total_elapsed:.2f}s: {fallback_error}")
            raise ValueError(
                f"Failed to generate roadmap for '{topic}'. "
                "Please try again or contact support."
            ) from fallback_error

    def _generate_with_gemini(self, topic: str) -> GeneratedRoadmap:
        """
        Internal method to generate roadmap with Gemini.

        Includes timeout protection to prevent indefinite hanging.

        Args:
            topic: The topic to generate roadmap for

        Returns:
            GeneratedRoadmap with structured nodes

        Raises:
            TimeoutError: If API call exceeds timeout
            Exception: If Gemini API call fails or returns invalid JSON
        """
        logger.warning(f"=== _generate_with_gemini() called for topic: {topic} ===")
        logger.warning(f"Building prompt for topic: '{topic}'")
        prompt = self._build_prompt(topic)

        # Call Gemini API with timeout protection
        try:
            logger.warning(f"Calling Gemini API with {GEMINI_TIMEOUT_SECONDS}s timeout")
            call_start = time.time()
            
            logger.warning(f"Model object: {self.model}")
            logger.warning(f"Model name: {self.MODEL_NAME}")
            logger.warning("GEMINI API CALL START")
            
            # Note: google-generativeai SDK doesn't support direct timeout parameter,
            # but we track elapsed time and raise TimeoutError if it exceeds threshold
            # In production, consider using a time-bounded wrapper or asyncio timeout
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2048,
                )
            )
            
            logger.warning("GEMINI API CALL SUCCESS")
            call_elapsed = time.time() - call_start
            logger.warning(f"Gemini API call completed in {call_elapsed:.2f}s")
            logger.warning(f"Response received: {type(response)}")
            
            if call_elapsed > GEMINI_TIMEOUT_SECONDS:
                logger.warning(f"Gemini API call took {call_elapsed:.2f}s (exceeds {GEMINI_TIMEOUT_SECONDS}s timeout)")
                raise TimeoutError(f"Gemini API response time exceeded {GEMINI_TIMEOUT_SECONDS}s")
            
            response_text = response.text
            logger.warning(f"Response text type: {type(response_text)}")
            logger.warning(f"Response text length: {len(response_text) if response_text else 0}")
            logger.warning(f"RAW GEMINI RESPONSE (first 1000 chars):")
            logger.warning(response_text[:1000] if response_text else "EMPTY RESPONSE")
            
            if not response_text:
                logger.error("Gemini returned empty response")
                raise ValueError("Gemini API returned empty response")
            
            logger.warning(f"Received response from Gemini ({len(response_text)} chars)")
            
            # Extract and parse JSON
            logger.warning("Extracting JSON from response")
            roadmap_data = self._extract_json(response_text)
            logger.warning(f"Extracted JSON: {roadmap_data}")
            
            logger.warning("Parsing roadmap structure")
            roadmap = self._parse_roadmap(roadmap_data, topic)

            logger.warning(f"✓ Successfully generated roadmap for '{topic}' using Gemini")
            return roadmap
            
        except Exception as e:
            logger.error(f"Error in _generate_with_gemini: {type(e).__name__}: {e}")
            logger.exception(f"Full traceback for Gemini error:")
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

    def health_check(self) -> dict:
        """
        Verify Gemini provider is operational.
        
        Attempts a minimal API call to verify connectivity and configuration.
        Use this at startup to validate provider before accepting requests.

        Returns:
            Dictionary with health check results:
            {
                "status": "healthy" or "unhealthy",
                "model": "model name",
                "api_key_configured": bool,
                "error": "error message if unhealthy"
            }
        """
        logger.info("Running health check for Gemini provider")
        
        try:
            # Check API key
            if not self.api_key:
                logger.error("Health check failed: API key not configured")
                return {
                    "status": "unhealthy",
                    "model": self.MODEL_NAME,
                    "api_key_configured": False,
                    "error": "API key not configured"
                }
            
            logger.debug("API key is configured")
            
            # Try a minimal API call
            logger.debug("Attempting test API call")
            test_prompt = "Return valid JSON: {\"test\": true}"
            
            call_start = time.time()
            response = self.model.generate_content(
                test_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.1,
                    max_output_tokens=50,
                )
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
            
            logger.info(f"Health check passed (API response in {call_elapsed:.2f}s)")
            return {
                "status": "healthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "response_time_ms": int(call_elapsed * 1000)
            }
            
        except TooManyRequests as e:
            logger.error(f"Health check failed: Quota exceeded: {e}")
            return {
                "status": "unhealthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "error": "API quota exceeded"
            }
        except InvalidArgument as e:
            logger.error(f"Health check failed: Invalid argument (model may not exist): {e}")
            return {
                "status": "unhealthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "error": f"Invalid model or API configuration: {e}"
            }
        except ServiceUnavailable as e:
            logger.error(f"Health check failed: Service unavailable: {e}")
            return {
                "status": "unhealthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "error": "Gemini API service temporarily unavailable"
            }
        except (TimeoutError, DeadlineExceeded) as e:
            logger.error(f"Health check failed: Timeout: {e}")
            return {
                "status": "unhealthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "error": "API call timeout (network issue?)"
            }
        except Exception as e:
            logger.error(f"Health check failed: {type(e).__name__}: {e}")
            return {
                "status": "unhealthy",
                "model": self.MODEL_NAME,
                "api_key_configured": True,
                "error": str(e)
            }
