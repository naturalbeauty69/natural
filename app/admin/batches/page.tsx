export default function AdminBatchesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Batches</h1>
      <div className="mt-6 rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-8 text-center dark:bg-emerald-900/40">
        <p className="eyebrow text-gold-700">Coming in the next phase</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft dark:text-cream/70">
          Batch scheduling — name, course, trainer, dates, class schedule, capacity, and status. The `course_batches` table is ready in the database.
        </p>
      </div>
    </div>
  );
}
