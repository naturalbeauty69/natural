-- Safe idempotent product-image Storage policy repair.
-- This touches ONLY the "products" Storage bucket policies.
-- It does not modify public.products or existing product image URLs.

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

drop policy if exists "staff upload product images" on storage.objects;
drop policy if exists "staff update product images" on storage.objects;
drop policy if exists "staff delete product images" on storage.objects;

create policy "staff upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'products'
  and public.is_staff_or_above()
);

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

create policy "staff delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'products'
  and public.is_staff_or_above()
);
