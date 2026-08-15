import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-admin/server";
import CourseApplicationForm from "@/components/academy/CourseApplicationForm";

export const metadata: Metadata = {
  title: "Apply to Beauty Academy",
  description: "Submit an online application for a Natural Beauty Clinic & Academy course.",
};

export default async function AcademyApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course: requestedSlug } = await searchParams;
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("display_order");

  const selected = courses?.find((course) => course.slug === requestedSlug) ?? courses?.[0];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow text-gold-600">Natural Beauty Academy</p>
      <h1 className="mt-2 text-4xl text-emerald-900">Apply for a course</h1>
      <p className="mt-3 text-sm text-ink-soft">Choose an available course, review its syllabus, and submit your application online.</p>
      <div className="mt-8">
        {courses?.length ? (
          <CourseApplicationForm
            courses={courses.map((course) => ({ id: course.id, name: course.name }))}
            courseId={selected?.id}
            courseName={selected?.name}
          />
        ) : (
          <p className="text-sm text-ink-soft">No active courses are currently available.</p>
        )}
      </div>
    </div>
  );
}
