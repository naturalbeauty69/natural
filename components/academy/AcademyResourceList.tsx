 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ShieldCheck } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  file_name: string | null;
  download_enabled: boolean;
  access_level: string;
  course_id: string | null;
  display_order?: number;
  courses?: { name: string | null } | { name: string | null }[] | null;
};

const TYPE_LABELS: Record<string, string> = {
  notice: "Notice",
  syllabus: "Syllabus",
  file: "Files",
  image: "Images",
  link: "Links",
};

function getCourseName(resource: Resource) {
  if (Array.isArray(resource.courses)) return resource.courses[0]?.name ?? "General";
  return resource.courses?.name ?? "General";
}

export default function AcademyResourceList({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [course, setCourse] = useState("all");
  const [access, setAccess] = useState("all");

  const courses = useMemo(() => {
    const map = new Map<string, string>();
    for (const resource of resources) {
      if (resource.course_id) map.set(resource.course_id, getCourseName(resource));
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [resources]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesType = type === "all" || resource.resource_type === type;
      const matchesCourse = course === "all" || resource.course_id === course;
      const matchesAccess = access === "all" || resource.access_level === access;
      const haystack = `${resource.title} ${resource.description ?? ""} ${resource.file_name ?? ""} ${getCourseName(resource)}`.toLowerCase();
      return matchesType && matchesCourse && matchesAccess && (!q || haystack.includes(q));
    });
  }, [resources, query, type, course, access]);

  const hasFilters = Boolean(query || type !== "all" || course !== "all" || access !== "all");

  if (!resources.length) {
    return (
      <div className="card mt-6 p-6 text-center">
        <p className="eyebrow text-gold-600">Academy library</p>
        <p className="mt-2 text-sm text-ink-soft">
          No course files or notices have been published for your account yet.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-6" aria-label="Academy resources">
      <div className="card border border-emerald-900/10 bg-cream/95 p-3 shadow-soft md:sticky md:top-[76px] md:z-20 md:p-4">
        <div className="flex flex-col gap-3">
          <label className="relative min-w-0">
            <span className="sr-only">Search Academy resources</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notices, syllabi, files..."
              className="w-full rounded-lg border border-emerald-900/10 bg-white/60 py-3 pl-9 pr-3 text-sm outline-none transition-colors focus:border-emerald-700/30"
            />
          </label>

          <div className="md:hidden">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2.5 text-sm font-medium text-emerald-900">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filters
                </span>
                <span className="text-xs font-normal text-ink-soft">
                  {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </span>
              </summary>
              <div className="mt-3 grid gap-2">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  aria-label="Filter by resource type"
                  className="w-full rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2.5 text-sm text-ink-soft outline-none"
                >
                  <option value="all">All types</option>
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  aria-label="Filter by course"
                  className="w-full rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2.5 text-sm text-ink-soft outline-none"
                >
                  <option value="all">All courses</option>
                  {courses.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                </select>
                <select
                  value={access}
                  onChange={(e) => setAccess(e.target.value)}
                  aria-label="Filter by access level"
                  className="w-full rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2.5 text-sm text-ink-soft outline-none"
                >
                  <option value="all">All access</option>
                  <option value="public">Public</option>
                  <option value="students">Students</option>
                  <option value="approved">Approved</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </details>
          </div>

          <div className="hidden gap-2 md:flex md:items-center">
            <div className="mr-1 inline-flex items-center gap-2 text-xs text-ink-soft">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filter
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Filter by resource type"
              className="min-w-0 flex-1 rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2.5 text-sm text-ink-soft outline-none"
            >
              <option value="all">All types</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              aria-label="Filter by course"
              className="min-w-0 flex-1 rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2.5 text-sm text-ink-soft outline-none"
            >
              <option value="all">All courses</option>
              {courses.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value)}
              aria-label="Filter by access level"
              className="min-w-0 flex-1 rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2.5 text-sm text-ink-soft outline-none"
            >
              <option value="all">All access</option>
              <option value="public">Public</option>
              <option value="students">Students</option>
              <option value="approved">Approved</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-emerald-900/5 pt-3 text-xs text-ink-soft">
          <span>{filtered.length} resource{filtered.length === 1 ? "" : "s"}</span>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => { setQuery(""); setType("all"); setCourse("all"); setAccess("all"); }}
              className="font-medium text-emerald-800 hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {!filtered.length ? (
        <div className="card mt-4 p-6 text-center">
          <p className="text-sm text-ink-soft">No resources match your filters.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((resource) => {
            const courseName = getCourseName(resource);
            const isPublic = resource.access_level === "public";

            return (
              <article
                key={resource.id}
                className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow text-gold-600">{TYPE_LABELS[resource.resource_type] ?? resource.resource_type}</span>
                    {resource.course_id ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-900/10 px-2 py-1 text-[10px] font-medium text-emerald-900">
                        {courseName}
                      </span>
                    ) : null}
                    {!isPublic ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-900/10 px-2 py-1 text-[10px] font-medium text-amber-800">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        Authorized access
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-2 font-display text-lg text-emerald-900">{resource.title}</h3>
                  {resource.description && (
                    <p className="mt-1 text-sm text-ink-soft">{resource.description}</p>
                  )}
                  {resource.file_name && (
                    <p className="mt-2 truncate text-xs text-ink-soft">{resource.file_name}</p>
                  )}
                </div>

                <Link
                  href={`/api/academy/resources/${resource.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline whitespace-nowrap text-sm"
                >
                  {resource.download_enabled ? "Open / Download" : "View resource"}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
