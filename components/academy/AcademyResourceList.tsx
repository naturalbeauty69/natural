type Resource = {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  file_name: string | null;
  storage_path: string | null;
  storage_url: string | null;
  google_drive_url: string | null;
  download_enabled: boolean;
  course_id: string | null;
};

export default function AcademyResourceList({ resources }: { resources: Resource[] }) {
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
    <div className="mt-6 space-y-3">
      {resources.map((resource) => {
        const href = resource.id
          ? `/api/academy/resources/${resource.id}`
          : resource.google_drive_url || resource.storage_url;

        return (
          <article
            key={resource.id}
            className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="eyebrow text-gold-600">{resource.resource_type}</p>
              <h3 className="mt-1 font-display text-lg text-emerald-900">{resource.title}</h3>
              {resource.description && (
                <p className="mt-1 text-sm text-ink-soft">{resource.description}</p>
              )}
              {resource.file_name && (
                <p className="mt-2 text-xs text-ink-soft">{resource.file_name}</p>
              )}
            </div>

            {href && (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="btn-outline whitespace-nowrap text-sm"
              >
                {resource.download_enabled ? "Open / Download" : "View resource"}
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
