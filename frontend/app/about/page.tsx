import Link from "next/link";
import { Sparkles, Users, BookOpen, Zap } from "lucide-react";

export const metadata = {
  title: "About | AI Research Mentor",
  description: "Learn about the AI Research Mentor platform — how it works, who built it, and why.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 mb-8">
          <Sparkles className="w-4 h-4" />
          Our Mission
        </div>
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
          Democratizing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400">
            STEM Research
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed md:text-xl mb-12 font-light">
          AI Research Mentor bridges the gap between curiosity and expertise —
          generating structured, visually navigable research roadmaps for any
          STEM topic in seconds.
        </p>
      </section>

      {/* Cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <AboutCard
            icon={<BookOpen className="w-6 h-6 text-cyan-400" />}
            title="What We Do"
            description="We use large language models to map any academic or engineering topic into a structured prerequisite graph — from beginner foundations to advanced cutting-edge research."
          />
          <AboutCard
            icon={<Zap className="w-6 h-6 text-purple-400" />}
            title="How It Works"
            description="Type a topic, hit Generate, and our FastAPI backend calls an AI model to produce an ordered node graph. React Flow renders it as an interactive, zoomable knowledge map."
          />
          <AboutCard
            icon={<Users className="w-6 h-6 text-emerald-400" />}
            title="Who It's For"
            description="Students, researchers, engineers, and self-learners who want a clear path through any technical domain — without spending hours surveying textbooks and papers."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
        <p className="text-slate-400 mb-8">Generate your first roadmap in under 30 seconds.</p>
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
        >
          <Sparkles className="w-4 h-4" />
          Generate a Roadmap
        </Link>
      </section>
    </div>
  );
}

function AboutCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
