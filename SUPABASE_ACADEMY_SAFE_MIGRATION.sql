-- ============================================================
-- NATURAL BEAUTY ACADEMY — SAFE, IDEMPOTENT ACADEMY UPGRADE
-- Run this file ONCE in the existing Supabase project's SQL Editor.
--
-- IMPORTANT:
-- * It does NOT drop existing tables.
-- * It does NOT delete existing rows.
-- * It does NOT replace the existing schema.sql.
-- * It only creates/extends Academy resource/application structures.
-- * Safe to re-run if it was already partially applied.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Academy resources
-- ------------------------------------------------------------
create table if not exists public.academy_resources (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  description text,
  resource_type text not null default 'file'
    check (resource_type in ('file','notice','syllabus','link','image')),
  file_name text,
  mime_type text,
  file_size bigint,
  storage_path text,
  storage_url text,
  google_drive_url text,
  download_enabled boolean not null default true,
  access_level text not null default 'students'
    check (access_level in ('public','students','approved','staff')),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.academy_resources
  add column if not exists storage_path text;

alter table public.academy_resources
  add column if not exists storage_url text;

alter table public.academy_resources
  add column if not exists google_drive_url text;

alter table public.academy_resources
  add column if not exists download_enabled boolean not null default true;

alter table public.academy_resources
  add column if not exists access_level text not null default 'students';

alter table public.academy_resources
  add column if not exists is_active boolean not null default true;

alter table public.academy_resources
  add column if not exists display_order integer not null default 0;

alter table public.academy_resources
  add column if not exists updated_at timestamptz not null default now();

-- Older versions required storage_url OR google_drive_url.
-- Replace that check with one that also permits private Supabase Storage.
alter table public.academy_resources
  drop constraint if exists academy_resources_storage_url_or_google_drive_url_check;

alter table public.academy_resources
  drop constraint if exists academy_resources_resource_location_check;

alter table public.academy_resources
  add constraint academy_resources_resource_location_check
  check (
    storage_path is not null
    or storage_url is not null
    or google_drive_url is not null
  );

-- ------------------------------------------------------------
-- 2. Explicit access grants for approved users
-- ------------------------------------------------------------
create table if not exists public.academy_resource_access (
  resource_id uuid not null references public.academy_resources(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  granted_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (resource_id, user_id)
);

-- ------------------------------------------------------------
-- 3. Online course applications
-- ------------------------------------------------------------
create table if not exists public.course_applications (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete restrict,
  applicant_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text,
  preferred_batch text,
  previous_experience text,
  message text,
  status text not null default 'pending'
    check (status in ('pending','reviewing','approved','rejected','waitlisted','enrolled')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. Safely link existing students to their Supabase profile
-- ------------------------------------------------------------
alter table public.students
  add column if not exists profile_id uuid
  references public.profiles(id) on delete set null;

create index if not exists idx_academy_resources_course
  on public.academy_resources(course_id, is_active, display_order);

create index if not exists idx_academy_resources_access
  on public.academy_resource_access(user_id, resource_id);

create index if not exists idx_course_applications_course_status
  on public.course_applications(course_id, status, created_at desc);

create index if not exists idx_students_profile
  on public.students(profile_id);

-- ------------------------------------------------------------
-- 5. RLS for Academy tables
-- ------------------------------------------------------------
alter table public.academy_resources enable row level security;
alter table public.academy_resource_access enable row level security;
alter table public.course_applications enable row level security;

drop policy if exists "academy resources readable by allowed users" on public.academy_resources;
create policy "academy resources readable by allowed users"
on public.academy_resources
for select
using (
  is_active = true
  and (
    access_level = 'public'

    or (
      access_level = 'students'
      and exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'student'
          and p.is_active = true
      )
      and (
        course_id is null
        or exists (
          select 1
          from public.students s
          where s.profile_id = auth.uid()
            and s.course_id = academy_resources.course_id
            and s.status in ('enrolled','active','completed')
        )
        or exists (
          select 1
          from public.course_applications ca
          where ca.applicant_user_id = auth.uid()
            and ca.course_id = academy_resources.course_id
            and ca.status = 'enrolled'
        )
      )
    )

    or (
      access_level = 'approved'
      and exists (
        select 1
        from public.academy_resource_access a
        where a.resource_id = academy_resources.id
          and a.user_id = auth.uid()
          and (a.expires_at is null or a.expires_at > now())
      )
    )

    or is_staff_or_above()
  )
);

drop policy if exists "staff manage academy resources" on public.academy_resources;
create policy "staff manage academy resources"
on public.academy_resources
for all
using (is_staff_or_above())
with check (is_staff_or_above());

drop policy if exists "users read own academy access" on public.academy_resource_access;
create policy "users read own academy access"
on public.academy_resource_access
for select
using (user_id = auth.uid() or is_staff_or_above());

drop policy if exists "staff manage academy resource access" on public.academy_resource_access;
create policy "staff manage academy resource access"
on public.academy_resource_access
for all
using (is_staff_or_above())
with check (is_staff_or_above());

drop policy if exists "public submit course applications" on public.course_applications;
create policy "public submit course applications"
on public.course_applications
for insert
with check (
  exists (
    select 1
    from public.courses c
    where c.id = course_applications.course_id
      and c.is_active = true
  )
);

drop policy if exists "users read own course applications" on public.course_applications;
create policy "users read own course applications"
on public.course_applications
for select
using (applicant_user_id = auth.uid() or is_staff_or_above());

drop policy if exists "staff manage course applications" on public.course_applications;
create policy "staff manage course applications"
on public.course_applications
for all
using (is_staff_or_above())
with check (is_staff_or_above());

-- ------------------------------------------------------------
-- 6. Timestamp/application safety triggers
-- ------------------------------------------------------------
create or replace function public.set_academy_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists academy_resources_updated_at on public.academy_resources;
create trigger academy_resources_updated_at
before update on public.academy_resources
for each row execute function public.set_academy_updated_at();

drop trigger if exists course_applications_updated_at on public.course_applications;
create trigger course_applications_updated_at
before update on public.course_applications
for each row execute function public.set_academy_updated_at();

create or replace function public.normalize_course_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    new.applicant_user_id = auth.uid();
  else
    new.applicant_user_id = null;
  end if;

  new.status = 'pending';
  new.admin_notes = null;
  return new;
end;
$$;

drop trigger if exists normalize_course_application_before_insert on public.course_applications;
create trigger normalize_course_application_before_insert
before insert on public.course_applications
for each row execute function public.normalize_course_application();

-- ------------------------------------------------------------
-- 7. Private Supabase Storage bucket for Academy files
-- ------------------------------------------------------------
-- The user already created this empty bucket. If it exists, nothing changes.
insert into storage.buckets (id, name, public, file_size_limit)
select 'krish', 'krish', false, 31457280
where not exists (
  select 1 from storage.buckets where id = 'krish'
);

-- Storage policies are scoped ONLY to bucket "krish".
-- They do not change Storage permissions for other buckets.
drop policy if exists "academy krish staff upload" on storage.objects;
create policy "academy krish staff upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'krish'
  and is_staff_or_above()
);

drop policy if exists "academy krish allowed read" on storage.objects;
create policy "academy krish allowed read"
on storage.objects
for select
to public
using (
  bucket_id = 'krish'
  and exists (
    select 1
    from public.academy_resources ar
    where ar.storage_path = storage.objects.name
  )
);

drop policy if exists "academy krish staff delete" on storage.objects;
create policy "academy krish staff delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'krish'
  and is_staff_or_above()
);

commit;

-- ------------------------------------------------------------
-- 8. Verification
-- ------------------------------------------------------------
select 'academy_resources' as item, count(*)::bigint as count
from public.academy_resources
union all
select 'academy_resource_access', count(*)::bigint
from public.academy_resource_access
union all
select 'course_applications', count(*)::bigint
from public.course_applications
union all
select 'courses', count(*)::bigint
from public.courses
union all
select 'students', count(*)::bigint
from public.students;
