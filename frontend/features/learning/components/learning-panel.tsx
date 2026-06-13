"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, ChevronRight, ExternalLink, X } from "lucide-react";

import type { LearningContent } from "@/features/learning/types/learning";

interface LearningPanelProps {
  isOpen: boolean;
  content: LearningContent | null;
  onClose: () => void;
}

/**
 * Learning Panel Component
 * Displays detailed learning content for a selected roadmap node
 */
export function LearningPanel({ isOpen, content, onClose }: LearningPanelProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Trigger animation on open
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // Handle backdrop click (outside panel)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !isAnimating) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "from-emerald-500/20 to-teal-500/20 border-emerald-500/30";
      case "Intermediate":
        return "from-amber-500/20 to-orange-500/20 border-amber-500/30";
      case "Advanced":
        return "from-rose-500/20 to-red-500/20 border-rose-500/30";
      default:
        return "from-slate-500/20 to-slate-500/20 border-slate-500/30";
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/20 text-emerald-700 border-emerald-500/50 dark:text-emerald-200 dark:border-emerald-400/50";
      case "Intermediate":
        return "bg-amber-500/20 text-amber-700 border-amber-500/50 dark:text-amber-200 dark:border-amber-400/50";
      case "Advanced":
        return "bg-rose-500/20 text-rose-700 border-rose-500/50 dark:text-rose-200 dark:border-rose-400/50";
      default:
        return "bg-slate-500/20 text-slate-700 border-slate-500/50";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "book":
        return "📚";
      case "article":
        return "📰";
      case "video":
        return "🎥";
      case "course":
        return "🎓";
      case "paper":
        return "📄";
      default:
        return "🔗";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isAnimating && isOpen ? "opacity-30" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800/80 shadow-2xl transition-all duration-300 z-50 flex flex-col overflow-hidden ${
          isAnimating && isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!content ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Select a Topic
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Click on any node in the roadmap to explore its learning details,
              concepts, and recommended resources.
            </p>
            <button
              onClick={handleClose}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Close Panel
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span
                    className={`inline-block border px-3 py-1 rounded-full text-xs font-bold mb-3 ${getDifficultyBadgeColor(
                      content.difficulty,
                    )}`}
                  >
                    {content.difficulty}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {content.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    ⏱️ Estimated {content.estimatedDuration} weeks
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                  title="Close panel (ESC)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {content.description}
                  </p>
                </div>

                {/* Why This Matters */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Why This Matters
                  </h3>
                  <div
                    className={`rounded-lg border-2 bg-gradient-to-br ${getDifficultyColor(
                      content.difficulty,
                    )} p-4`}
                  >
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {content.whyMatters}
                    </p>
                  </div>
                </div>

                {/* Key Concepts */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Key Concepts
                  </h3>
                  <div className="space-y-3">
                    {content.keyConcepts.map((concept, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                          {concept.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {concept.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Resources */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Recommended Resources
                  </h3>
                  <div className="space-y-2">
                    {content.recommendedResources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url || "#"}
                        className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 p-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group"
                        target={resource.url ? "_blank" : undefined}
                        rel={resource.url ? "noopener noreferrer" : undefined}
                      >
                        <span className="text-lg flex-shrink-0 mt-0.5">
                          {getResourceIcon(resource.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                            {resource.title}
                          </p>
                          {resource.author && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              by {resource.author}
                            </p>
                          )}
                        </div>
                        {resource.url && (
                          <ExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mt-0.5" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Related Topics */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Related Topics
                  </h3>
                  <div className="space-y-2">
                    {content.relatedTopics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 p-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                            {topic.title}
                          </p>
                          <span
                            className={`inline-block text-xs font-bold mt-1 px-2 py-0.5 rounded-full border ${getDifficultyBadgeColor(
                              topic.difficulty,
                            )}`}
                          >
                            {topic.difficulty}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spacer for scrolling */}
                <div className="h-4" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                💡 Press <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono">ESC</kbd> to close
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
