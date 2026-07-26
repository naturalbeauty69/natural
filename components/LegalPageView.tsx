import { LegalPage } from "@/data/legal";

export default function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow">Last Updated: {page.lastUpdated}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{page.title}</h1>
      <p className="mt-6 text-base leading-relaxed text-ink-soft">{page.intro}</p>

      <div className="mt-10 space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl text-emerald-900">{section.heading}</h2>
            {section.body && (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{section.body}</p>
            )}
            {section.bullets && (
              <ul className="mt-3 space-y-1.5">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
