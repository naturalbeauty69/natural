-- Optional, safe in-app notification enhancement.
-- Appointment notifications already exist in the main schema.
-- This adds a notification when a course application is submitted.
-- It does NOT send email; your project does not currently show an
-- external email provider configuration.

create or replace function public.notify_new_course_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (type, title, body)
  values (
    'enrollment',
    'New course application',
    coalesce(new.full_name, 'Someone')
      || ' applied for course '
      || coalesce((select c.name from public.courses c where c.id = new.course_id), 'Unknown course')
  );
  return new;
end;
$$;

drop trigger if exists on_course_application_created on public.course_applications;

create trigger on_course_application_created
after insert on public.course_applications
for each row
execute procedure public.notify_new_course_application();
