import { Suspense } from "react";
import { RoadmapHistoryPage } from "@/features/roadmap/components/roadmap-history-page";

export const metadata = {
  title: "Roadmaps | AI Research Mentor",
  description: "Browse and reopen your previously generated research roadmaps.",
};

export default function RoadmapsRoute() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={null}>
          <RoadmapHistoryPage />
        </Suspense>
      </div>
    </main>
  );
}
