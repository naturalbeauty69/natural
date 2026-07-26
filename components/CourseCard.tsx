import { Course } from "@/data/courses";

function formatFee(fee: number) {
  return `Rs. ${fee.toLocaleString("en-IN")}`;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="card p-6">
      <p className="eyebrow text-gold-500">{course.category}</p>
      <p className="mt-2 font-display text-lg text-emerald-900">{course.name}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-soft">
        <span className="rounded-full bg-emerald-50 px-3 py-1">{course.duration}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1">{course.level}</span>
      </div>
      <p className="mt-4 font-mono text-base font-medium text-emerald-700">{formatFee(course.fee)}</p>
    </div>
  );
}
