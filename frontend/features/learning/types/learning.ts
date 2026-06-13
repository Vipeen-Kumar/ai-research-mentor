/**
 * Learning Panel Types
 * Defines the structure for learning content displayed in the learning panel
 */

export interface KeyConcept {
  title: string;
  description: string;
}

export interface RecommendedResource {
  title: string;
  type: "book" | "article" | "video" | "course" | "paper";
  author?: string;
  url?: string;
}

export interface RelatedTopic {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface LearningContent {
  nodeId: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration: number; // in weeks
  description: string;
  whyMatters: string;
  keyConcepts: KeyConcept[];
  recommendedResources: RecommendedResource[];
  relatedTopics: RelatedTopic[];
}

/**
 * Generic placeholder content for topics not yet curated
 */
export function createPlaceholderContent(
  nodeId: string,
  title: string,
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  estimatedDuration: number,
  description: string,
): LearningContent {
  return {
    nodeId,
    title,
    difficulty,
    estimatedDuration,
    description,
    whyMatters: `Understanding ${title} is crucial for developing a strong foundation in this subject. This topic forms the basis for more advanced concepts and practical applications.`,
    keyConcepts: [
      {
        title: "Core Principles",
        description: `The fundamental principles and theories underlying ${title}`,
      },
      {
        title: "Practical Applications",
        description: `Real-world applications and use cases of ${title}`,
      },
      {
        title: "Advanced Techniques",
        description: `Advanced methods and optimizations in ${title}`,
      },
    ],
    recommendedResources: [
      {
        title: `Introduction to ${title}`,
        type: "article",
        author: "Educational Resources",
      },
      {
        title: `${title} Deep Dive`,
        type: "course",
        author: "Learning Platform",
      },
      {
        title: `${title} Research Paper`,
        type: "paper",
        author: "Academic Community",
      },
    ],
    relatedTopics: [
      {
        id: "related-1",
        title: "Related Concept 1",
        difficulty: "Beginner",
      },
      {
        id: "related-2",
        title: "Related Concept 2",
        difficulty: difficulty,
      },
    ],
  };
}
