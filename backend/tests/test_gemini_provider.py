"""
Tests for Gemini-powered roadmap provider.

Tests cover:
- JSON parsing and validation
- Fallback to mock provider on failure
- Error handling and retries
- Input validation
"""

import json
import pytest
from unittest.mock import Mock, patch, MagicMock

from app.services.ai.gemini_provider import GeminiRoadmapProvider
from app.services.ai.base_provider import GeneratedRoadmapNode


class TestGeminiProviderInitialization:
    """Test Gemini provider initialization and configuration."""

    def test_init_with_valid_api_key(self):
        """Should initialize successfully with valid API key."""
        # Use a test API key format (not a real key)
        api_key = "test_api_key_valid_format_at_least_20_chars_long"
        
        with patch("app.services.ai.gemini_provider.genai.configure"):
            provider = GeminiRoadmapProvider(api_key=api_key)
            assert provider.api_key == api_key
            assert provider.provider_name == "gemini"

    def test_init_without_api_key(self):
        """Should raise ValueError if API key is not provided."""
        with pytest.raises(ValueError, match="GEMINI_API_KEY"):
            GeminiRoadmapProvider(api_key=None)

    def test_init_with_empty_api_key(self):
        """Should raise ValueError if API key is empty string."""
        with pytest.raises(ValueError, match="GEMINI_API_KEY"):
            GeminiRoadmapProvider(api_key="")

    def test_validate_api_key(self):
        """Should validate API key format."""
        # Valid keys (format check only, not real keys)
        assert GeminiRoadmapProvider.validate_api_key(
            "test_key_valid_format_at_least_20_chars_long_xyz"
        )

        # Invalid keys
        assert not GeminiRoadmapProvider.validate_api_key(None)
        assert not GeminiRoadmapProvider.validate_api_key("")
        assert not GeminiRoadmapProvider.validate_api_key("short")


class TestJSONExtraction:
    """Test JSON extraction from Gemini responses."""

    def setup_method(self):
        """Set up test provider."""
        with patch("app.services.ai.gemini_provider.genai.configure"):
            self.provider = GeminiRoadmapProvider(api_key="test_key_12345")

    def test_extract_plain_json(self):
        """Should extract plain JSON without markdown."""
        json_str = '{"topic": "Test", "summary": "Summary", "nodes": []}'
        result = self.provider._extract_json(json_str)
        assert result["topic"] == "Test"
        assert result["summary"] == "Summary"

    def test_extract_json_with_markdown_block(self):
        """Should extract JSON from markdown code block."""
        response = """Here's your roadmap:
        
```json
{"topic": "Machine Learning", "summary": "ML path", "nodes": []}
```

Good luck!"""
        result = self.provider._extract_json(response)
        assert result["topic"] == "Machine Learning"

    def test_extract_json_with_plain_code_block(self):
        """Should extract JSON from plain code block."""
        response = """The roadmap is:

```
{"topic": "Python", "summary": "Python learning", "nodes": []}
```"""
        result = self.provider._extract_json(response)
        assert result["topic"] == "Python"

    def test_extract_json_from_text_with_extra_content(self):
        """Should extract JSON even with surrounding text."""
        response = '''The best roadmap is: {"topic": "Data Science", "summary": "DS path", "nodes": []} Hope this helps!'''
        result = self.provider._extract_json(response)
        assert result["topic"] == "Data Science"

    def test_extract_json_invalid_format(self):
        """Should raise ValueError for invalid JSON."""
        with pytest.raises(ValueError, match="No valid JSON found"):
            self.provider._extract_json("{invalid json")

    def test_extract_json_no_json_found(self):
        """Should raise ValueError if no JSON found."""
        with pytest.raises(ValueError, match="No valid JSON found"):
            self.provider._extract_json("No JSON here at all")


class TestNodeParsing:
    """Test parsing of roadmap nodes."""

    def setup_method(self):
        """Set up test provider."""
        with patch("app.services.ai.gemini_provider.genai.configure"):
            self.provider = GeminiRoadmapProvider(api_key="test_key_12345")

    def test_parse_valid_node(self):
        """Should parse valid node data."""
        node_data = {
            "title": "Linear Algebra",
            "description": "Learn vectors and matrices",
            "difficulty": "Beginner",
            "duration": "2 weeks",
        }
        node = self.provider._parse_node(node_data, 0)
        assert isinstance(node, GeneratedRoadmapNode)
        assert node.title == "Linear Algebra"
        assert node.description == "Learn vectors and matrices"

    def test_parse_node_missing_title(self):
        """Should raise ValueError if title is missing."""
        node_data = {"description": "Description only"}
        with pytest.raises(ValueError, match="title is required"):
            self.provider._parse_node(node_data, 0)

    def test_parse_node_missing_description(self):
        """Should raise ValueError if description is missing."""
        node_data = {"title": "Title only"}
        with pytest.raises(ValueError, match="missing description"):
            self.provider._parse_node(node_data, 0)

    def test_parse_node_empty_title(self):
        """Should raise ValueError if title is empty."""
        node_data = {"title": "   ", "description": "Description"}
        with pytest.raises(ValueError, match="cannot be empty"):
            self.provider._parse_node(node_data, 0)

    def test_parse_node_title_truncation(self):
        """Should truncate long titles."""
        node_data = {
            "title": "A" * 150,
            "description": "Description",
        }
        with patch("app.services.ai.gemini_provider.logger") as mock_logger:
            node = self.provider._parse_node(node_data, 0)
            assert len(node.title) == 100
            mock_logger.warning.assert_called()

    def test_parse_node_description_truncation(self):
        """Should truncate long descriptions."""
        node_data = {
            "title": "Title",
            "description": "A" * 600,
        }
        with patch("app.services.ai.gemini_provider.logger") as mock_logger:
            node = self.provider._parse_node(node_data, 0)
            assert len(node.description) == 500
            mock_logger.warning.assert_called()


class TestRoadmapParsing:
    """Test parsing of complete roadmap."""

    def setup_method(self):
        """Set up test provider."""
        with patch("app.services.ai.gemini_provider.genai.configure"):
            self.provider = GeminiRoadmapProvider(api_key="test_key_12345")

    def test_parse_valid_roadmap(self):
        """Should parse valid roadmap data."""
        data = {
            "topic": "Kalman Filter",
            "summary": "Learn state estimation",
            "nodes": [
                {
                    "title": "Linear Algebra",
                    "description": "Learn matrices",
                },
                {
                    "title": "Probability",
                    "description": "Learn distributions",
                },
            ],
        }
        roadmap = self.provider._parse_roadmap(data, "Kalman Filter")
        assert roadmap.topic == "Kalman Filter"
        assert len(roadmap.nodes) == 2
        assert roadmap.nodes[0].title == "Linear Algebra"

    def test_parse_roadmap_missing_nodes(self):
        """Should raise ValueError if nodes is missing or empty."""
        data = {"topic": "Test", "summary": "Test", "nodes": []}
        with pytest.raises(ValueError, match="non-empty list"):
            self.provider._parse_roadmap(data, "Test")

    def test_parse_roadmap_invalid_nodes_type(self):
        """Should raise ValueError if nodes is not a list."""
        data = {"topic": "Test", "summary": "Test", "nodes": "not a list"}
        with pytest.raises(ValueError, match="non-empty list"):
            self.provider._parse_roadmap(data, "Test")

    def test_parse_roadmap_truncates_large_node_lists(self):
        """Should truncate roadmaps with >10 nodes."""
        nodes = [
            {"title": f"Node {i}", "description": f"Description {i}"}
            for i in range(15)
        ]
        data = {
            "topic": "Test",
            "summary": "Test",
            "nodes": nodes,
        }
        with patch("app.services.ai.gemini_provider.logger") as mock_logger:
            roadmap = self.provider._parse_roadmap(data, "Test")
            assert len(roadmap.nodes) == 10
            mock_logger.warning.assert_called()


class TestFallbackBehavior:
    """Test fallback to mock provider on failure."""

    def setup_method(self):
        """Set up test provider."""
        with patch("app.services.ai.gemini_provider.genai.configure"):
            self.provider = GeminiRoadmapProvider(api_key="test_key_12345")

    @patch("app.services.ai.gemini_provider.genai.GenerativeModel")
    def test_fallback_on_api_error(self, mock_model_class):
        """Should fall back to mock provider when API fails."""
        mock_model = MagicMock()
        mock_model_class.return_value = mock_model
        mock_model.generate_content.side_effect = Exception("API Error")
        
        self.provider.model = mock_model
        
        # Should not raise, should fall back to mock provider
        roadmap = self.provider.generate_roadmap("Test Topic")
        assert roadmap.topic == "Test Topic"
        assert len(roadmap.nodes) > 0

    @patch("app.services.ai.gemini_provider.genai.GenerativeModel")
    def test_retry_once_then_fallback(self, mock_model_class):
        """Should retry once before falling back to mock."""
        mock_model = MagicMock()
        mock_model_class.return_value = mock_model
        mock_model.generate_content.side_effect = Exception("API Error")
        
        self.provider.model = mock_model
        
        with patch("app.services.ai.gemini_provider.logger") as mock_logger:
            roadmap = self.provider.generate_roadmap("Kalman Filter")
            
            # Should log retry and fallback warnings
            assert mock_logger.warning.call_count >= 2
            assert roadmap is not None

    @patch("app.services.ai.gemini_provider.genai.GenerativeModel")
    def test_invalid_json_response_fallback(self, mock_model_class):
        """Should fall back when Gemini returns invalid JSON."""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "Not valid JSON at all"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        
        self.provider.model = mock_model
        
        with patch("app.services.ai.gemini_provider.logger"):
            roadmap = self.provider.generate_roadmap("Test")
            assert roadmap is not None
            assert roadmap.topic == "Test"


class TestPromptBuilding:
    """Test prompt engineering."""

    def setup_method(self):
        """Set up test provider."""
        with patch("app.services.ai.gemini_provider.genai.configure"):
            self.provider = GeminiRoadmapProvider(api_key="test_key_12345")

    def test_prompt_includes_topic(self):
        """Should include the topic in prompt."""
        prompt = self.provider._build_prompt("Machine Learning")
        assert "Machine Learning" in prompt

    def test_prompt_requests_json(self):
        """Should request JSON format in prompt."""
        prompt = self.provider._build_prompt("Test")
        assert "JSON" in prompt or "json" in prompt

    def test_prompt_specifies_node_count(self):
        """Should specify expected node count."""
        prompt = self.provider._build_prompt("Test")
        assert "5" in prompt or "7" in prompt  # 5-7 nodes

    def test_prompt_mentions_difficulty_levels(self):
        """Should mention difficulty levels."""
        prompt = self.provider._build_prompt("Test")
        assert "Beginner" in prompt or "Intermediate" in prompt or "Advanced" in prompt


class TestErrorHandling:
    """Test error handling and user-friendly messages."""

    def setup_method(self):
        """Set up test provider."""
        with patch("app.services.ai.gemini_provider.genai.configure"):
            self.provider = GeminiRoadmapProvider(api_key="test_key_12345")

    @patch("app.services.ai.gemini_provider.MockRoadmapProvider")
    def test_user_friendly_error_message(self, mock_mock_provider):
        """Should provide user-friendly error when all methods fail."""
        mock_mock_provider.return_value.generate_roadmap.side_effect = Exception(
            "Mock failed"
        )
        
        with patch("app.services.ai.gemini_provider.genai.GenerativeModel") as mock_model:
            mock_response = MagicMock()
            mock_response.text = "Invalid"
            mock_instance = MagicMock()
            mock_instance.generate_content.return_value = mock_response
            mock_model.return_value = mock_instance
            
            self.provider.model = mock_instance
            self.provider.fallback_provider = mock_mock_provider.return_value
            
            with pytest.raises(ValueError) as exc_info:
                self.provider.generate_roadmap("Test")
            
            assert "contact support" in str(exc_info.value).lower()


class TestEndToEnd:
    """End-to-end integration tests."""

    @patch("app.services.ai.gemini_provider.genai.GenerativeModel")
    @patch("app.services.ai.gemini_provider.genai.configure")
    def test_successful_generation(self, mock_configure, mock_model_class):
        """Should successfully generate roadmap from API response."""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = json.dumps({
            "topic": "Test Topic",
            "summary": "A test roadmap",
            "nodes": [
                {"title": "Basics", "description": "Learn the basics"},
                {"title": "Advanced", "description": "Learn advanced concepts"},
            ],
        })
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        
        provider = GeminiRoadmapProvider(api_key="test_key_12345")
        roadmap = provider.generate_roadmap("Test Topic")
        
        assert roadmap.topic == "Test Topic"
        assert len(roadmap.nodes) == 2
        assert provider.provider_name == "gemini"
