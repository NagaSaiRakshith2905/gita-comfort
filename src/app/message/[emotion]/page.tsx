import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessageForEmotion, isEmotion, type Emotion } from "@/lib/gita";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    emotion: string;
  }>;
};

function prettyEmotion(emotion: string) {
  return emotion[0].toUpperCase() + emotion.slice(1);
}

const emotionTheme: Record<
  Emotion,
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
};

export default async function MessagePage({ params }: PageProps) {
  const { emotion } = await params;

  if (!isEmotion(emotion)) {
    notFound();
  }

  const data = getMessageForEmotion(emotion);
  const theme = emotionTheme[emotion];

  return (
    <main className={`${theme.bg} relative min-h-svh px-4 py-5 sm:min-h-screen sm:px-8 sm:py-20`}>
      {/* Top bar */}
      <nav className="relative mx-auto mb-5 flex max-w-2xl items-center justify-between sm:mb-14">
        <div>
          <p className="text-[0.65rem] font-medium tracking-[0.25em] text-stone-400 uppercase sm:text-xs">
            Bhagavad Gita Companion
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-stone-500 shadow-sm backdrop-blur-sm transition-all hover:border-stone-300 hover:text-stone-700 hover:shadow-md sm:text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </nav>

      {/* Title */}
      <section className="mx-auto mb-5 max-w-2xl text-center sm:mb-14">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-stone-800 sm:text-[2.5rem]">
          Guidance for <span className={theme.accent}>{prettyEmotion(emotion)}</span>
        </h1>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2 sm:mt-4">
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
        <div className="mb-5 px-1 text-center sm:mb-14 sm:px-4">
          <p className={`mb-2 text-[0.6rem] font-semibold tracking-[0.2em] uppercase sm:mb-3 sm:text-xs ${theme.accent} opacity-60`}>
            A message for you
          </p>
          <p className="font-serif text-lg leading-relaxed text-stone-800 sm:text-2xl sm:leading-relaxed">
            {data.comfortMessage}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-auto mb-5 h-px w-12 bg-stone-200/80 sm:mb-14" />

        {/* Verse — card with accent bar */}
        <div className="relative mb-6 overflow-hidden rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] ring-1 ring-stone-100 sm:mb-10 sm:rounded-3xl sm:px-10 sm:py-8">
          <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl bg-linear-to-b sm:rounded-l-3xl ${theme.bar}`} />
          <p className="mb-2 pl-3 text-[0.55rem] font-semibold tracking-[0.2em] text-stone-300 uppercase sm:mb-3 sm:pl-5 sm:text-[0.65rem]">
            Verse
          </p>
          <blockquote className="pl-3 font-serif text-base leading-[1.75] text-stone-600 italic sm:pl-5 sm:text-xl sm:leading-[1.85]">
            &ldquo;{data.verse}&rdquo;
          </blockquote>
        </div>

        {/* Explanation sections */}
        <div className="space-y-5 sm:space-y-8">
          <section>
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
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

          <section>
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <span className="h-px flex-1 bg-linear-to-r from-stone-200/80 to-transparent" />
              <h3 className="shrink-0 text-[0.6rem] font-semibold tracking-[0.15em] text-stone-400 uppercase sm:text-xs">
                Brief Takeaway
              </h3>
              <span className="h-px flex-1 bg-linear-to-l from-stone-200/80 to-transparent" />
            </div>
            <p className="text-center text-[0.8rem] leading-[1.75] text-stone-600 sm:text-[0.95rem] sm:leading-[1.85]">
              {data.briefExplanation}
            </p>
          </section>
        </div>

        {/* Bottom ornament */}
        <div className="ornament mx-auto mt-8 hidden sm:mt-16 sm:block" />
        <p className="mt-3 hidden text-center text-[0.6rem] tracking-widest text-stone-300 uppercase sm:block sm:text-[0.7rem]">
          May this bring you peace
        </p>
      </article>
    </main>
  );
}
