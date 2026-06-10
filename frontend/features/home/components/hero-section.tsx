"use client";

import { ArrowRight, BookOpenText, BrainCircuit, Microscope } from "lucide-react";

import { RoadmapPreview } from "@/features/home/components/roadmap-preview";
import { TopicInput } from "@/features/home/components/topic-input";

const featureCards = [
  {
    title: "Personalized STEM paths",
    description: "Prepare structured learning journeys from beginner foundations to research depth.",
    icon: BookOpenText,
  },
  {
    title: "Research-ready thinking",
    description: "Support long-form technical learning with future hooks for lessons, quizzes, and paper summaries.",
    icon: BrainCircuit,
  },
  {
    title: "Built for ambitious learners",
    description: "A clean architecture designed to grow into a full mentoring platform without rewrites.",
    icon: Microscope,
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/70 px-6 py-8 shadow-panel sm:px-8 lg:px-12 lg:py-12">
      <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-20" />
      <div className="absolute -left-20 top-20 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -right-16 top-8 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Foundation setup for an AI-powered STEM mentor
          </div>

          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-300">
              AI Research Mentor
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Learn difficult STEM topics with a roadmap built for modern research learners.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Start with a topic like Kalman Filter, Computer Vision, or Reinforcement Learning.
              This foundation is ready for personalized roadmaps, AI lessons, quizzes, and paper simplification in future steps.
            </p>
          </div>

          <TopicInput />

          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="glass-panel rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-emerald-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <ArrowRight className="h-4 w-4 text-amber-300" />
            Clean architecture now, AI orchestration later.
          </div>
        </div>

        <RoadmapPreview />
      </div>
    </section>
  );
}
