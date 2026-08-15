# SAFE ACADEMY UPGRADE — DEPLOYMENT GUIDE

This package is designed for the existing Natural Beauty Clinic & Academy website.

## IMPORTANT SAFETY RULE

Do **not** run the original `supabase/schema.sql` again on your existing production database.

Run only:

`supabase/migrations/20260815_academy_safe_upgrade.sql`

The migration is idempotent and is designed to add/extend Academy functionality without dropping existing tables or deleting existing rows.

## What this upgrade adds

- Academy resource library
- Private Supabase Storage bucket support using your existing empty `krish` bucket
- Admin file upload to `krish`
- Course-specific resources
- Academy notices/images/files/syllabus resources
- Google Drive links
- Public / academic-student / approved-user / staff access levels
- Explicit approved-user access grants
- Online course application form
- Admin application review/status management
- Safe student-to-profile linkage (`students.profile_id`)
- Secure resource access route with short-lived Supabase signed URLs
- Existing course `curriculum` JSONB remains the course syllabus/content area

## Supabase — one SQL step

1. Open the existing Supabase project.
2. Open **SQL Editor**.
3. Create a new query.
4. Paste the complete contents of:
   `supabase/migrations/20260815_academy_safe_upgrade.sql`
5. Click **Run**.
6. The final verification query should return counts for:
   - academy_resources
   - academy_resource_access
   - course_applications
   - courses
   - students

Do not paste it into the old `schema.sql` query.

## Supabase Storage

You already created an empty bucket named `krish`.

Leave it in place.

The migration:
- keeps the existing bucket if it exists;
- makes it private;
- limits newly created bucket settings to 30 MB only when the bucket did not already exist;
- adds policies scoped only to bucket `krish`.

Do not delete the bucket.

## GitHub / Cloudflare

This project is connected to GitHub + Cloudflare.

1. Keep your current repository backup/ZIP.
2. Extract this package.
3. Replace the repository files with this package's files.
4. Commit and push to the same GitHub repository.
5. Let the existing Cloudflare deployment run.
6. Do not change your Supabase URL/key environment variables.

If you prefer, copy the changed files into the existing repository rather than replacing the whole repository. The full ZIP is provided so the project can be restored consistently.

## First test

After deployment:

1. Open `/academy`.
2. Open a course.
3. Open `/academy/apply`.
4. Submit a test application.
5. Admin → Course Applications.
6. Admin → Academy Resources.
7. Upload a small PDF to `krish`.
8. Set it to **Academic students**.
9. Confirm an authorized student can open it.
10. Confirm a logged-out visitor cannot open the private resource.
11. Test **Approved users only** with one test account.
12. Test Disable/Enable.

## Important download limitation

`download_enabled` controls whether the website exposes the Open/Download action and blocks the explicit `?download=1` request.

It cannot prevent a person from saving/recording content that their browser is already allowed to view. This is a web-platform limitation.

For sensitive documents, use private Supabase Storage rather than a public Google Drive link.

## Course syllabus

Your existing `courses.curriculum` JSONB field is retained.

The admin Courses screen can store:

`Module name | Topic 1, Topic 2, Topic 3`

The supplied Academy Word document should be used as the source for entering the real syllabus. The upgrade does not overwrite your existing 11 courses automatically.

This is intentional: existing course data is not replaced.

## Rollback

If you do not want the new Academy functionality, stop using the new Academy pages/resources.

Do not restore the old `schema.sql` over production.

If a code rollback is needed, restore your previous GitHub commit/ZIP.

The migration intentionally does not delete existing production data.
