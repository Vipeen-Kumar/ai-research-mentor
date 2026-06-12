"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Calendar, ExternalLink, LoaderCircle, Network, Search, Sparkles, Waypoints } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRoadmaps } from "@/features/roadmap/services/roadmap-history-service";
import type { RoadmapSummary } from "@/features/roadmap/types/roadmap";

export function RoadmapHistoryPage() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRoadmaps();
      setRoadmaps(data);
    } catch {
      setError("Failed to retrieve roadmap history. Please check your backend connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredRoadmaps = roadmaps.filter((roadmap) =>
    roadmap.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 px-6 py-8 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/70 sm:px-8 lg:px-12 lg:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl transition-opacity duration-300 dark:bg-emerald-400/10" />
      <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl transition-opacity duration-300 dark:bg-sky-400/10" />

      <div className="relative space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-700 transition-colors duration-300 dark:text-sky-100">
            <span className="h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
            Roadmap History
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold leading-tight text-slate-900 transition-colors duration-300 dark:text-white sm:text-5xl">
                My Saved Roadmaps
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 transition-colors duration-300 dark:text-slate-300">
                Browse and reopen your previously generated research paths.
              </p>
            </div>
            {!isLoading && roadmaps.length > 0 && (
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white transition-colors duration-300 dark:bg-slate-950/70"
                />
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white/50 px-6 text-center dark:border-slate-800/80 dark:bg-slate-950/60">
            <LoaderCircle className="h-10 w-10 animate-spin text-emerald-500 dark:text-emerald-300" />
            <h2 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
              Loading your history
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Retrieving your saved roadmap graphs from the database...
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-6 text-center text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100">
            <AlertCircle className="h-12 w-12 text-rose-500" />
            <h2 className="mt-4 text-2xl font-bold">Failed to load history</h2>
            <p className="mt-2 max-w-md text-sm opacity-90">{error}</p>
            <button
              onClick={fetchHistory}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-transparent px-6 font-semibold text-rose-700 transition hover:bg-rose-500/20 dark:border-rose-400/30 dark:text-rose-200 dark:hover:bg-rose-400/20"
            >
              Try Again
            </button>
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/50 px-6 text-center dark:border-slate-800/80 dark:bg-slate-950/60">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/5">
              <Waypoints className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
              No Roadmaps Found
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
              You haven&apos;t generated any STEM roadmaps yet. Begin your learning journey by generating your first graph!
            </p>
            <Button
              onClick={() => router.push("/roadmap")}
              className="mt-6 font-semibold"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate First Roadmap
            </Button>
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/50 px-6 text-center dark:border-slate-800/80 dark:bg-slate-950/60">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              No matching roadmaps
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No saved roadmaps matched your query &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRoadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-sky-400/50"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="line-clamp-2 text-xl font-semibold text-slate-900 group-hover:text-sky-500 dark:text-white dark:group-hover:text-sky-400">
                      {roadmap.topic}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>Generated {formatDate(roadmap.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>{roadmap.node_count} nodes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                  <button
                    onClick={() => router.push(`/roadmap?id=${roadmap.id}`)}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    Open
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
