"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import { CustomRoadmapNode } from "@/features/roadmap/components/custom-roadmap-node";
import type { RoadmapViewModel } from "@/features/roadmap/types/roadmap";

const nodeTypes = {
  roadmapNode: CustomRoadmapNode,
};

interface RoadmapGraphProps {
  roadmap: RoadmapViewModel;
}

export function RoadmapGraph({ roadmap }: RoadmapGraphProps) {
  return (
    <ReactFlowProvider>
      <div className="h-[540px] w-full overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-950/80">
        <ReactFlow
          fitView
          minZoom={0.4}
          maxZoom={1.6}
          nodes={roadmap.nodes}
          edges={roadmap.edges}
          nodeTypes={nodeTypes}
          panOnDrag
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          className="bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_35%),linear-gradient(180deg,_rgba(2,6,23,0.95),_rgba(15,23,42,0.98))]"
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap
            pannable
            zoomable
            nodeColor={() => "#34d399"}
            className="!bottom-4 !bg-slate-950/90"
          />
          <Controls className="!left-4 !top-4 !bg-slate-950/90 !text-white" showInteractive={false} />
          <Background color="#1e293b" gap={24} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
