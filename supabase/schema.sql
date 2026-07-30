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
  gallery text[] default '{}',
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

alter table service_brands enable row level security;
create policy "public read service_brands" on service_brands for select using (true);

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

alter table service_related enable row level security;
create policy "public read service_related" on service_related for select using (true);

-- ------------------------------------------------------------
-- ACADEMY / COURSES
-- ------------------------------------------------------------
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  category text, -- e.g. 'Beauty & Skin Care', 'Makeup', 'Hair Care', 'Nail Technology'
  level text, -- e.g. 'Beginner', 'Intermediate', 'Advanced', 'Professional'
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
-- COURSE BATCHES (Admin scheduling — no public UI yet; this table
-- is the data model for the future Admin Dashboard "Batch Management"
-- screen. Not exposed via any public RLS read policy.)
-- ------------------------------------------------------------
create table if not exists course_batches (
  id uuid primary key default uuid_generate_v4(),
  batch_name text not null, -- e.g. "Beautician Batch 2026-A"
  course_id uuid not null references courses(id) on delete restrict,
  course_fee numeric(10,2) not null, -- auto-filled from courses.price, editable
  registration_fee numeric(10,2) default 0,
  discount numeric(10,2) default 0,
  -- remaining_balance is computed in application code as:
  -- course_fee - discount  (registration_fee tracked separately as a deposit)
  start_date date,
  end_date date,
  class_schedule text, -- 'Morning' | 'Day' | 'Evening'
  trainer text,
  total_students int not null default 0,
  max_capacity int not null default 20,
  classroom text,
  status text not null default 'upcoming' check (status in ('upcoming','running','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
alter table course_batches enable row level security; -- no public policy: admin/service-role access only

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

-- ================================================================
-- ADMIN SYSTEM — Phase 1
-- Auth, roles, and the operational tables the admin dashboard uses.
-- ================================================================

-- ------------------------------------------------------------
-- PROFILES / ROLES
-- One row per Supabase Auth user. Created automatically via trigger
-- below on signup, defaulting to 'guest'. Promote real staff to
-- their role directly in the Supabase table editor (no self-serve
-- role escalation from the app).
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text not null default 'guest' check (role in
    ('owner','director','manager','receptionist','trainer','staff','student','guest')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new Supabase Auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'guest');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper: is the current authenticated user staff-or-above (i.e. has
-- an admin-dashboard role, not 'student' or 'guest')? Used throughout
-- the RLS policies below instead of repeating the same subquery.
create or replace function public.is_staff_or_above()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('owner','director','manager','receptionist','trainer','staff')
    and is_active = true
  );
$$ language sql security definer stable;

create or replace function public.is_owner_or_director()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('owner','director')
    and is_active = true
  );
$$ language sql security definer stable;

alter table profiles enable row level security;
create policy "users read own profile" on profiles for select using (auth.uid() = id);
create policy "staff read all profiles" on profiles for select using (is_staff_or_above());
create policy "users update own profile" on profiles for update using (auth.uid() = id);
create policy "owner/director manage profiles" on profiles for all using (is_owner_or_director());

-- ------------------------------------------------------------
-- STAFF (attendance, leave, salary — separate from auth profile)
-- ------------------------------------------------------------
create table if not exists staff_records (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete set null,
  position text,
  salary numeric(10,2),
  joined_date date,
  is_active boolean not null default true
);

create table if not exists staff_attendance (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid not null references staff_records(id) on delete cascade,
  date date not null,
  status text not null check (status in ('present','absent','half_day','leave')),
  notes text,
  unique (staff_id, date)
);

-- ------------------------------------------------------------
-- PRODUCTS
-- Simple product ordering (not a full inventory/ERP system — no
-- SKU, barcode, batch, expiry, supplier, or purchase tracking).
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  category text not null check (category in
    ('Casmara', 'Lotus Professional', 'Paese', 'The Purest', 'Farmona', 'Homecare product', 'Others')),
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  stock_quantity int not null default 0,
  suitable_for text,
  ingredients text,
  description text,
  image_url text,
  gallery_urls text[] default '{}',
  is_active boolean not null default true, -- publish/hide
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_products_name on products using gin (to_tsvector('english', name));

alter table products enable row level security;
create policy "public read active products" on products for select using (is_active = true);

-- ------------------------------------------------------------
-- ORDERS (no payment gateway — cash on delivery, confirmed by phone)
-- ------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null default ('NB-' || to_char(now(), 'YYMMDD') || '-' || lpad((floor(random() * 10000))::text, 4, '0')),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  notes text,
  total_price numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in
    ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null, -- snapshot, survives product edits/deletion
  unit_price numeric(10,2) not null, -- snapshot of price at order time
  quantity int not null check (quantity > 0)
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_order_items_order on order_items(order_id);

alter table orders enable row level security;
alter table order_items enable row level security;
create policy "public can place orders" on orders for insert with check (true);
create policy "public can add order items" on order_items for insert with check (true);

-- Auto-generate a notification when a new order comes in (same
-- pattern as appointments/messages/reviews above).
create or replace function public.notify_new_order()
returns trigger as $$
begin
  insert into public.notifications (type, title, body)
  values ('system', 'New product order: ' || new.order_number, new.customer_name || ' — Rs. ' || new.total_price);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_created on orders;
create trigger on_order_created
  after insert on orders
  for each row execute procedure public.notify_new_order();

-- ------------------------------------------------------------
-- CERTIFICATES (issued to students on course completion)
-- ------------------------------------------------------------
create table if not exists certificates (
  id uuid primary key default uuid_generate_v4(),
  student_profile_id uuid references profiles(id) on delete set null,
  course_id uuid references courses(id) on delete set null,
  certificate_number text unique not null,
  issued_date date not null default current_date,
  file_url text
);

-- ------------------------------------------------------------
-- MESSAGES (internal admin inbox — e.g. contact-page inquiries)
-- ------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender_name text,
  sender_email text,
  sender_phone text,
  subject text,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- NOTIFICATIONS (admin notification center)
-- ------------------------------------------------------------
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('appointment','enrollment','review','system')),
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- AUDIT LOGS
-- ------------------------------------------------------------
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_profile_id uuid references profiles(id) on delete set null,
  action text not null,
  table_name text,
  record_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- RLS — admin (staff-or-above) full access; no public policies.
-- ------------------------------------------------------------
alter table staff_records enable row level security;
alter table staff_attendance enable row level security;
alter table certificates enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

create policy "staff manage staff_records" on staff_records for all using (is_staff_or_above());
create policy "staff manage staff_attendance" on staff_attendance for all using (is_staff_or_above());
create policy "staff manage certificates" on certificates for all using (is_staff_or_above());
create policy "students read own certificates" on certificates for select using (student_profile_id = auth.uid());
create policy "public insert messages" on messages for insert with check (true);
create policy "staff manage messages" on messages for all using (is_staff_or_above());
create policy "staff manage notifications" on notifications for all using (is_staff_or_above());
create policy "staff read audit_logs" on audit_logs for select using (is_staff_or_above());
create policy "staff insert audit_logs" on audit_logs for insert with check (is_staff_or_above());

-- ------------------------------------------------------------
-- Admin write access on existing public-read tables (appointments,
-- courses, course_batches, services, categories, team, gallery, blog,
-- faqs, testimonials, site_settings). Public policies above already
-- allow reads; these add staff-or-above write access.
-- ------------------------------------------------------------
create policy "staff manage appointments" on appointments for all using (is_staff_or_above());
create policy "staff manage courses" on courses for all using (is_staff_or_above());
create policy "staff manage course_batches" on course_batches for all using (is_staff_or_above());
create policy "staff manage services" on services for all using (is_staff_or_above());
create policy "staff manage service_categories" on service_categories for all using (is_staff_or_above());
create policy "staff manage service_brands" on service_brands for all using (is_staff_or_above());
create policy "staff manage service_related" on service_related for all using (is_staff_or_above());
create policy "staff manage products" on products for all using (is_staff_or_above());
create policy "staff manage orders" on orders for all using (is_staff_or_above());
create policy "staff manage order_items" on order_items for all using (is_staff_or_above());
create policy "staff manage team_members" on team_members for all using (is_staff_or_above());
create policy "staff manage gallery_images" on gallery_images for all using (is_staff_or_above());
create policy "staff manage blog_posts" on blog_posts for all using (is_staff_or_above());
create policy "staff manage faqs" on faqs for all using (is_staff_or_above());
create policy "staff manage testimonials" on testimonials for all using (is_staff_or_above());
create policy "staff manage site_settings" on site_settings for all using (is_staff_or_above());

-- ------------------------------------------------------------
-- NOTIFICATION TRIGGERS
-- Auto-populate the notifications table (shown in the admin
-- Notification Center) whenever a customer-facing action happens.
-- ------------------------------------------------------------
create or replace function public.notify_new_appointment()
returns trigger as $$
begin
  insert into public.notifications (type, title, body)
  values ('appointment', 'New appointment booked', new.customer_name || ' — ' || new.appointment_date || ' ' || new.appointment_time);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_appointment_created on appointments;
create trigger on_appointment_created
  after insert on appointments
  for each row execute procedure public.notify_new_appointment();

create or replace function public.notify_new_message()
returns trigger as $$
begin
  insert into public.notifications (type, title, body)
  values ('system', 'New contact message', coalesce(new.sender_name, 'Someone') || ': ' || coalesce(new.subject, left(coalesce(new.body, ''), 60)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_message_created on messages;
create trigger on_message_created
  after insert on messages
  for each row execute procedure public.notify_new_message();

create or replace function public.notify_new_review()
returns trigger as $$
begin
  insert into public.notifications (type, title, body)
  values ('review', 'New customer review', new.customer_name || ' left a ' || new.rating || '-star review');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_created on testimonials;
create trigger on_review_created
  after insert on testimonials
  for each row execute procedure public.notify_new_review();

-- ------------------------------------------------------------
-- STUDENTS (enrollment records only — not linked to auth/portal)
-- ------------------------------------------------------------
create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  photo_url text,
  name text not null,
  gender text check (gender in ('female','male','other','prefer_not_to_say')),
  phone text,
  email text,
  address text,
  course_id uuid references courses(id) on delete set null,
  enrollment_date date not null default current_date,
  status text not null default 'enrolled' check (status in ('enrolled','active','completed','dropped')),
  guardian_name text,
  emergency_contact text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table students enable row level security;
create policy "staff manage students" on students for all using (is_staff_or_above());
