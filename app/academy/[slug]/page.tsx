import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import BrandDivider from "@/components/BrandDivider";
import CourseApplicationForm from "@/components/academy/CourseApplicationForm";
import { createClient } from "@/lib/supabase-admin/server";
import { courses as localCourses } from "@/data/courses";

type CurriculumModule = { module?: string; topics?: string[] };

async function getCourse(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, name, category, level, summary, description, duration, eligibility, curriculum, price, certification_name, career_opportunities, image_url, is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!error && data) return data;

  const local = localCourses.find((c) => c.slug === slug);
  return local
    ? {
        id: undefined,
        slug: local.slug,
        name: local.name,
        category: local.category,
        level: local.level,
        summary: "",
        description: "",
        duration: local.duration,
        eligibility: "",
        curriculum: [],
        price: local.fee,
        certification_name: "Course completion certificate",
        career_opportunities: [],
        image_url: null,
        is_active: true,
      }
    : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.name} | Natural Beauty Academy`,
    description: course.summary || course.description || `${course.name} at Natural Beauty Clinic & Academy.`,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const curriculum = Array.isArray(course.curriculum) ? (course.curriculum as CurriculumModule[]) : [];
  const careers = Array.isArray(course.career_opportunities) ? course.career_opportunities : [];

  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <Breadcrumbs items={[{ label: "Academy", href: "/academy" }, { label: course.name }]} />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow text-gold-600">{course.category}</p>
            <h1 className="mt-2 text-4xl text-emerald-900 md:text-5xl">{course.name}</h1>
            {course.summary && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{course.summary}</p>}
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-ink-soft">
              <span className="rounded-full bg-emerald-50 px-3 py-1">{course.level}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1">{course.duration}</span>
              {course.price != null && <span className="rounded-full bg-gold-100 px-3 py-1">Rs. {Number(course.price).toLocaleString("en-IN")}</span>}
            </div>
            {course.description && <p className="mt-6 whitespace-pre-line text-sm leading-7 text-ink-soft">{course.description}</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/academy/apply?course=${encodeURIComponent(course.slug)}`} className="btn-gold">Apply online</Link>
              <Link href="/compare-courses" className="btn-outline">Compare courses</Link>
            </div>
          </div>

          <aside className="card p-6">
            <p className="eyebrow text-gold-600">Course information</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="font-medium text-emerald-900">Eligibility</dt><dd className="mt-1 text-ink-soft">{course.eligibility || "Contact the academy for current eligibility requirements."}</dd></div>
              <div><dt className="font-medium text-emerald-900">Certification</dt><dd className="mt-1 text-ink-soft">{course.certification_name || "Certificate on successful completion."}</dd></div>
              {careers.length > 0 && <div><dt className="font-medium text-emerald-900">Career opportunities</dt><dd className="mt-1 text-ink-soft">{careers.join(" · ")}</dd></div>}
            </dl>
          </aside>
        </div>
      </section>

      <BrandDivider />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="eyebrow text-gold-600">What you will learn</p>
        <h2 className="mt-2 text-3xl text-emerald-900">Course syllabus</h2>
        {curriculum.length ? (
          <div className="mt-7 space-y-4">
            {curriculum.map((item, index) => (
              <div key={`${item.module}-${index}`} className="card p-5">
                <h3 className="font-display text-lg text-emerald-900">{item.module || `Module ${index + 1}`}</h3>
                {item.topics?.length ? (
                  <ul className="mt-3 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
                    {item.topics.map((topic) => <li key={topic}>• {topic}</li>)}
                  </ul>
                ) : <p className="mt-2 text-sm text-ink-soft">Syllabus details will be updated by the academy.</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="card mt-7 p-6 text-sm text-ink-soft">
            The academy is preparing the detailed syllabus for this course. Check back soon or contact the academy for the current curriculum.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <CourseApplicationForm courseId={course.id} courseName={course.name} />
      </section>
    </div>
  );
}
