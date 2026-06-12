"use client";

import { useState } from "react";

import { buildRoadmapViewModel, generateRoadmap } from "@/features/roadmap/services/roadmap-service";
import { getRoadmapById } from "@/features/roadmap/services/roadmap-history-service";
import type { RoadmapViewModel } from "@/features/roadmap/types/roadmap";

interface UseRoadmapResult {
  topic: string;
  setTopic: (topic: string) => void;
  isLoading: boolean;
  error: string | null;
  roadmap: RoadmapViewModel | null;
  generate: () => Promise<void>;
  fetchRoadmap: (id: string) => Promise<void>;
}

export function useRoadmap(): UseRoadmapResult {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapViewModel | null>(null);

  const generate = async () => {
    const normalizedTopic = topic.trim();

    if (!normalizedTopic) {
      setError("Enter a STEM topic to generate a learning roadmap.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateRoadmap({ topic: normalizedTopic });
      setRoadmap(buildRoadmapViewModel(response));
    } catch {
      setRoadmap(null);
      setError("We couldn't generate a roadmap right now. Check that the backend API is running and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoadmap = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRoadmapById(id);
      setRoadmap(buildRoadmapViewModel(response as any));
      setTopic(response.topic);
    } catch {
      setRoadmap(null);
      setError("We couldn't load the roadmap right now. Check that the backend API is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    topic,
    setTopic,
    isLoading,
    error,
    roadmap,
    generate,
    fetchRoadmap,
  };
}
