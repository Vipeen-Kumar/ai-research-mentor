"use client";

import { type FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, LoaderCircle, Sparkles, Waypoints } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoadmapGraph } from "@/features/roadmap/components/roadmap-graph";
import { useRoadmap } from "@/features/roadmap/hooks/use-roadmap";

export function RoadmapPage() {
  const { topic, setTopic, isLoading, error, roadmap, generate, fetchRoadmap } = useRoadmap();
  const searchParams = useSearchParams();

  // Effect 1: On mount, read the URL topic or ID param and populate state/fetch.
  useEffect(() => {
    const urlTopic = searchParams.get("topic")?.trim();
    const urlId = searchParams.get("id")?.trim();
    if (urlId) {
      fetchRoadmap(urlId);
    } else if (urlTopic) {
      setTopic(urlTopic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect 2: Once topic state reflects the URL value, trigger generation.
  // Guards ensure this only fires for the initial URL-driven load, not on every
  // manual topic change made by the user after the page has loaded.
  useEffect(() => {
    const urlTopic = searchParams.get("topic")?.trim();
    const urlId = searchParams.get("id")?.trim();
    if (urlId) return; // Do NOT generate if we are loading an existing roadmap

    if (urlTopic && topic === urlTopic && !roadmap && !isLoading) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await generate();
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 px-6 py-8 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/70 sm:px-8 lg:px-12 lg:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl transition-opacity duration-300 dark:bg-emerald-400/10" />
      <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl transition-opacity duration-300 dark:bg-sky-400/10" />

      <div className="relative space-y-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-700 transition-colors duration-300 dark:text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            Backend-connected roadmap generation
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500 transition-colors duration-300 dark:text-slate-400">
                AI Research Mentor
              </p>
              <h1 className="max-w-4xl text-5xl font-bold leading-tight text-slate-900 transition-colors duration-300 dark:text-white sm:text-6xl lg:text-7xl">
                Learn Any STEM Topic Through AI-Generated Research Roadmaps
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 transition-colors duration-300 dark:text-slate-300 sm:text-lg">
                Enter a topic like Kalman Filter or Computer Vision to fetch a
                structured learning roadmap from the backend API and visualize
                it with React Flow.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50/50 p-6 backdrop-blur-md transition-all duration-300 dark:border-slate-800/60 dark:bg-slate-900/50">
              <p className="text-sm font-medium text-slate-600 transition-colors duration-300 dark:text-slate-400">
                Popular Topics
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  "Kalman Filter",
                  "Computer Vision",
                  "Reinforcement Learning",
                  "Signal Processing",
                  "Machine Learning",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition-all duration-300 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-4 transition-colors duration-300 dark:from-emerald-500/5 dark:to-sky-500/5">
                <p className="text-sm text-slate-700 transition-colors duration-300 dark:text-slate-300">
                  Generate personalized prerequisite maps and explore STEM
                  topics visually.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-slate-50/50 p-4 backdrop-blur-md transition-all duration-300 dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-5"
        >
          <label
            htmlFor="topic"
            className="mb-3 block text-sm font-medium text-slate-700 transition-colors duration-300 dark:text-slate-200"
          >
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
              className="bg-white transition-colors duration-300 dark:bg-slate-950"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="transition-all duration-300 sm:min-w-[220px]"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </div>
          <p className="mt-3 text-sm text-slate-500 transition-colors duration-300 dark:text-slate-400">
            The graph will appear below after the API responds.
          </p>
        </form>

        {error ? (
          <div className="flex items-start gap-3 rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-5 text-rose-700 transition-colors duration-300 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Roadmap request failed</p>
              <p className="mt-1 text-sm opacity-90">{error}</p>
            </div>
          </div>
        ) : null}

        <div className="rounded-[32px] border border-slate-200 bg-slate-50/50 p-4 backdrop-blur-md transition-all duration-300 dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-5">
          {roadmap ? (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-1 pb-4 transition-colors duration-300 dark:border-slate-800/80 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 transition-colors duration-300 dark:text-slate-400">
                    Learning Path Generated
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900 transition-colors duration-300 dark:text-white">
                    {roadmap.topic}
                  </h2>
                </div>
                <div className="flex flex-col gap-2 text-sm text-slate-600 transition-colors duration-300 dark:text-slate-300 sm:flex-row sm:items-center sm:gap-3">
                  <div className="rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2">
                    Topic: {roadmap.topic}
                  </div>
                  <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                    Nodes: {roadmap.nodeCount}
                  </div>
                  <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2">
                    ~{roadmap.statistics.totalDuration} weeks
                  </div>
                </div>
              </div>

              <RoadmapGraph roadmap={roadmap} />
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/50 px-6 text-center transition-all duration-300 dark:border-slate-700/80 dark:bg-slate-950/60">
              {isLoading ? (
                <>
                  <LoaderCircle className="h-10 w-10 animate-spin text-emerald-500 transition-colors duration-300 dark:text-emerald-300" />
                  <h2 className="mt-5 text-2xl font-semibold text-slate-900 transition-colors duration-300 dark:text-white">
                    Generating your roadmap
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 transition-colors duration-300 dark:text-slate-300">
                    We&apos;re calling the backend roadmap API and preparing
                    your learning graph.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10 transition-colors duration-300 dark:bg-sky-500/5">
                    <Waypoints className="h-10 w-10 text-sky-600 transition-colors duration-300 dark:text-sky-400" />
                  </div>
                  <h2 className="mt-5 text-3xl font-bold text-slate-900 transition-colors duration-300 dark:text-white">
                    Start Your Learning Journey
                  </h2>

                  <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 transition-colors duration-300 dark:text-slate-300">
                    Enter any STEM topic and let AI generate a personalized
                    roadmap from fundamentals to advanced concepts.
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