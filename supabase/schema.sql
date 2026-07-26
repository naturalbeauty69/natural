-- ============================================================
-- NATURAL BEAUTY CLINIC & ACADEMY — DATABASE SCHEMA (Phase 1)
-- Target: Supabase (PostgreSQL)
-- Everything price/content-related is data-driven. No prices,
-- team bios, or service copy should ever be hardcoded in the
-- frontend — the app reads all of this from these tables.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- TEAM
-- ------------------------------------------------------------
create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  role text not null,
  bio text not null,
  photo_url text not null,
  specialization text,
  experience_years int,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SERVICES
-- ------------------------------------------------------------
create table if not exists service_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  display_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists service_brands (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references service_categories(id) on delete restrict,
  brand_id uuid references service_brands(id) on delete set null,
  slug text unique not null,
  name text not null,
  description text,
  duration_minutes int,
  price_min numeric(10,2) not null,
  price_max numeric(10,2), -- null = single fixed price (use price_min)
  discount_price numeric(10,2),
  offer_price numeric(10,2),
  offer_starts_at timestamptz,
  offer_ends_at timestamptz,
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_price_hidden boolean not null default false, -- "Enquire for price"
  show_starting_from boolean not null default false,
  image_url text,
  gallery_urls text[] default '{}',
  before_after_urls jsonb default '[]', -- [{ "before": "...", "after": "..." }]
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_faqs (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid not null references services(id) on delete cascade,
  question text not null,
  answer text not null,
  display_order int not null default 0
);

create table if not exists service_related (
  service_id uuid not null references services(id) on delete cascade,
  related_service_id uuid not null references services(id) on delete cascade,
  primary key (service_id, related_service_id)
);

-- ------------------------------------------------------------
-- ACADEMY / COURSES
-- ------------------------------------------------------------
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  summary text,
  description text,
  duration text,
  eligibility text,
  curriculum jsonb default '[]', -- [{ "module": "...", "topics": ["...","..."] }]
  price numeric(10,2),
  certification_name text,
  career_opportunities text[],
  image_url text,
  is_active boolean not null default true,
  display_order int not null default 0
);

-- ------------------------------------------------------------
-- APPOINTMENTS
-- ------------------------------------------------------------
create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  email text,
  service_id uuid references services(id),
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled','rescheduled')),
  notes text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- GALLERY
-- ------------------------------------------------------------
create table if not exists gallery_images (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  category text not null check (category in
    ('hair','skin','clinic','training','students','bridal','nails','threading','waxing','certificates','events','before_after')),
  caption text,
  display_order int not null default 0,
  is_active boolean not null default true
);

-- ------------------------------------------------------------
-- BLOG
-- ------------------------------------------------------------
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  cover_image_caption text, -- used until a real cover_image_url is uploaded
  cover_image_url text,
  content text not null,
  category text,
  author text default 'Archana Silwal Kadel',
  seo_keywords text[] default '{}',
  published_at date not null default current_date,
  is_active boolean not null default true,
  display_order int not null default 0
);

-- ------------------------------------------------------------
-- FAQ (site-wide, distinct from per-service FAQs above)
-- ------------------------------------------------------------
create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_active boolean not null default true
);

-- ------------------------------------------------------------
-- TESTIMONIALS
-- ------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  location text,
  rating int not null check (rating between 1 and 5),
  content text not null,
  source text default 'website' check (source in ('website','google','tiktok')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SITE SETTINGS (lightweight CMS key/value for homepage, footer, SEO)
-- ------------------------------------------------------------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY — public can read active/published content only.
-- Writes are restricted to the service role (admin dashboard uses
-- the service key server-side, never exposed to the browser).
-- ------------------------------------------------------------
alter table team_members enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table service_faqs enable row level security;
alter table courses enable row level security;
alter table gallery_images enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;
alter table blog_posts enable row level security;
alter table faqs enable row level security;

create policy "public read active team" on team_members for select using (is_active = true);
create policy "public read active categories" on service_categories for select using (is_active = true);
create policy "public read active services" on services for select using (is_active = true);
create policy "public read faqs" on service_faqs for select using (true);
create policy "public read active courses" on courses for select using (is_active = true);
create policy "public read active gallery" on gallery_images for select using (is_active = true);
create policy "public read featured testimonials" on testimonials for select using (true);
create policy "public read settings" on site_settings for select using (true);
create policy "public read active blog posts" on blog_posts for select using (is_active = true);
create policy "public read active site faqs" on faqs for select using (is_active = true);

-- appointments: insert-only from public (booking form), no public read
alter table appointments enable row level security;
create policy "public can book" on appointments for insert with check (true);
