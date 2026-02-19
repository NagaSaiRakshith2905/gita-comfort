import { NextRequest, NextResponse } from "next/server";
import { EMOTIONS, getMessageForEmotion, isEmotion } from "@/lib/gita";

export async function GET(request: NextRequest) {
  const emotionParam = request.nextUrl.searchParams.get("emotion")?.toLowerCase();

  if (!emotionParam || !isEmotion(emotionParam)) {
    return NextResponse.json(
      {
        error: "Invalid emotion.",
        allowedEmotions: EMOTIONS,
      },
      { status: 400 },
    );
  }

  const payload = getMessageForEmotion(emotionParam);
  return NextResponse.json(payload, { status: 200 });
}
