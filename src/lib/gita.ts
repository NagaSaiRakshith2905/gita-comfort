import fs from "node:fs";
import path from "node:path";
import { comfortMessages } from "@/lib/comfort-messages";

export const EMOTIONS = [
  "happy",
  "sad",
  "laziness",
  "protection",
  "anger",
  "peace",
  "loneliness",
  "anxious",
] as const;

export type Emotion = (typeof EMOTIONS)[number];

type Verse = {
  chapter: number;
  shlokaNumber: number;
  shloka: string;
  simpleExplanation: string;
  briefTakeaway: string;
  emotion: string;
  keywords: string[];
};

type EmotionProfile = {
  include: string[];
  fallbackChapter: number;
};

const profiles: Record<Emotion, EmotionProfile> = {
  happy: {
    include: [
      "joy",
      "happiness",
      "prosperity",
      "devotion",
      "gratitude",
      "equanimity",
      "peace",
      "steady",
      "blessed",
      "surrender",
    ],
    fallbackChapter: 12,
  },
  sad: {
    include: [
      "grief",
      "sorrow",
      "despair",
      "soul",
      "eternal",
      "steady",
      "courage",
      "detachment",
      "self",
      "endure",
    ],
    fallbackChapter: 2,
  },
  laziness: {
    include: [
      "duty",
      "action",
      "karma",
      "work",
      "discipline",
      "perform",
      "effort",
      "steadfast",
      "self-control",
      "yoga",
    ],
    fallbackChapter: 3,
  },
  protection: {
    include: [
      "protect",
      "refuge",
      "surrender",
      "fearless",
      "lord",
      "divine",
      "grace",
      "support",
      "safety",
      "faith",
    ],
    fallbackChapter: 18,
  },
  anger: {
    include: [
      "anger",
      "desire",
      "delusion",
      "calm",
      "self-control",
      "mind",
      "peace",
      "restraint",
      "wisdom",
      "equanimity",
    ],
    fallbackChapter: 2,
  },
  peace: {
    include: [
      "peace",
      "calm",
      "tranquil",
      "equanimity",
      "steady",
      "meditation",
      "self",
      "silence",
      "serene",
      "yoga",
    ],
    fallbackChapter: 6,
  },
  loneliness: {
    include: [
      "all beings",
      "self",
      "divine",
      "friend",
      "devotion",
      "lord",
      "compassion",
      "unity",
      "heart",
      "presence",
    ],
    fallbackChapter: 9,
  },
  anxious: {
    include: [
      "fear",
      "doubt",
      "mind",
      "control",
      "steady",
      "faith",
      "surrender",
      "clarity",
      "yoga",
      "equanimity",
    ],
    fallbackChapter: 6,
  },
};

let cachedVerses: Verse[] | null = null;

function loadVerses(): Verse[] {
  if (cachedVerses) return cachedVerses;

  const candidatePaths = [
    path.join(process.cwd(), "public", "data-set", "bhagavad_gita_700_english_v3.json"),
  ];

  const filePath = candidatePaths.find((candidate) => fs.existsSync(candidate));
  if (!filePath) {
    throw new Error(
      "Bhagavad Gita dataset not found. Checked: " + candidatePaths.join(", "),
    );
  }

  const raw = fs.readFileSync(filePath, "utf8");
  cachedVerses = JSON.parse(raw) as Verse[];
  return cachedVerses;
}

function scoreVerse(verse: Verse, emotion: Emotion): number {
  const profile = profiles[emotion];
  const haystack = [
    verse.shloka,
    verse.simpleExplanation,
    verse.briefTakeaway,
    verse.emotion,
    verse.keywords.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  for (const keyword of profile.include) {
    if (haystack.includes(keyword.toLowerCase())) {
      score += 6;
    }
  }

  // Favor concise, easier-to-read verses.
  if (verse.shloka.length <= 260) score += 2;

  // Strong boost when the dataset emotion exactly matches the requested emotion.
  if (verse.emotion.toLowerCase() === emotion) score += 8;

  // Chapter-level guidance fallback alignment.
  if (verse.chapter === profile.fallbackChapter) score += 3;

  return score;
}

function pickFromTop<T>(items: T[], topN: number): T {
  const window = items.slice(0, Math.min(topN, items.length));
  return window[Math.floor(Math.random() * window.length)] ?? items[0];
}

export function getMessageForEmotion(emotion: Emotion) {
  const verses = loadVerses();
  const emotionMatched = verses.filter((verse) => verse.emotion.toLowerCase() === emotion);
  const candidateVerses = emotionMatched.length > 0 ? emotionMatched : verses;

  const scored = candidateVerses
    .map((verse) => ({ verse, score: scoreVerse(verse, emotion) }))
    .sort((a, b) => b.score - a.score);

  const picked = pickFromTop(scored, 25).verse;
  const messages = comfortMessages[emotion];
  const pickedComfortMessage = pickFromTop(
    messages,
    messages.length,
  );

  return {
    emotion,
    comfortMessage: pickedComfortMessage,
    reference: `Chapter ${picked.chapter}, Shloka ${picked.shlokaNumber}`,
    verse: picked.shloka,
    simpleExplanation: picked.simpleExplanation,
    briefTakeaway: picked.briefTakeaway,
    keywords: picked.keywords,
  };
}

export function isEmotion(value: string): value is Emotion {
  return (EMOTIONS as readonly string[]).includes(value);
}
