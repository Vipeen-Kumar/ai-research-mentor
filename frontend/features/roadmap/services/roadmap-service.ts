import dagre from "dagre";
import type { Node } from "@xyflow/react";

import type {
  Difficulty,
  GenerateRoadmapRequest,
  GenerateRoadmapResponse,
  RoadmapApiEdge,
  RoadmapApiNode,
  RoadmapGraphEdge,
  RoadmapGraphNode,
  RoadmapStatistics,
  RoadmapViewModel,
} from "@/features/roadmap/types/roadmap";
import { apiPost } from "@/lib/api/client";

const NODE_WIDTH = 280;
const NODE_HEIGHT = 280;

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
  const nodes = response.nodes.map((node, index) => 
    buildGraphNode(node, index, response.nodes.length)
  );
  
  // Apply dagre layout
  const layoutedNodes = applyDagreLayout(nodes, response.edges);

  const statistics = calculateStatistics(layoutedNodes);

  return {
    topic: response.topic,
    nodeCount: response.nodes.length,
    nodes: layoutedNodes,
    edges: response.edges.map((edge) => ({
      ...edge,
      animated: true,
      style: { 
        stroke: "#38bdf8", 
        strokeWidth: 2,
        strokeDasharray: "5,5",
      },
    })),
    statistics,
  };
}

function applyDagreLayout(
  nodes: RoadmapGraphNode[],
  edges: RoadmapApiEdge[],
): RoadmapGraphNode[] {
  const g = new dagre.graphlib.Graph({ compound: true });
  g.setGraph({ rankdir: "TB", ranksep: 200, nodesep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Run layout
  dagre.layout(g);

  // Apply positions
  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}

function buildGraphNode(
  node: RoadmapApiNode,
  index: number,
  totalNodes: number,
): RoadmapGraphNode {
  // Load completion status from localStorage
  const completedNodes = JSON.parse(
    typeof window !== "undefined" 
      ? localStorage.getItem("roadmapProgress") || "{}"
      : "{}"
  );

  return {
    id: node.id,
    type: "roadmapNode",
    position: { x: 0, y: 0 }, // Will be set by dagre
    data: {
      nodeId: node.id,
      title: node.title,
      description: node.description,
      subtopics: node.subtopics || [],
      difficulty: getDifficulty(index, totalNodes),
      studyTime: estimateStudyTime(getDifficulty(index, totalNodes)),
      isCompleted: completedNodes[node.id] || false,
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

function estimateStudyTime(difficulty: Difficulty): number {
  const studyTimes: Record<Difficulty, number> = {
    Beginner: 2,
    Intermediate: 3,
    Advanced: 4,
  };
  return studyTimes[difficulty];
}

function calculateStatistics(nodes: RoadmapGraphNode[]): RoadmapStatistics {
  const completedNodes = typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem("roadmapProgress") || "{}")
    : {};

  const beginnerCount = nodes.filter(
    (n) => n.data.difficulty === "Beginner"
  ).length;
  const intermediateCount = nodes.filter(
    (n) => n.data.difficulty === "Intermediate"
  ).length;
  const advancedCount = nodes.filter(
    (n) => n.data.difficulty === "Advanced"
  ).length;
  const totalDuration = nodes.reduce(
    (sum, node) => sum + node.data.studyTime,
    0
  );
  const completedCount = Object.values(completedNodes).filter(Boolean).length;

  return {
    totalNodes: nodes.length,
    totalDuration,
    beginnerCount,
    intermediateCount,
    advancedCount,
    completedCount,
  };
}
