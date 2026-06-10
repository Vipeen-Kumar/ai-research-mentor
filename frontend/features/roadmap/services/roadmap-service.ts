import type {
  Difficulty,
  GenerateRoadmapRequest,
  GenerateRoadmapResponse,
  RoadmapApiNode,
  RoadmapGraphEdge,
  RoadmapGraphNode,
  RoadmapViewModel,
} from "@/features/roadmap/types/roadmap";
import { apiPost } from "@/lib/api/client";

const HORIZONTAL_GAP = 280;
const VERTICAL_GAP = 150;

export async function generateRoadmap(
  payload: GenerateRoadmapRequest,
): Promise<GenerateRoadmapResponse> {
  return apiPost<GenerateRoadmapResponse, GenerateRoadmapRequest>(
    "/api/v1/roadmaps/generate",
    payload,
  );
}

export function buildRoadmapViewModel(
  response: GenerateRoadmapResponse,
): RoadmapViewModel {
  return {
    topic: response.topic,
    nodeCount: response.nodes.length,
    nodes: response.nodes.map((node, index) => buildGraphNode(node, index, response.nodes.length)),
    edges: response.edges.map((edge) => ({
      ...edge,
      animated: true,
      style: { stroke: "#38bdf8", strokeWidth: 1.5 },
    })),
  };
}

function buildGraphNode(
  node: RoadmapApiNode,
  index: number,
  totalNodes: number,
): RoadmapGraphNode {
  const column = index % 2;
  const row = Math.floor(index / 2);

  return {
    id: node.id,
    type: "roadmapNode",
    position: {
      x: column * HORIZONTAL_GAP,
      y: row * VERTICAL_GAP + (column === 1 ? 70 : 0),
    },
    data: {
      title: node.title,
      description: node.description,
      difficulty: getDifficulty(index, totalNodes),
    },
    draggable: false,
  };
}

function getDifficulty(index: number, totalNodes: number): Difficulty {
  const progress = (index + 1) / Math.max(totalNodes, 1);

  if (progress <= 0.34) {
    return "Beginner";
  }

  if (progress <= 0.67) {
    return "Intermediate";
  }

  return "Advanced";
}
