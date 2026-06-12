from pydantic import BaseModel, Field


class RoadmapGenerateRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=255,
        examples=["Kalman Filter"],
        description="STEM topic for which a learning roadmap should be generated.",
    )


class RoadmapNodeResponse(BaseModel):
    id: str = Field(..., description="Unique roadmap node identifier.")
    title: str = Field(..., description="Roadmap milestone title.")
    description: str = Field(..., description="Short explanation of why the milestone matters.")
    order: int = Field(..., description="Sequential order of the learning step.")


class RoadmapEdgeResponse(BaseModel):
    id: str = Field(..., description="Unique edge identifier.")
    source: str = Field(..., description="Source node identifier.")
    target: str = Field(..., description="Target node identifier.")


class RoadmapGenerateResponse(BaseModel):
    roadmap_id: str = Field(..., description="Persisted roadmap identifier.")
    topic: str = Field(..., description="Topic used for roadmap generation.")
    provider: str = Field(..., description="Configured AI provider abstraction used to generate the roadmap.")
    summary: str = Field(..., description="Short overview of the roadmap structure.")
    nodes: list[RoadmapNodeResponse]
    edges: list[RoadmapEdgeResponse]

    model_config = {"json_schema_extra": {"example": {
        "roadmap_id": "7cdd18a8-10de-49eb-b79a-f2058f526df4",
        "topic": "Kalman Filter",
        "provider": "mock",
        "summary": "A staged path from math foundations to recursive state estimation.",
        "nodes": [
            {
                "id": "fb6efad3-bebe-460d-ab93-d4c63994cb95",
                "title": "Linear Algebra",
                "description": "Review vectors, matrices, eigenvalues, and linear transformations.",
                "order": 1,
            },
            {
                "id": "6a1b6620-8610-4169-973e-f97e957269b8",
                "title": "Probability",
                "description": "Understand random variables, Gaussian distributions, and covariance.",
                "order": 2,
            },
        ],
        "edges": [
            {
                "id": "fb6efad3-bebe-460d-ab93-d4c63994cb95->6a1b6620-8610-4169-973e-f97e957269b8",
                "source": "fb6efad3-bebe-460d-ab93-d4c63994cb95",
                "target": "6a1b6620-8610-4169-973e-f97e957269b8",
            }
        ],
    }}}


from datetime import datetime

class RoadmapSummaryResponse(BaseModel):
    id: str = Field(..., description="Unique roadmap identifier.")
    topic: str = Field(..., description="Topic used for roadmap generation.")
    created_at: datetime = Field(..., description="Timestamp of when the roadmap was created.")
    node_count: int = Field(..., description="Number of milestones in the roadmap.")

    model_config = {"from_attributes": True}


class RoadmapDetailResponse(BaseModel):
    id: str = Field(..., description="Unique roadmap identifier.")
    topic: str = Field(..., description="Topic used for roadmap generation.")
    nodes: list[RoadmapNodeResponse]
    edges: list[RoadmapEdgeResponse]

    model_config = {"from_attributes": True}

