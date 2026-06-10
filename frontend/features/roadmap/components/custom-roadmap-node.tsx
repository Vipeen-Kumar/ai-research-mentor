"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import type {
  Difficulty,
  RoadmapGraphNode,
} from "@/features/roadmap/types/roadmap";

const difficultyClasses: Record<Difficulty, string> = {
  Beginner: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  Intermediate: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  Advanced: "border-rose-300/30 bg-rose-300/10 text-rose-100",
};

export function CustomRoadmapNode({
  data,
}: NodeProps<RoadmapGraphNode>) {
  return (
    <div className="w-[240px] rounded-[24px] border border-slate-700/80 bg-slate-950/95 p-4 shadow-[0_18px_60px_rgba(2,6,23,0.35)]">
      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-slate-950 !bg-sky-300" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Learning Step</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{data.title}</h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyClasses[data.difficulty]}`}
        >
          {data.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{data.description}</p>
      <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-slate-950 !bg-emerald-300" />
    </div>
  );
}
