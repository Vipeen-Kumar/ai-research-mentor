"use client";

import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";

import type { Edge, Node } from "@xyflow/react";

const nodes: Node[] = [
  {
    id: "topic",
    position: { x: 100, y: 30 },
    data: { label: "Topic Focus" },
    style: { background: "#1d4ed8", color: "#fff", borderRadius: 16, border: "1px solid #60a5fa", padding: 10 },
  },
  {
    id: "fundamentals",
    position: { x: 20, y: 150 },
    data: { label: "Foundations" },
    style: { background: "#0f172a", color: "#fff", borderRadius: 16, border: "1px solid #334155", padding: 10 },
  },
  {
    id: "practice",
    position: { x: 190, y: 150 },
    data: { label: "Practice" },
    style: { background: "#0f172a", color: "#fff", borderRadius: 16, border: "1px solid #334155", padding: 10 },
  },
  {
    id: "research",
    position: { x: 105, y: 270 },
    data: { label: "Research Depth" },
    style: { background: "#065f46", color: "#fff", borderRadius: 16, border: "1px solid #34d399", padding: 10 },
  },
];

const edges: Edge[] = [
  { id: "e1", source: "topic", target: "fundamentals", animated: true, style: { stroke: "#94a3b8" } },
  { id: "e2", source: "topic", target: "practice", animated: true, style: { stroke: "#94a3b8" } },
  { id: "e3", source: "fundamentals", target: "research", style: { stroke: "#34d399" } },
  { id: "e4", source: "practice", target: "research", style: { stroke: "#34d399" } },
];

export function RoadmapPreview() {
  return (
    <div className="glass-panel relative min-h-[420px] rounded-[32px] p-4">
      <div className="mb-4 flex items-start justify-between gap-4 px-2 pt-2">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Roadmap Canvas</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Future learning graph preview</h2>
        </div>
        <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
          React Flow Ready
        </div>
      </div>
      <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-800/80 bg-slate-950/80">
        <ReactFlow fitView nodes={nodes} edges={edges}>
          <MiniMap pannable zoomable nodeColor={() => "#38bdf8"} className="!bg-slate-900" />
          <Controls className="!bg-slate-900 !text-white" />
          <Background color="#1e293b" gap={24} />
        </ReactFlow>
      </div>
    </div>
  );
}
