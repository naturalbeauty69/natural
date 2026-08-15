"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-admin/browser";

type CourseOption = { id: string; name: string };

export default function CourseApplicationForm({
  courseId,
  courseName,
  courses = [],
}: {
  courseId?: string;
  courseName?: string;
  courses?: CourseOption[];
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(courseId ?? courses[0]?.id ?? "");
  const selectedCourseName = courses.find((c) => c.id === selectedCourseId)?.name ?? courseName ?? "the selected course";
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    preferred_batch: "",
    previous_experience: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourseId) {
      setError("Please choose a course.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("course_applications").insert({
      course_id: selectedCourseId,
      applicant_user_id: user?.id ?? null,
      ...form,
    });
    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="card p-6 text-center">
        <p className="eyebrow text-gold-600">Application received</p>
        <h2 className="mt-2 text-2xl text-emerald-900">Thank you for applying.</h2>
        <p className="mt-3 text-sm text-ink-soft">
          Your application for <strong>{selectedCourseName}</strong> has been sent to the academy team.
          We will contact you using the details you provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div>
        <h2 className="font-display text-xl text-emerald-900">Online course application</h2>
        <p className="mt-1 text-sm text-ink-soft">Apply online and let the academy team review your application.</p>
      </div>
      {courses.length > 0 ? (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft">Choose course</label>
          <select
            required
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm"
          >
            <option value="">Select a course</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>
        </div>
      ) : (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">{selectedCourseName}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm" />
        <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm" />
        <input placeholder="Preferred batch / schedule" value={form.preferred_batch} onChange={(e) => setForm({ ...form, preferred_batch: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm" />
      </div>
      <textarea placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="min-h-20 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm" />
      <textarea placeholder="Previous beauty / salon experience (optional)" value={form.previous_experience} onChange={(e) => setForm({ ...form, previous_experience: e.target.value })} className="min-h-20 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm" />
      <textarea placeholder="Anything else the academy should know?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-20 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button disabled={status === "saving"} className="btn-primary">
        {status === "saving" ? "Submitting…" : "Submit application"}
      </button>
      <p className="text-xs text-ink-soft">Submitting this form does not guarantee admission. The academy will review your application.</p>
    </form>
  );
}
