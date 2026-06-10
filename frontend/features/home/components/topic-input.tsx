"use client";

import { type FormEvent } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTopicInput } from "@/features/home/hooks/use-topic-input";

export function TopicInput() {
  const { topic, setTopic, status, submitTopic } = useTopicInput();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitTopic();
  };

  return (
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
        />
        <Button type="submit">
          <Sparkles className="h-4 w-4" />
          Generate Roadmap
        </Button>
      </div>
      <p className="mt-3 text-sm text-slate-400">{status}</p>
    </form>
  );
}
