import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessageAction } from "@/app/actions";
import { isEmotion, type Emotion } from "@/lib/gita";

export const dynamic = "force-dynamic";

const emotionAliases = {
  motivation: "laziness",
} as const;

type PageProps = {
  params: Promise<{
    emotion: string;
  }>;
};

function prettyEmotion(emotion: string) {
  return emotion[0].toUpperCase() + emotion.slice(1);
}

type ThemeEmotion = Emotion | "motivation";

const emotionTheme: Record<
  ThemeEmotion,
  { bg: string; accent: string; badge: string; bar: string }
> = {
  happy: {
    bg: "bg-emotion-happy",
    accent: "text-yellow-700",
    badge: "bg-yellow-100/80 text-yellow-800",
    bar: "from-yellow-400 via-yellow-300 to-yellow-200",
  },
  sad: {
    bg: "bg-emotion-sad",
    accent: "text-blue-700",
    badge: "bg-blue-100/80 text-blue-800",
    bar: "from-blue-400 via-blue-300 to-blue-200",
  },
  laziness: {
    bg: "bg-emotion-laziness",
    accent: "text-slate-600",
    badge: "bg-slate-100/80 text-slate-700",
    bar: "from-slate-400 via-slate-300 to-slate-200",
  },
  protection: {
    bg: "bg-emotion-protection",
    accent: "text-emerald-700",
    badge: "bg-emerald-100/80 text-emerald-800",
    bar: "from-emerald-400 via-emerald-300 to-emerald-200",
  },
  anger: {
    bg: "bg-emotion-anger",
    accent: "text-rose-700",
    badge: "bg-rose-100/80 text-rose-800",
    bar: "from-rose-400 via-rose-300 to-rose-200",
  },
  peace: {
    bg: "bg-emotion-peace",
    accent: "text-teal-700",
    badge: "bg-teal-100/80 text-teal-800",
    bar: "from-teal-400 via-teal-300 to-teal-200",
  },
  loneliness: {
    bg: "bg-emotion-loneliness",
    accent: "text-violet-700",
    badge: "bg-violet-100/80 text-violet-800",
    bar: "from-violet-400 via-violet-300 to-violet-200",
  },
  anxious: {
    bg: "bg-emotion-anxious",
    accent: "text-orange-700",
    badge: "bg-orange-100/80 text-orange-800",
    bar: "from-orange-400 via-orange-300 to-orange-200",
  },
  motivation: {
    bg: "bg-emotion-motivation",
    accent: "text-orange-700",
    badge: "bg-orange-100/80 text-orange-800",
    bar: "from-orange-600 via-amber-400 to-amber-200",
  },
};

export default async function MessagePage({ params }: PageProps) {
  const { emotion } = await params;
  const normalizedEmotion = emotion.toLowerCase();
  const resolvedEmotion =
    emotionAliases[normalizedEmotion as keyof typeof emotionAliases] ?? normalizedEmotion;
  const displayEmotion = normalizedEmotion === "motivation" ? "motivation" : resolvedEmotion;
  const themeEmotion: ThemeEmotion = normalizedEmotion === "motivation" ? "motivation" : resolvedEmotion;
  const emotionDescription =
    themeEmotion === "motivation"
      ? "When you need momentum, start with one purposeful step."
      : null;

  if (!isEmotion(resolvedEmotion)) {
    notFound();
  }

  const data = await getMessageAction(normalizedEmotion);
  const theme = emotionTheme[themeEmotion];

  return (
    <main className={`${theme.bg} relative flex min-h-svh flex-col px-4 py-5 sm:min-h-screen sm:px-8 sm:py-8`}>
      <div className="flex flex-1 flex-col justify-center">
        {/* Top bar */}
        <nav className="relative mx-auto mb-5 flex w-full max-w-2xl items-center justify-between sm:mb-14">
          <div>
            <p className="text-[0.65rem] font-medium tracking-[0.25em] text-stone-400 sm:text-xs">
              GitaComforts.me
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-stone-500 shadow-xs backdrop-blur-sm transition-all hover:border-stone-300 hover:text-stone-700 hover:shadow-sm sm:text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </nav>

        {/* Title */}
        <section className="mx-auto mb-5 flex max-w-2xl flex-col items-center gap-2 text-center sm:mb-14 sm:gap-4">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-stone-800 sm:text-[2.5rem]">
            Guidance for <span className={theme.accent}>{prettyEmotion(displayEmotion)}</span>
          </h1>
          {emotionDescription ? (
            <p className="text-[0.8rem] leading-relaxed text-stone-500 sm:text-sm">
              {emotionDescription}
            </p>
          ) : null}
          <div className="mx-auto flex items-center justify-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[0.7rem] font-medium sm:text-xs ${theme.badge}`}>
              {data.reference}
            </span>
            {/* <span className="text-stone-300">&middot;</span>
            <span className="text-[0.7rem] font-medium text-stone-400 sm:text-xs">
              
            </span> */}
          </div>
        </section>

        {/* Main content */}
        <article className="mx-auto max-w-2xl">
          {/* Comfort message — prominent, no border, just warm text */}
          <div className="mb-5 flex flex-col items-center gap-2 px-1 text-center sm:gap-3 sm:px-4">
            <p className={`text-[0.6rem] font-semibold tracking-[0.2em] uppercase sm:text-xs ${theme.accent} opacity-60`}>
              A message for you
            </p>
            <p className="font-serif text-lg leading-relaxed text-stone-800 sm:text-2xl sm:leading-relaxed">
              {data.comfortMessage}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-auto mb-5 h-px w-12 bg-stone-200/80" />

          {/* Verse — card with accent bar */}
          <div className="relative mb-6 flex flex-col gap-2 overflow-hidden rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] ring-1 ring-stone-100 sm:mb-10 sm:gap-3 sm:rounded-3xl sm:px-10 sm:py-8">
            <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl bg-linear-to-b sm:rounded-l-3xl ${theme.bar}`} />
            <p className="pl-3 text-[0.55rem] font-semibold tracking-[0.2em] text-stone-300 uppercase sm:pl-5 sm:text-[0.65rem]">
              Verse
            </p>
            <blockquote className="pl-3 font-serif text-base leading-[1.75] text-stone-600 italic sm:pl-5 sm:text-xl sm:leading-[1.85]">
              &ldquo;{data.verse}&rdquo;
            </blockquote>
          </div>

          {/* Explanation sections */}
          <div className="flex flex-col gap-5 sm:gap-8">
            <section className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-linear-to-r from-stone-200/80 to-transparent" />
                <h3 className="shrink-0 text-[0.6rem] font-semibold tracking-[0.15em] text-stone-400 uppercase sm:text-xs">
                  Simple Explanation
                </h3>
                <span className="h-px flex-1 bg-linear-to-l from-stone-200/80 to-transparent" />
              </div>
              <p className="text-center text-[0.8rem] leading-[1.75] text-stone-600 sm:text-[0.95rem] sm:leading-[1.85]">
                {data.simpleExplanation}
              </p>
            </section>

            <section className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-linear-to-r from-stone-200/80 to-transparent" />
                <h3 className="shrink-0 text-[0.6rem] font-semibold tracking-[0.15em] text-stone-400 uppercase sm:text-xs">
                  Brief Takeaway
                </h3>
                <span className="h-px flex-1 bg-linear-to-l from-stone-200/80 to-transparent" />
              </div>
              <p className="text-center text-[0.8rem] leading-[1.75] text-stone-600 sm:text-[0.95rem] sm:leading-[1.85]">
                {data.briefTakeaway}
              </p>
            </section>
          </div>

          {/* Bottom ornament */}
          <div className="mt-8 flex flex-col items-center gap-1">
            <div className="ornament mx-auto" />
            <p className="text-center text-[0.6rem] tracking-widest text-stone-300 uppercase sm:text-[0.7rem]">
              May this bring you peace
            </p>
          </div>
        </article>
      </div>

      <footer className="mt-auto mb-2 pt-6 text-center sm:mb-4">
        <p className="text-[0.65rem] tracking-wide text-stone-400 sm:text-xs">
          Developed by:{" "}
          <a
            href="https://n-s-r.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-500 underline-offset-2 transition-colors hover:text-stone-700 hover:underline"
          >
            n-s-r.dev
          </a>
        </p>
      </footer>
    </main>
  );
}
