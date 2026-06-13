"use client";

import { useEffect, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { BookOpen, Zap, Trophy } from "lucide-react";

import { CustomRoadmapNode } from "@/features/roadmap/components/custom-roadmap-node";
import { LearningPanel } from "@/features/learning/components/learning-panel";
import { getLearningContent } from "@/features/learning/data/learning-content";
import type { RoadmapViewModel } from "@/features/roadmap/types/roadmap";
import type { LearningContent } from "@/features/learning/types/learning";

const nodeTypes = {
  roadmapNode: CustomRoadmapNode,
};

interface RoadmapGraphProps {
  roadmap: RoadmapViewModel;
}

function RoadmapGraphContent({ roadmap }: RoadmapGraphProps) {
  const { fitView } = useReactFlow();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLearningPanelOpen, setIsLearningPanelOpen] = useState(false);
  const [learningContent, setLearningContent] = useState<LearningContent | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Calculate progress on mount and when nodes change
  useEffect(() => {
    const completedNodes = JSON.parse(
      localStorage.getItem("roadmapProgress") || "{}"
    );
    const completed = Object.values(completedNodes).filter(Boolean).length;
    const percentage = Math.round(
      (completed / Math.max(roadmap.statistics.totalNodes, 1)) * 100
    );
    setProgressPercentage(percentage);
    
    // Fit view on load
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  }, [roadmap, fitView]);

  const updateProgressBar = () => {
    const completedNodes = JSON.parse(
      localStorage.getItem("roadmapProgress") || "{}"
    );
    const completed = Object.values(completedNodes).filter(Boolean).length;
    const percentage = Math.round(
      (completed / Math.max(roadmap.statistics.totalNodes, 1)) * 100
    );
    setProgressPercentage(percentage);
  };

  // Listen for storage changes
  useEffect(() => {
    window.addEventListener("storage", updateProgressBar);
    return () => window.removeEventListener("storage", updateProgressBar);
  }, [roadmap.statistics.totalNodes]);

  // Listen for node selection events
  useEffect(() => {
    const handleNodeSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { nodeId, title, difficulty, estimatedDuration, description } = customEvent.detail;
      
      setSelectedNodeId(nodeId);
      const content = getLearningContent(
        nodeId,
        title,
        difficulty,
        estimatedDuration,
        description,
      );
      setLearningContent(content);
      setIsLearningPanelOpen(true);
    };

    window.addEventListener("node-selected", handleNodeSelected);
    return () => window.removeEventListener("node-selected", handleNodeSelected);
  }, []);

  const handleCloseLearningPanel = () => {
    setIsLearningPanelOpen(false);
    setSelectedNodeId(null);
  };

  return (
    <div className="space-y-5">
      {/* Statistics Panel */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {/* Total Nodes */}
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 p-4 transition-all duration-300 dark:border-slate-700/60 dark:from-sky-500/10 dark:to-blue-500/10 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-sky-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Total Topics
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {roadmap.statistics.totalNodes}
              </p>
            </div>
            <BookOpen className="h-6 w-6 text-sky-500 opacity-60" />
          </div>
        </div>

        {/* Study Duration */}
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 transition-all duration-300 dark:border-slate-700/60 dark:from-emerald-500/10 dark:to-teal-500/10 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Est. Duration
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {roadmap.statistics.totalDuration}w
              </p>
            </div>
            <Zap className="h-6 w-6 text-emerald-500 opacity-60" />
          </div>
        </div>

        {/* Beginner Count */}
        <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-green-50/50 p-4 transition-all duration-300 dark:border-emerald-400/30 dark:from-emerald-500/10 dark:to-green-500/10 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Beginner
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {roadmap.statistics.beginnerCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 dark:bg-emerald-500/15" />
          </div>
        </div>

        {/* Intermediate Count */}
        <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-4 transition-all duration-300 dark:border-amber-400/30 dark:from-amber-500/10 dark:to-orange-500/10 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Intermediate
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-100">
                {roadmap.statistics.intermediateCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 dark:bg-amber-500/15" />
          </div>
        </div>

        {/* Advanced Count */}
        <div className="rounded-lg border border-rose-500/30 bg-gradient-to-br from-rose-50/50 to-red-50/50 p-4 transition-all duration-300 dark:border-rose-400/30 dark:from-rose-500/10 dark:to-red-500/10 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-rose-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                Advanced
              </p>
              <p className="mt-1 text-2xl font-bold text-rose-900 dark:text-rose-100">
                {roadmap.statistics.advancedCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-500/20 dark:bg-rose-500/15" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-all duration-300 dark:border-slate-700/60 dark:bg-slate-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-500" />
            <p className="font-semibold text-slate-900 dark:text-white">
              Your Progress
            </p>
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {progressPercentage}%
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden dark:bg-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 transition-all duration-500 ease-out dark:from-emerald-400 dark:to-teal-400"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {roadmap.statistics.completedCount} of {roadmap.statistics.totalNodes} topics completed
        </p>
      </div>

      {/* Graph Container */}
      <div className="h-[720px] w-full overflow-hidden rounded-[20px] relative z-0">
        <ReactFlow
          fitView
          minZoom={0.3}
          maxZoom={2}
          nodes={roadmap.nodes.map((node) => ({
            ...node,
            selected: node.id === selectedNodeId,
          }))}
          edges={roadmap.edges}
          nodeTypes={nodeTypes}
          panOnDrag
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick
          nodesDraggable={true}
          elementsSelectable={true}
          colorMode="system"
          proOptions={{ hideAttribution: true }}
        >
          <Background 
            gap={32} 
            color="#1e293b"
          />
          <Controls
            className="!right-4 !top-4 !rounded-xl !border-2 !border-slate-300 !bg-white/90 dark:!border-slate-700 dark:!bg-slate-900/90 dark:!text-white shadow-lg [&_button]:transition-all [&_button]:duration-300 [&_button]:hover:bg-slate-100 dark:[&_button]:hover:bg-slate-800 relative z-20"
            showInteractive={true}
          />
          <MiniMap
            pannable
            zoomable
            className="!bottom-4 !left-4 !rounded-xl !border-2 !border-slate-300 !bg-white/90 dark:!border-slate-700 dark:!bg-slate-900/90 relative z-20"
          />
        </ReactFlow>
      </div>

      {/* Learning Panel */}
      <LearningPanel
        isOpen={isLearningPanelOpen}
        content={learningContent}
        onClose={handleCloseLearningPanel}
      />

      {/* Tips */}
      <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-sky-50 to-emerald-50 p-4 transition-all duration-300 dark:border-slate-700/60 dark:from-sky-500/10 dark:to-emerald-500/10">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          💡 <span className="font-medium">Tip:</span> Click any node to explore its learning details. Click the checkmark to mark topics as completed. Your progress is saved locally.
        </p>
      </div>
    </div>
  );
}

export function RoadmapGraph({ roadmap }: RoadmapGraphProps) {
  return (
    <ReactFlowProvider>
      <RoadmapGraphContent roadmap={roadmap} />
    </ReactFlowProvider>
  );
}