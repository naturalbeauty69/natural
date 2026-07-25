-- ============================================================
-- SEED DATA — Official Service Menu & Pricing
-- Source: company-provided pricing sheet. These are the exact
-- NPR figures from the brief. Admin can edit every field below
-- from the dashboard after go-live — nothing here is hardcoded
-- into the frontend.
-- ============================================================

-- ---------- CATEGORIES ----------
insert into service_categories (slug, name, display_order) values
  ('skin-treatments', 'Skin Treatments', 1),
  ('threading', 'Threading', 2),
  ('waxing', 'Waxing', 3),
  ('hair-services', 'Hair Services', 4),
  ('hair-treatments', 'Hair Treatments', 5),
  ('manicure-pedicure', 'Manicure & Pedicure', 6),
  ('makeup', 'Makeup', 7),
  ('nail-services', 'Nail Services', 8)
on conflict (slug) do nothing;

-- ---------- BRANDS (skin treatments use brand lines) ----------
insert into service_brands (name) values ('LOTUS'), ('CASMARA'), ('O3+'), ('EAR PASTING')
on conflict (name) do nothing;

-- ---------- SKIN TREATMENTS ----------
insert into services (category_id, brand_id, slug, name, price_min, price_max, display_order)
select c.id, b.id, s.slug, s.name, s.price_min, s.price_max, s.ord
from (values
  ('LOTUS', 'lotus-normal-facial', 'Normal Facial', 1800, null, 1),
  ('LOTUS', 'lotus-advance-facial', 'Advance Facial', 3500, null, 2),
  ('LOTUS', 'lotus-premium-facial', 'Premium Facial', 5500, null, 3),
  ('CASMARA', 'casmara-normal-facial', 'Normal Facial', 3500, null, 4),
  ('CASMARA', 'casmara-premium-facial', 'Premium Facial', 6000, null, 5),
  ('O3+', 'o3-cleansing-facial', 'Cleansing Facial', 2500, null, 6),
  ('O3+', 'o3-advance-facial', 'Advance Facial', 4500, null, 7),
  ('O3+', 'o3-premium-facial', 'Premium Facial', 5500, null, 8),
  ('EAR PASTING', 'ear-pasting', 'Ear Pasting', 3500, null, 9)
) as s(brand_name, slug, name, price_min, price_max, ord)
join service_brands b on b.name = s.brand_name
join service_categories c on c.slug = 'skin-treatments'
on conflict (slug) do nothing;

-- ---------- THREADING ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('eyebrow-threading', 'Eyebrow Threading', 100, null, 1),
  ('full-face-threading', 'Full Face Threading', 250, null, 2)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'threading'
on conflict (slug) do nothing;

-- ---------- WAXING ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('underarm-wax', 'Underarm Wax', 250, null, 1),
  ('hand-wax', 'Hand Wax', 500, 700, 2),
  ('full-leg-wax', 'Full Leg Wax', 700, 1500, 3),
  ('full-body-wax-polishing', 'Full Body Wax with Body Polishing', 5000, null, 4)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'waxing'
on conflict (slug) do nothing;

-- ---------- HAIR SERVICES ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('hair-cut', 'Hair Cut', 700, null, 1),
  ('hair-styling', 'Hair Styling', 500, 2500, 2),
  ('root-touch-up', 'Root Touch Up (As Per Brand)', 1500, null, 3),
  ('pre-lightening-highlight', 'Pre-Lightening / Highlight', 5500, 6500, 4),
  ('balayage', 'Balayage', 6500, 8500, 5),
  ('ombre', 'Ombre', 4500, 5500, 6),
  ('hair-oiling', 'Hair Oiling', 800, null, 7)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'hair-services'
on conflict (slug) do nothing;

-- ---------- HAIR TREATMENTS ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('hair-treatment-spa', 'Hair Treatment / Hair Spa', 1200, 2500, 1),
  ('hair-keratin', 'Hair Keratin', 3500, 7000, 2),
  ('hair-botox', 'Hair Botox', 3500, 10000, 3),
  ('nanoplastia', 'Nanoplastia', 3500, 10000, 4)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'hair-treatments'
on conflict (slug) do nothing;

-- ---------- MANICURE & PEDICURE ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('normal-mani-pedi', 'Normal Manicure / Pedicure', 1500, null, 1),
  ('advance-mani-pedi', 'Advance Manicure / Pedicure', 2500, null, 2),
  ('deluxe-mani-pedi', 'Deluxe Manicure / Pedicure', 3500, null, 3)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'manicure-pedicure'
on conflict (slug) do nothing;

-- ---------- MAKEUP ----------
insert into services (category_id, slug, name, price_min, price_max, is_featured, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.featured, s.ord from (values
  ('bridal-makeup', 'Bridal Makeup', 12000, 25000, true, 1),
  ('day-makeup', 'Day Makeup', 2500, 3500, false, 2),
  ('party-night-makeup', 'Party / Night Makeup', 2500, 3500, false, 3)
) as s(slug, name, price_min, price_max, featured, ord)
join service_categories c on c.slug = 'makeup'
on conflict (slug) do nothing;

-- ---------- NAIL SERVICES ----------
insert into services (category_id, slug, name, price_min, price_max, show_starting_from, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.starting, s.ord from (values
  ('gel-polish', 'Gel Polish', 1000, null, true, 1),
  ('gel-overlay', 'Gel Overlay', 1300, null, false, 2),
  ('nail-refill', 'Nail Refill', 1300, null, false, 3),
  ('nail-extension', 'Nail Extension', 1500, null, false, 4),
  ('nail-removal', 'Nail Removal', 500, null, false, 5),
  ('toe-nail-extension', 'Toe Nail Extension', 1600, 2500, false, 6)
) as s(slug, name, price_min, price_max, starting, ord)
join service_categories c on c.slug = 'nail-services'
on conflict (slug) do nothing;

-- ---------- TEAM ----------
insert into team_members (slug, name, role, bio, photo_url, display_order) values
  ('archana-silwal-kadel', 'Archana Silwal Kadel', 'Owner & Director',
   'Founder, Owner, and Director of Natural Beauty Clinic & Academy. Leads the clinic and academy with a commitment to professional beauty services, advanced skincare, client satisfaction, staff development, and high-quality beauty education while maintaining excellent service standards.',
   '/images/team/archana-silwal-kadel.jpg', 1),
  ('krishna-gurung', 'Krishna Gurung', 'Accountant & Manager',
   'Responsible for accounting, financial management, inventory control, supplier coordination, customer service, daily business operations, administration, and ensuring the smooth operation of the clinic and academy.',
   '/images/team/krishna-gurung.jpg', 2),
  ('sandip-thakur', 'Sandip Thakur', 'Hairdresser',
   'Professional Hairdresser specializing in modern haircuts, hairstyling, hair coloring, hair spa, hair treatments, and personalized grooming services. Dedicated to helping clients achieve healthy, stylish, and confident looks.',
   '/images/team/sandip-thakur.jpg', 3),
  ('asmita-bista', 'Asmita Bista', 'Assistant Beautician',
   'Assists senior beauticians with skincare treatments, facials, beauty therapies, client preparation, hygiene standards, salon organization, and customer care while helping deliver professional beauty services.',
   '/images/team/asmita-bista.jpg', 4),
  ('aasha-limbu', 'Aasha Limbu', 'Nail Technician',
   'Professional Nail Technician specializing in manicure, pedicure, nail extensions, gel polish, nail art, and complete nail care. Committed to providing hygienic, elegant, and long-lasting nail services.',
   '/images/team/aasha-limbu.jpg', 5),
  ('susmita-gautam', 'Susmita Gautam', 'Office Helper',
   'Supports daily office operations by maintaining cleanliness, organizing supplies, assisting staff, welcoming clients, preparing work areas, and helping ensure smooth day-to-day operations within the clinic and academy.',
   '/images/team/susmita-gautam.jpg', 6)
on conflict (slug) do nothing;

-- ---------- SITE SETTINGS ----------
insert into site_settings (key, value) values
  ('contact', '{
    "phones": ["9843805588", "9823207031"],
    "whatsapp": "+9779843805588",
    "email": "archanabeauty07@gmail.com",
    "address": "New Baneshwor, Kathmandu, Nepal — Opposite to the Overhead Bridge",
    "tiktok": "@naturalbeautyclinic5",
    "esewa": "9843805588"
  }'),
  ('hero', '{
    "tagline": "Professional Beauty, Skin & Hair Care | Training & Certification",
    "headline": "Nepal''s premium destination for scientific beauty care and professional training."
  }')
on conflict (key) do update set value = excluded.value, updated_at = now();
