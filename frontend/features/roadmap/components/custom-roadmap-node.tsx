"use client";

import { useCallback, useEffect, useState } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { CheckCircle2, Clock } from "lucide-react";

import type {
  Difficulty,
  RoadmapGraphNode,
} from "@/features/roadmap/types/roadmap";

const difficultyClasses: Record<Difficulty, string> = {
  Beginner: "border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-200",
  Intermediate: "border-amber-500/50 bg-amber-500/20 text-amber-700 dark:border-amber-400/50 dark:bg-amber-500/15 dark:text-amber-200",
  Advanced: "border-rose-500/50 bg-rose-500/20 text-rose-700 dark:border-rose-400/50 dark:bg-rose-500/15 dark:text-rose-200",
};

const difficultyColors: Record<Difficulty, string> = {
  Beginner: "from-emerald-500/10 to-teal-500/10",
  Intermediate: "from-amber-500/10 to-orange-500/10",
  Advanced: "from-rose-500/10 to-red-500/10",
};

export function CustomRoadmapNode({
  data,
  selected,
}: NodeProps<RoadmapGraphNode>) {
  const [isCompleted, setIsCompleted] = useState(false);
  const { getNode, setCenter } = useReactFlow();

  // Load completion status on mount
  useEffect(() => {
    const roadmapId = (data as any).nodeId;
    const completedNodes = JSON.parse(
      localStorage.getItem("roadmapProgress") || "{}"
    );
    setIsCompleted(completedNodes[roadmapId] || data.isCompleted || false);
  }, [data]);

  const handleToggleComplete = useCallback(() => {
    const roadmapId = (data as any).nodeId;
    const completedNodes = JSON.parse(
      localStorage.getItem("roadmapProgress") || "{}"
    );
    completedNodes[roadmapId] = !isCompleted;
    localStorage.setItem("roadmapProgress", JSON.stringify(completedNodes));
    setIsCompleted(!isCompleted);
  }, [isCompleted, data]);

  const handleNodeClick = useCallback(() => {
    // Dispatch custom event that roadmap-graph will listen for
    const event = new CustomEvent("node-selected", {
      detail: {
        nodeId: (data as any).nodeId,
        title: data.title,
        difficulty: data.difficulty,
        estimatedDuration: data.studyTime,
        description: data.description,
      },
    });
    window.dispatchEvent(event);
  }, [data]);

  return (
    <div
      onClick={handleNodeClick}
      className={`relative w-[280px] rounded-[20px] border-2 transition-all duration-300 overflow-hidden shadow-lg cursor-pointer hover:-translate-y-2 hover:shadow-xl ${
        selected
          ? "ring-4 ring-sky-400 dark:ring-sky-500 border-sky-400 dark:border-sky-500"
          : ""
      } ${
        isCompleted
          ? "border-emerald-400/60 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:border-emerald-400/40 dark:from-emerald-500/10 dark:to-teal-500/10"
          : `border-slate-300/40 bg-gradient-to-br ${difficultyColors[data.difficulty]} dark:border-slate-700/60 dark:bg-slate-900/60`
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/0 dark:from-white/2 dark:to-transparent" />
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!h-3 !w-3 !border-2 !border-white !bg-sky-400 dark:!border-slate-900 dark:!bg-sky-300" 
      />
      
      <div className="relative p-5 space-y-4">
        {/* Header with title and difficulty badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-slate-500 dark:text-slate-400">
              {isCompleted ? "✓ Completed" : "Learning Step"}
            </p>
            <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white line-clamp-2">
              {data.title}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-all duration-300 ${difficultyClasses[data.difficulty]}`}
          >
            {data.difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs leading-5 text-slate-600 dark:text-slate-300 line-clamp-2">
          {data.description}
        </p>

        {/* Study time and completion button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium">{data.studyTime} weeks</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              isCompleted
                ? "bg-emerald-500/30 text-emerald-600 dark:text-emerald-300"
                : "bg-slate-200/50 text-slate-400 hover:bg-slate-300/50 dark:bg-slate-700/50 dark:text-slate-400 dark:hover:bg-slate-600/50"
            }`}
            title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Completion indicator overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/5 to-transparent pointer-events-none" />
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!h-3 !w-3 !border-2 !border-white !bg-emerald-400 dark:!border-slate-900 dark:!bg-emerald-300" 
      />
    </div>
  );
}