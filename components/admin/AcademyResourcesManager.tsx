"use client";

import { useState } from "react";
import { Plus, Trash2, X, UserPlus, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

type Course = { id: string; name: string };
type Resource = {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  course_id: string | null;
  google_drive_url: string | null;
  storage_path: string | null;
  storage_url: string | null;
  download_enabled: boolean;
  access_level: string;
  is_active: boolean;
  display_order: number;
};

const emptyForm = {
  title: "",
  description: "",
  resource_type: "file",
  course_id: "",
  google_drive_url: "",
  storage_url: "",
  download_enabled: true,
  access_level: "students",
  display_order: "0",
};

const MAX_FILE_SIZE = 30 * 1024 * 1024;

export default function AcademyResourcesManager({
  initialResources,
  courses,
}: {
  initialResources: Resource[];
  courses: Course[];
}) {
  const [resources, setResources] = useState(initialResources);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [grantEmail, setGrantEmail] = useState<Record<string, string>>({});
  const [grantMessage, setGrantMessage] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.google_drive_url && !form.storage_url && !selectedFile) {
      setError("Choose a file, add a Google Drive URL, or add a storage URL.");
      return;
    }

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setError("The selected file is larger than the 30 MB Academy bucket limit.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const resourceId = crypto.randomUUID();
    const safeName = selectedFile
      ? selectedFile.name.replace(/[^a-zA-Z0-9._-]+/g, "-")
      : null;
    const storagePath = selectedFile
      ? `academy/${form.course_id || "general"}/${resourceId}-${safeName}`
      : null;

    const { data, error: insertError } = await supabase
      .from("academy_resources")
      .insert({
        id: resourceId,
        title: form.title.trim(),
        description: form.description || null,
        resource_type: form.resource_type,
        course_id: form.course_id || null,
        file_name: selectedFile?.name || null,
        mime_type: selectedFile?.type || null,
        file_size: selectedFile?.size || null,
        storage_path: storagePath,
        google_drive_url: form.google_drive_url || null,
        storage_url: form.storage_url || null,
        download_enabled: form.download_enabled,
        access_level: form.access_level,
        is_active: true,
        display_order: Number(form.display_order) || 0,
      })
      .select()
      .single();

    if (insertError || !data) {
      setError(insertError?.message || "Could not create the resource.");
      setSaving(false);
      return;
    }

    if (selectedFile && storagePath) {
      const { error: uploadError } = await supabase.storage
        .from("krish")
        .upload(storagePath, selectedFile, {
          contentType: selectedFile.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        await supabase.from("academy_resources").delete().eq("id", resourceId);
        setError(`File upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }
    }

    setResources((prev) => [...prev, data as Resource]);
    setForm(emptyForm);
    setSelectedFile(null);
    setOpen(false);
    setSaving(false);
  }

  async function toggle(resource: Resource) {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("academy_resources")
      .update({ is_active: !resource.is_active })
      .eq("id", resource.id);

    if (!updateError) {
      setResources((prev) =>
        prev.map((r) => r.id === resource.id ? { ...r, is_active: !r.is_active } : r)
      );
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this academy resource?")) return;

    const resource = resources.find((r) => r.id === id);
    const supabase = createClient();

    if (resource?.storage_path) {
      await supabase.storage.from("krish").remove([resource.storage_path]);
    }

    const { error: deleteError } = await supabase
      .from("academy_resources")
      .delete()
      .eq("id", id);

    if (!deleteError) {
      setResources((prev) => prev.filter((r) => r.id !== id));
    }
  }

  async function grant(resourceId: string) {
    const email = grantEmail[resourceId]?.trim();
    if (!email) return;

    setGrantMessage("");
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (!profile) {
      setGrantMessage("No account was found for that email.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { error: grantError } = await supabase
      .from("academy_resource_access")
      .upsert({
        resource_id: resourceId,
        user_id: profile.id,
        granted_by: user?.id ?? null,
      });

    setGrantMessage(grantError ? grantError.message : `Access granted to ${email}.`);
    if (!grantError) {
      setGrantEmail((prev) => ({ ...prev, [resourceId]: "" }));
    }
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => { setOpen(true); setError(""); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" /> Add resource
        </button>
      </div>

      {open && (
        <form onSubmit={save} className="card mb-6 space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-emerald-900">New academy resource</h2>
            <button
              type="button"
              onClick={() => { setOpen(false); setSelectedFile(null); setError(""); }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
            />

            <select
              value={form.resource_type}
              onChange={(e) => setForm({ ...form, resource_type: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
            >
              <option value="file">Course file</option>
              <option value="notice">Notice</option>
              <option value="syllabus">Syllabus</option>
              <option value="link">Link</option>
              <option value="image">Notice image</option>
            </select>

            <select
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
            >
              <option value="">All courses / general academy</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select
              value={form.access_level}
              onChange={(e) => setForm({ ...form, access_level: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
            >
              <option value="public">Public</option>
              <option value="students">Academic students</option>
              <option value="approved">Approved users only</option>
              <option value="staff">Staff only</option>
            </select>

            <label className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft">
                Upload file to private Academy storage
              </span>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
              <span className="mt-1 block text-xs text-ink-soft">
                Maximum 30 MB. The file stays private and is delivered only after the Academy access check.
              </span>
            </label>

            <input
              placeholder="Google Drive URL (optional)"
              value={form.google_drive_url}
              onChange={(e) => setForm({ ...form, google_drive_url: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm sm:col-span-2"
            />

            <input
              placeholder="Legacy/public storage URL (optional)"
              value={form.storage_url}
              onChange={(e) => setForm({ ...form, storage_url: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm sm:col-span-2"
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm sm:col-span-2"
            />

            <input
              type="number"
              placeholder="Display order"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.download_enabled}
              onChange={(e) => setForm({ ...form, download_enabled: e.target.checked })}
            />
            Show Open / Download action
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button disabled={saving} className="btn-primary">
            {saving ? "Uploading…" : "Save resource"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="card p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="eyebrow text-gold-600">
                  {resource.resource_type} · {resource.access_level}
                </p>
                <h3 className="mt-1 font-display text-lg text-emerald-900">{resource.title}</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  {resource.storage_path
                    ? `Private file: ${resource.file_name || resource.storage_path}`
                    : resource.google_drive_url || resource.storage_url}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggle(resource)} className="btn-outline text-xs">
                  {resource.is_active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => remove(resource.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  aria-label="Delete resource"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {resource.access_level === "approved" && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Approved user's account email"
                  value={grantEmail[resource.id] ?? ""}
                  onChange={(e) => setGrantEmail((prev) => ({ ...prev, [resource.id]: e.target.value }))}
                  className="flex-1 rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
                />
                <button
                  onClick={() => grant(resource.id)}
                  className="btn-outline flex items-center justify-center gap-2 text-sm"
                >
                  <UserPlus className="h-4 w-4" /> Grant access
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {grantMessage && <p className="mt-4 text-sm text-emerald-700">{grantMessage}</p>}
    </div>
  );
}
