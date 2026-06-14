from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(slots=True)
class GeneratedRoadmapNode:
    title: str
    description: str
    subtopics: list[str]


@dataclass(slots=True)
class GeneratedRoadmap:
    topic: str
    summary: str
    nodes: list[GeneratedRoadmapNode]


class BaseRoadmapProvider(ABC):
    provider_name = "base"

    @abstractmethod
    def generate_roadmap(self, topic: str) -> GeneratedRoadmap:
        raise NotImplementedError
