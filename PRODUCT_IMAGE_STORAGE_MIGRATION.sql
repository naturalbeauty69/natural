-- Safe product-image Storage setup.
-- This does NOT touch public.products or existing GitHub-served product images.
-- It creates a PUBLIC bucket named "products" for NEW imported product images
-- and restricts uploads/updates/deletes to staff using the existing role helper.

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id)
do update set public = true;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'staff upload product images'
  ) then
    create policy "staff upload product images"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'products'
        and public.is_staff_or_above()
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'staff update product images'
  ) then
    create policy "staff update product images"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'products'
        and public.is_staff_or_above()
      )
      with check (
        bucket_id = 'products'
        and public.is_staff_or_above()
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'staff delete product images'
  ) then
    create policy "staff delete product images"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'products'
        and public.is_staff_or_above()
      );
  end if;
end
$$;
