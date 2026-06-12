import type {
  RoadmapDetailResponse,
  RoadmapHistoryResponse,
} from "@/features/roadmap/types/roadmap";
import { apiGet } from "@/lib/api/client";

export async function getRoadmaps(): Promise<RoadmapHistoryResponse> {
  return apiGet<RoadmapHistoryResponse>("/api/v1/roadmaps");
}

export async function getRoadmapById(id: string): Promise<RoadmapDetailResponse> {
  return apiGet<RoadmapDetailResponse>(`/api/v1/roadmaps/${id}`);
}
