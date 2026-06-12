"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import type {
  Difficulty,
  RoadmapGraphNode,
} from "@/features/roadmap/types/roadmap";

const difficultyClasses: Record<Difficulty, string> = {
  Beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/30 dark:text-emerald-300",
  Intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-300/30 dark:text-amber-300",
  Advanced: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-300/30 dark:text-rose-300",
};

export function CustomRoadmapNode({
  data,
}: NodeProps<RoadmapGraphNode>) {
  return (
    <div className="w-[280px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)] dark:hover:border-emerald-400/40">
      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-white !bg-sky-400 dark:!border-slate-900 dark:!bg-sky-300" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500 transition-colors duration-300 dark:text-slate-400">Learning Step</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 transition-colors duration-300 dark:text-white">{data.title}</h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-300 ${difficultyClasses[data.difficulty]}`}
        >
          {data.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 transition-colors duration-300 dark:text-slate-300">{data.description}</p>
      <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-white !bg-emerald-400 dark:!border-slate-900 dark:!bg-emerald-300" />
    </div>
  );
}