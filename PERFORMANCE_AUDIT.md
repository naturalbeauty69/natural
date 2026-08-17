NATURAL BEAUTY WEBSITE — FILTER + PERFORMANCE AUDIT

Source audited:
Current uploaded website ZIP.

Implemented in this patch:
1. Academy resource search.
2. Filters:
   - All types
   - Notice
   - Syllabus
   - Files
   - Images
   - Links
   - Course
   - Access level
3. One focused Academy resources query selecting only fields used by the list/filter UI.
4. 500-row safety limit to prevent accidentally rendering a huge resource table.
5. Existing RLS/access-control behavior is unchanged.
6. Header scroll listener now schedules updates with requestAnimationFrame and only updates React state when the scrolled state changes.
7. Removed header backdrop-blur from the scroll state to reduce paint/compositing cost.
8. Removed Framer Motion from FloatingActions and removed the continuously running WhatsApp pulse animation.
9. Added generated/cache directories to .gitignore.

Important:
- No Supabase SQL changes are included.
- Existing products, product images, Academy storage, and RLS are not changed.
- This patch intentionally does NOT change the current behavior where private Academy resources are not listed to unauthorized visitors.

Validation note:
The build could not be completed inside this environment because dependency installation did not finish. The source files were inspected and the changes were kept limited to the files listed below. After replacing them, Cloudflare's normal build must be the final production validation.
