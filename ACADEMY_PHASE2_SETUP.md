# Academy Phase 2 Setup

## 1. Database

1. Open Supabase SQL Editor for the existing project.
2. Run `supabase/migrations/20260814_academy_resources_and_applications.sql`.
3. Do not rerun the original schema file on the existing database.

The migration creates:
- academy_resources
- academy_resource_access
- course_applications
- students.profile_id
- RLS and timestamp/application safety triggers

## 2. Course syllabus

Admin → Courses → Edit a course.

Use one line per module:

`Module name | Topic 1, Topic 2, Topic 3`

Example:

`Skin Analysis | Skin types, consultation, contraindications`
`Facial Techniques | Cleansing, exfoliation, massage, masks`

Replace the example content with the actual syllabus supplied by the academy.

## 3. Course applications

Public:
- Academy → select a course → Apply online
- `/academy/apply` also provides a course selector.

Admin:
- Admin → Applications
- Review applicant details
- Set status: pending, reviewing, approved, rejected, waitlisted, enrolled
- Add internal notes

## 4. Academy resources

Admin → Academy Resources → Add resource.

Resource types:
- Course file
- Notice
- Syllabus
- Link
- Notice image

For Google Drive:
1. Upload the file/image to Google Drive.
2. Set the Google Drive sharing permission appropriately.
3. Copy the share URL.
4. Paste it into Google Drive URL.
5. Choose course or "All courses / general academy".
6. Choose access:
   - Public
   - Academic students
   - Approved users only
   - Staff only
7. Enable/disable the application's Open/Download button.
8. Enable the resource.

For "Approved users only", enter the user's existing Supabase account email and click Grant access.

## 5. Student/private access

- Student accounts can see resources with access level "Academic students".
- Course-specific resources require an active/enrolled/completed student record linked to the student's profile, or an application with status `enrolled`.
- Explicitly approved users can see resources granted to their account.
- Staff can manage and view all resources.

## 6. Important Google Drive limitation

The website can control application visibility and whether it shows an Open/Download button. It cannot revoke Google Drive permissions.

If a file must be strictly non-downloadable, use a private Supabase Storage bucket and signed URLs instead of a public Google Drive share link. That can be implemented as a later storage-hardening phase.

## 7. Production verification

Test:
- `/academy`
- `/academy/basic-beautician-course`
- `/academy/apply`
- `/academy/resources` while logged out and logged in
- Student dashboard
- Admin → Courses
- Admin → Applications
- Admin → Academy Resources
- Public resource
- Student-only resource
- Approved-user resource
- Disabled resource
- Application status changes

Also run `npm install`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` in the project directory before deployment.
