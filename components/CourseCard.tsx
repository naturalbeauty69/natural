import Link from "next/link";
import type { Course } from "@/data/courses";

function formatFee(fee: number) {
  return fee ? `Rs. ${fee.toLocaleString("en-IN")}` : "Contact academy";
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/academy/${course.slug}`} className="card block p-6 transition-transform hover:-translate-y-0.5">
      <p className="eyebrow text-gold-500">{course.category}</p>
      <p className="mt-2 font-display text-lg text-emerald-900">{course.name}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-soft">
        <span className="rounded-full bg-emerald-50 px-3 py-1">{course.duration}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1">{course.level}</span>
      </div>
      <p className="mt-4 font-mono text-base font-medium text-emerald-700">{formatFee(course.fee)}</p>
      <p className="mt-4 text-sm font-medium text-emerald-700">View syllabus, batches & apply →</p>
    </Link>
  );
}
