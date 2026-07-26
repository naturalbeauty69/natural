export default function StatsGrid({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="card px-4 py-6 text-center">
          <p className="font-display text-2xl text-emerald-700 md:text-3xl">{stat.value}</p>
          <p className="mt-1 text-xs leading-snug text-ink-soft">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
