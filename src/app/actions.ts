"use server";

import { getMessageForEmotion, isEmotion } from "@/lib/gita";

export async function getMessageAction(emotion: string) {
  const normalizedEmotion = emotion.toLowerCase();

  if (!isEmotion(normalizedEmotion)) {
    throw new Error("Invalid emotion.");
  }

  return getMessageForEmotion(normalizedEmotion);
}