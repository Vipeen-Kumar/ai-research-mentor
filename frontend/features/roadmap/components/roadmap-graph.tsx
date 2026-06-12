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
      <div className="h-[720px] w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950">
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
          colorMode="system"
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap
            pannable
            zoomable
            className="!bottom-4 !rounded-xl !border !border-slate-200 dark:!border-slate-800 dark:!bg-slate-900/90"
          />
          <Controls 
            className="!left-4 !top-4 !rounded-xl !border !border-slate-200 dark:!border-slate-800 dark:!bg-slate-900/90 dark:!text-white" 
            showInteractive={false} 
          />
          <Background gap={24} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}