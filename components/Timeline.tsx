import { TimelineEntry } from "@/lib/types";

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative border-l border-emerald-900/10 pl-8">
      {entries.map((entry) => (
        <div key={entry.year} className="relative mb-10 last:mb-0">
          <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-gold-500" />
          <p className="eyebrow text-gold-500">{entry.year}</p>
          <p className="mt-1 font-display text-lg text-emerald-900">{entry.title}</p>
          <ul className="mt-2 space-y-1.5">
            {entry.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-700" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
