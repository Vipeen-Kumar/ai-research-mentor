"use client";

import { useState } from "react";

const defaultMessage =
  "Roadmap generation is not implemented yet. This input is wired for the future API flow.";

export function useTopicInput() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState(defaultMessage);

  const submitTopic = () => {
    if (!topic.trim()) {
      setStatus("Enter a STEM topic to prepare for roadmap generation.");
      return;
    }

    setStatus(`"${topic.trim()}" is captured. AI roadmap generation will be added in the next step.`);
  };

  return {
    topic,
    setTopic,
    status,
    submitTopic,
  };
}
