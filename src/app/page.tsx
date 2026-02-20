import Link from "next/link";
import { EMOTIONS, type Emotion } from "@/lib/gita";

const emotionMeta: Record<Emotion, { emoji: string; subtitle: string; border: string; accent: string }> = {
  happy: {
    emoji: "☀️",
    subtitle: "Celebrate with wisdom",
    border: "border-amber-200 hover:border-amber-300",
    accent: "bg-amber-400",
  },
  sad: {
    emoji: "🌧️",
    subtitle: "Find solace within",
    border: "border-sky-200 hover:border-sky-300",
    accent: "bg-sky-400",
  },
  laziness: {
    emoji: "🍃",
    subtitle: "Awaken your purpose",
    border: "border-slate-200 hover:border-slate-300",
    accent: "bg-slate-400",
  },
  protection: {
    emoji: "🛡️",
    subtitle: "Strengthen your spirit",
    border: "border-emerald-200 hover:border-emerald-300",
    accent: "bg-emerald-400",
  },
  anger: {
    emoji: "🔥",
    subtitle: "Channel your fire",
    border: "border-rose-200 hover:border-rose-300",
    accent: "bg-rose-400",
  },
  peace: {
    emoji: "🕊️",
    subtitle: "Deepen your calm",
    border: "border-teal-200 hover:border-teal-300",
    accent: "bg-teal-400",
  },
  loneliness: {
    emoji: "🌙",
    subtitle: "You are never alone",
    border: "border-violet-200 hover:border-violet-300",
    accent: "bg-violet-400",
  },
  anxious: {
    emoji: "🌊",
    subtitle: "Return to stillness",
    border: "border-orange-200 hover:border-orange-300",
    accent: "bg-orange-400",
  },
};

function prettyEmotion(emotion: Emotion) {
  return emotion[0].toUpperCase() + emotion.slice(1);
}

export default function Home() {
  return (
    <main className="bg-warm-soft relative flex min-h-svh flex-col px-3 py-6 sm:min-h-screen sm:px-5 sm:py-8">
      <div className="flex flex-1 flex-col justify-center gap-4 sm:gap-10">
        {/* Subtle top decorative line */}
        <div className="mx-auto h-px w-16 bg-linear-to-r from-transparent via-amber-300/50 to-transparent" />

        <section className="relative mx-auto max-w-2xl text-center">
          <p className="mb-2 text-[0.6rem] font-medium tracking-[0.25em] text-amber-700/70 uppercase sm:mb-4 sm:text-xs">
            GitaComforts.me
          </p>
          <h1 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-stone-800 sm:text-[2.75rem] sm:leading-tight">
            What does your heart
            <br className="hidden sm:block" />
            <span className="text-amber-700"> feel right now?</span>
          </h1>
          <p className="mx-auto hidden max-w-lg text-[0.95rem] leading-relaxed text-stone-500 sm:block">
            Choose what you&apos;re feeling and receive a verse from the Gita —
            ancient wisdom to help you find clarity, comfort, and strength.
          </p>
        </section>

        <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {EMOTIONS.map((emotion) => {
            const meta = emotionMeta[emotion];
            return (
              <Link
                key={emotion}
                href={`/message/${emotion}`}
                className={`group relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md sm:gap-3 sm:rounded-3xl sm:p-7 ${meta.border}`}
              >
                {/* Colored top accent bar */}
                <div className={`absolute inset-x-0 top-0 h-0.5 sm:h-1 ${meta.accent} opacity-60 transition-opacity group-hover:opacity-100`} />
                <span className="text-xl transition-transform duration-300 group-hover:scale-110 sm:text-3xl">
                  {meta.emoji}
                </span>
                <span className="text-xs font-semibold tracking-wide text-stone-700 sm:text-base">
                  {prettyEmotion(emotion)}
                </span>
                <span className="hidden text-[0.65rem] leading-tight text-stone-400 sm:block sm:text-xs">
                  {meta.subtitle}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom ornament */}
        <div className="mt-8 flex flex-col items-center gap-1">
          <div className="ornament mx-auto" />
          <p className="text-center text-[0.6rem] tracking-widest text-stone-300 uppercase sm:text-[0.7rem]">
            Wisdom from the Bhagavad Gita
          </p>
        </div>
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
