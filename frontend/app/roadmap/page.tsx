import { Suspense } from "react";
import { RoadmapPage } from "@/features/roadmap/components/roadmap-page";

export const metadata = {
  title: "Roadmap | AI Research Mentor",
  description: "Generate an AI-powered research roadmap for any STEM topic.",
};

export default function RoadmapRoute() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={null}>
          <RoadmapPage />
        </Suspense>
      </div>
    </main>
  );
}

