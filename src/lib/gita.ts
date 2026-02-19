import fs from "node:fs";
import path from "node:path";

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
  briefExplanation: string;
  emotion: string;
  keywords: string[];
};

type EmotionProfile = {
  comfortMessage: string;
  include: string[];
  fallbackChapter: number;
};

const profiles: Record<Emotion, EmotionProfile> = {
  happy: {
    comfortMessage:
      "Joy becomes deeper when it is grounded in gratitude, balance, and humility.",
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
    comfortMessage:
      "Your pain is seen. The Gita reminds us that sorrow can be transformed through wisdom and right action.",
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
    comfortMessage:
      "Even a small sincere step in action is powerful. Start with one disciplined action now.",
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
    comfortMessage:
      "You are not alone in your struggle. Trust, surrender, and inner strength offer protection.",
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
    comfortMessage:
      "Anger loses its force when awareness, restraint, and clarity return.",
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
    comfortMessage:
      "Peace grows when the mind is steady, desires are moderated, and the heart rests in the Divine.",
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
    comfortMessage:
      "You are deeply connected to the Divine and to all beings, even when you feel isolated.",
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
    comfortMessage:
      "Bring your attention back to the present duty. Clarity and trust reduce anxiety.",
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
    path.join(process.cwd(), "data-set", "bhagavad_gita_700_english_v2.json"),
    path.join(process.cwd(), "data-set", "bhagavad_gita_700_english.json"),
    path.join(process.cwd(), "public", "data-set", "bhagavad_gita_700_english_v2.json"),
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
    verse.briefExplanation,
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

  // Gentle boost when our dataset's own emotional tag aligns.
  if (emotion === "peace" && verse.emotion.toLowerCase().includes("peace")) score += 4;
  if (emotion === "sad" && verse.emotion.toLowerCase().includes("distress")) score += 4;
  if (emotion === "anger" && verse.emotion.toLowerCase().includes("resolve")) score += 2;
  if (emotion === "anxious" && verse.emotion.toLowerCase().includes("reflection")) score += 2;

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
  const scored = verses
    .map((verse) => ({ verse, score: scoreVerse(verse, emotion) }))
    .sort((a, b) => b.score - a.score);

  const picked = pickFromTop(scored, 25).verse;

  return {
    emotion,
    comfortMessage: profiles[emotion].comfortMessage,
    reference: `Chapter ${picked.chapter}, Shloka ${picked.shlokaNumber}`,
    verse: picked.shloka,
    simpleExplanation: picked.simpleExplanation,
    briefExplanation: picked.briefExplanation,
    keywords: picked.keywords,
  };
}

export function isEmotion(value: string): value is Emotion {
  return (EMOTIONS as readonly string[]).includes(value);
}
