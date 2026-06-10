"use client";

import { type FormEvent } from "react";
import { AlertCircle, LoaderCircle, Sparkles, Waypoints } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoadmapGraph } from "@/features/roadmap/components/roadmap-graph";
import { useRoadmap } from "@/features/roadmap/hooks/use-roadmap";

export function RoadmapPage() {
  const { topic, setTopic, isLoading, error, roadmap, generate } = useRoadmap();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await generate();
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/70 px-6 py-8 shadow-panel sm:px-8 lg:px-12 lg:py-12">
      <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-20" />
      <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative space-y-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Backend-connected roadmap generation
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-300">
                AI Research Mentor
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Generate a STEM learning path and explore it as an interactive roadmap graph.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Enter a topic like Kalman Filter or Computer Vision to fetch a structured learning roadmap from the backend API and visualize it with React Flow.
              </p>
            </div>

            <div className="glass-panel rounded-[28px] p-5">
              <p className="text-sm font-medium text-slate-200">What this page does</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  Calls `POST /api/v1/roadmaps/generate`
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  Stores and returns roadmap graph data from the backend
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  Renders zoomable, pannable nodes with difficulty badges
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-[28px] p-4 sm:p-5">
          <label htmlFor="topic" className="mb-3 block text-sm font-medium text-slate-200">
            Enter a STEM topic
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="topic"
              name="topic"
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Try: Kalman Filter, Computer Vision, Reinforcement Learning"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="sm:min-w-[220px]">
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            The graph will appear below after the API responds.
          </p>
        </form>

        {error ? (
          <div className="glass-panel flex items-start gap-3 rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-5 text-rose-100">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Roadmap request failed</p>
              <p className="mt-1 text-sm text-rose-100/90">{error}</p>
            </div>
          </div>
        ) : null}

        <div className="glass-panel rounded-[32px] p-4 sm:p-5">
          {roadmap ? (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 border-b border-slate-800/80 px-1 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                    Learning Path Generated
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{roadmap.topic}</h2>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2">
                    Topic: {roadmap.topic}
                  </div>
                  <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2">
                    Nodes: {roadmap.nodeCount}
                  </div>
                </div>
              </div>

              <RoadmapGraph roadmap={roadmap} />
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-700/80 bg-slate-950/60 px-6 text-center">
              {isLoading ? (
                <>
                  <LoaderCircle className="h-10 w-10 animate-spin text-emerald-300" />
                  <h2 className="mt-5 text-2xl font-semibold text-white">Generating your roadmap</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                    We&apos;re calling the backend roadmap API and preparing your learning graph.
                  </p>
                </>
              ) : (
                <>
                  <Waypoints className="h-10 w-10 text-sky-300" />
                  <h2 className="mt-5 text-2xl font-semibold text-white">No roadmap generated yet</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                    Enter a STEM topic above and generate a roadmap to see an interactive learning path with zoom, pan, and difficulty-coded nodes.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
