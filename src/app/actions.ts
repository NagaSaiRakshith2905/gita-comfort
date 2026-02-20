"use server";

import { getMessageForEmotion, isEmotion } from "@/lib/gita";

const emotionAliases = {
  motivation: "laziness",
} as const;

export async function getMessageAction(emotion: string) {
  const normalizedEmotion = emotion.toLowerCase();
  const resolvedEmotion =
    emotionAliases[normalizedEmotion as keyof typeof emotionAliases] ?? normalizedEmotion;

  if (!isEmotion(resolvedEmotion)) {
    throw new Error("Invalid emotion.");
  }

  return getMessageForEmotion(resolvedEmotion);
}