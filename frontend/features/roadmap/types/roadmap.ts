import type { Edge, Node } from "@xyflow/react";

export interface GenerateRoadmapRequest {
  topic: string;
}

export interface RoadmapApiNode {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface RoadmapApiEdge {
  id: string;
  source: string;
  target: string;
}

export interface GenerateRoadmapResponse {
  roadmap_id?: string;
  topic: string;
  provider?: string;
  summary?: string;
  nodes: RoadmapApiNode[];
  edges: RoadmapApiEdge[];
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface RoadmapGraphNodeData extends Record<string, unknown> {
  title: string;
  description: string;
  difficulty: Difficulty;
  studyTime: number; // in weeks
  isCompleted: boolean;
}

export type RoadmapGraphNode = Node<RoadmapGraphNodeData, "roadmapNode">;
export type RoadmapGraphEdge = Edge;

export interface RoadmapStatistics {
  totalNodes: number;
  totalDuration: number; // in weeks
  beginnerCount: number;
  intermediateCount: number;
  advancedCount: number;
  completedCount: number;
}

export interface RoadmapViewModel {
  topic: string;
  nodeCount: number;
  nodes: RoadmapGraphNode[];
  edges: RoadmapGraphEdge[];
  statistics: RoadmapStatistics;
}

export interface RoadmapSummary {
  id: string;
  topic: string;
  created_at: string;
  node_count: number;
}

export type RoadmapHistoryResponse = RoadmapSummary[];

export interface RoadmapDetailResponse {
  id: string;
  topic: string;
  nodes: RoadmapApiNode[];
  edges: RoadmapApiEdge[];
}

