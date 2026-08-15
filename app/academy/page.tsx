import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import BrandDivider from "@/components/BrandDivider";
import CourseCard from "@/components/CourseCard";
import CourseSchema from "@/components/schema/CourseSchema";
import { getCourses } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Beauty Academy",
  description: "Professional beauty, hair science, makeup, skin, and nail art courses with certification — full course list and fees.",
};

const trainingPhotos = [
  "/images/library/Academy4.webp",
  "/images/library/Academy7.webp",
  "/images/library/Academy9.webp",
  "/images/library/Academy10.webp",
];

export default async function AcademyPage() {
  const courses = await getCourses();
  const courseCategories = Array.from(new Set(courses.map((c) => c.category)));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <CourseSchema courses={courses} />
      <Breadcrumbs items={[{ label: "Academy" }]} />
      <SectionHeading
        eyebrow="Natural Beauty Academy"
        title="Certified courses, taught inside a working clinic."
        description="Every course pairs classroom instruction with supervised, hands-on client work — assessed by a licensed trainer and assessor."
        align="center"
      />

      <BrandDivider />

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {trainingPhotos.map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-xl2 shadow-soft">
            <Image src={src} alt="Academy training session" fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
          </div>
        ))}
      </div>

      <BrandDivider className="mt-14" />

      <div className="mb-8 flex flex-wrap justify-center gap-3">
        <a href="/academy/apply" className="btn-gold">Apply online</a>
        <a href="/compare-courses" className="btn-outline">Compare courses</a>
        <a href="/academy/resources" className="btn-outline">Student resources</a>
      </div>

      <div className="mt-4 space-y-12">
        {courseCategories.map((category) => {
          const categoryCourses = courses.filter((c) => c.category === category);
          return (
            <section key={category}>
              <div className="flex items-center gap-4">
                <h2 className="text-xl md:text-2xl">{category}</h2>
                <span className="h-px flex-1 bg-emerald-900/10" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryCourses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-14 rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-6 text-center">
        <p className="eyebrow text-gold-700">Fees are suggested starting prices</p>
        <p className="mt-2 text-sm text-ink-soft">
          Final fees, batch dates, and schedules are confirmed at enrollment — contact us
          or visit for the current batch calendar and any active discounts.
        </p>
      </div>
    </div>
  );
}
