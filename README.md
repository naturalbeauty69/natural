# Natural Beauty Clinic & Academy — Web Platform

Phase 1 of the production build: Next.js 14 (App Router) + TypeScript + Tailwind,
with a Supabase schema ready to go and real company data (team + official pricing)
wired in as a local fallback until Supabase is connected.

## What's actually done in this phase

- **Design system** locked in `tailwind.config.ts` — cream / emerald / gold, Fraunces
  (display) + Sora (body) + IBM Plex Mono (prices/labels), a signature botanical→molecular
  divider motif (`components/BrandDivider.tsx`) instead of a generic rule.
- **Real content wired in**: your 6 team members (photos + bios from the uploaded
  `NaturalBeautyTeamAssets.zip`) and the full official price list from your pricing sheet,
  exactly as given — see `data/team.ts` and `data/services.ts`.
- **Pages**: Home, Services (full dynamic price list grouped by category), Team, About,
  Academy, Contact, Appointment (booking form). About/Academy are intentionally kept
  factual and short — see the "Content Needed From Client" callouts on those pages
  rather than invented copy.
- **Database schema** (`supabase/schema.sql`) + **seed data** (`supabase/seed.sql`)
  matching your exact prices — nothing is hardcoded to the frontend long-term; the app
  reads from Supabase once it's connected, and falls back to the local seed files
  automatically if it isn't.
- **Booking form** writes directly to the `appointments` table once Supabase is live.
- Basic SEO: metadata, Open Graph, `robots.ts`, `sitemap.ts`.

## What's NOT done yet (by design — see phasing)

- Admin dashboard / CMS UI (schema is ready; UI is Phase 3)
- Customer & student dashboards, authentication, RBAC
- Product store / e-commerce
- Gallery, blog, testimonials, before/after modules (tables exist, no UI yet)
- Real About/Academy copy — flagged inline on those pages
- Cloudflare Pages deployment, DNS, CI — this repo is deploy-ready but not deployed
- Multi-language (EN/NP), AI skin analysis, loyalty program — future-phase items per spec

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys once you create a project
npm run dev
```

The site works and renders real data **even without Supabase configured** — it uses
the seed data in `/data` until `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`.

### Connecting Supabase (when ready)

1. Create a project at supabase.com.
2. Run `supabase/schema.sql` then `supabase/seed.sql` in the SQL editor.
3. Copy your Project URL and anon key into `.env.local`.
4. Restart `npm run dev` — pages now read live data; admins can edit prices/team/etc.
   directly in the Supabase table editor until the custom admin dashboard (Phase 3) ships.

### Note on this build environment

`npm run build` was type-checked successfully here (`tsc --noEmit` passes with zero
errors), but a full `next build` couldn't complete in this sandbox because outbound
network access to `fonts.googleapis.com` is blocked by this environment's allowlist.
This is not a code issue — it will build normally anywhere with normal internet access
(your machine, Vercel, Cloudflare Pages CI, etc.).

## Deploying to Cloudflare (Workers, via OpenNext)

Cloudflare's current recommended way to run a full Next.js app (server components,
dynamic data, everything this project uses) is the **OpenNext adapter**
(`@opennextjs/cloudflare`), not a plain static/Workers deploy. This repo is already
configured for it:

- `wrangler.jsonc` — points Wrangler at the OpenNext build output
- `open-next.config.ts` — adapter config
- `package.json` scripts: `npm run preview` (build + local Workers preview) and
  `npm run deploy` (build + deploy to Cloudflare)
- `next.config.mjs` — `images.unoptimized: true`, because `next/image`'s built-in
  optimizer needs a Node server that Workers doesn't provide out of the box

### What went wrong in your last deploy

The build log showed Cloudflare going straight from "cloning repository" to
`Executing user deploy command: npx wrangler deploy` — no `npm install`, no
`next build` ever ran. `wrangler deploy` then looked for a folder of static
files or a plain Worker script and found neither (a Next.js app is neither),
hence: *"Could not detect a directory containing static files."* The project
was set up as a bare Wrangler deploy with no build step in front of it.

### How to fix it in the Cloudflare dashboard

Go to **Workers & Pages → your project → Settings → Build**, and set:

| Field | Value |
|---|---|
| Build command | `npm run build:cf` *(add this script — see below)* |
| Deploy command | `npx wrangler deploy` |

Add this one convenience script to `package.json` so the dashboard's separate
Build/Deploy fields map cleanly onto the adapter (the `deploy` script above
already does build+deploy together for local use, but the dashboard runs Build
and Deploy as two distinct steps):

```json
"build:cf": "next build && opennextjs-cloudflare build"
```

Alternatively, simplest possible fix: leave **Build command** empty and set
**Deploy command** to `npm run deploy` — that single script builds Next.js,
runs the OpenNext transform, and deploys, all in one go.

Either way, install the new dependencies first:

```bash
npm install
```

This pulled in `@opennextjs/cloudflare` and `wrangler`, and bumped Next.js to
`15.5.21` / React to `19.1.0` — OpenNext's adapter requires Next.js ≥15.5.21
(the project was on 14.2.x before, which the adapter doesn't support).

### One thing to watch for

`next/font` (Fraunces/Sora/IBM Plex Mono) fetches from `fonts.googleapis.com`
at build time. This sandbox's network is locked to an allowlist that excludes
that domain, so I could only verify the build up to the font-fetch step here
— everything before it (dependency resolution, TypeScript, Next 15 migration)
checked out clean. Cloudflare's own build servers have normal outbound internet
access, so this should build through completely there. If it doesn't, the fix
is to self-host the font files locally instead of pulling from Google Fonts —
say the word and I'll switch it over.

## Suggested next phases

1. **Phase 2**: Academy course data (needs real curriculum/pricing from you), Gallery,
   Testimonials, Blog — same "DB + local fallback" pattern as Services.
2. **Phase 3**: Admin dashboard (auth-gated CRUD over every table above).
3. **Phase 4**: Customer/Student dashboards, product store, deployment to Cloudflare Pages.

This keeps the architecture, schema, and design system from this phase unchanged, per
the project spec.


## Academy Phase 2 — resources, private files and online applications

This build adds:

- `/academy/[course-slug]` course detail pages with syllabus, eligibility, certification and career outcomes.
- `/academy/apply` online course applications with a course selector.
- `/academy/resources` authenticated resource library.
- Student dashboard resource library and application status.
- Admin **Academy Resources** manager for Google Drive/storage links, notices, images, syllabus files, visibility and download-button control.
- Admin **Course Applications** workflow for reviewing and approving/rejecting applicants.
- Course editor support for detailed syllabus/curriculum (`Module | Topic 1, Topic 2`), eligibility, certification and career opportunities.
- RLS rules for public, enrolled students, explicitly approved users and staff-only resources.

### Database setup

For an existing Supabase database, run:

`supabase/migrations/20260814_academy_resources_and_applications.sql`

Do **not** rerun the old `schema.sql` against an already-populated database just to install this phase. The migration is designed for an existing project and uses idempotent table/index/policy/trigger statements.

For Google Drive resources, paste the share URL into **Admin → Academy Resources**. The app controls who can see the resource and whether the app displays an Open/Download button. Google Drive itself must still have the correct sharing permission; hiding the button cannot revoke a previously shared Google Drive file.

### Course syllabus format

In **Admin → Courses**, enter one module per line:

`Module name | Topic 1, Topic 2, Topic 3`

When the academy Word syllabus is supplied, convert its actual headings/topics into this field rather than inventing curriculum content.
