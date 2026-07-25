import { Service, ServiceCategory } from "@/lib/types";

// Mirrors supabase/seed.sql. This file is ONLY a local fallback so
// the site renders real pricing before Supabase is connected — once
// NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are set, lib/get-data.ts reads
// from the `services` table instead, and admins edit prices there.

export const serviceCategories: ServiceCategory[] = [
  { slug: "skin-treatments", name: "Skin Treatments", display_order: 1 },
  { slug: "threading", name: "Threading", display_order: 2 },
  { slug: "waxing", name: "Waxing", display_order: 3 },
  { slug: "hair-services", name: "Hair Services", display_order: 4 },
  { slug: "hair-treatments", name: "Hair Treatments", display_order: 5 },
  { slug: "manicure-pedicure", name: "Manicure & Pedicure", display_order: 6 },
  { slug: "makeup", name: "Makeup", display_order: 7 },
  { slug: "nail-services", name: "Nail Services", display_order: 8 },
];

export const services: Service[] = [
  // SKIN TREATMENTS
  { category_slug: "skin-treatments", brand_name: "LOTUS", slug: "lotus-normal-facial", name: "Normal Facial", price_min: 1800, display_order: 1 },
  { category_slug: "skin-treatments", brand_name: "LOTUS", slug: "lotus-advance-facial", name: "Advance Facial", price_min: 3500, display_order: 2 },
  { category_slug: "skin-treatments", brand_name: "LOTUS", slug: "lotus-premium-facial", name: "Premium Facial", price_min: 5500, display_order: 3 },
  { category_slug: "skin-treatments", brand_name: "CASMARA", slug: "casmara-normal-facial", name: "Normal Facial", price_min: 3500, display_order: 4 },
  { category_slug: "skin-treatments", brand_name: "CASMARA", slug: "casmara-premium-facial", name: "Premium Facial", price_min: 6000, display_order: 5 },
  { category_slug: "skin-treatments", brand_name: "O3+", slug: "o3-cleansing-facial", name: "Cleansing Facial", price_min: 2500, display_order: 6 },
  { category_slug: "skin-treatments", brand_name: "O3+", slug: "o3-advance-facial", name: "Advance Facial", price_min: 4500, display_order: 7 },
  { category_slug: "skin-treatments", brand_name: "O3+", slug: "o3-premium-facial", name: "Premium Facial", price_min: 5500, display_order: 8 },
  { category_slug: "skin-treatments", brand_name: "EAR PASTING", slug: "ear-pasting", name: "Ear Pasting", price_min: 3500, display_order: 9 },

  // THREADING
  { category_slug: "threading", slug: "eyebrow-threading", name: "Eyebrow Threading", price_min: 100, display_order: 1 },
  { category_slug: "threading", slug: "full-face-threading", name: "Full Face Threading", price_min: 250, display_order: 2 },

  // WAXING
  { category_slug: "waxing", slug: "underarm-wax", name: "Underarm Wax", price_min: 250, display_order: 1 },
  { category_slug: "waxing", slug: "hand-wax", name: "Hand Wax", price_min: 500, price_max: 700, display_order: 2 },
  { category_slug: "waxing", slug: "full-leg-wax", name: "Full Leg Wax", price_min: 700, price_max: 1500, display_order: 3 },
  { category_slug: "waxing", slug: "full-body-wax-polishing", name: "Full Body Wax with Body Polishing", price_min: 5000, display_order: 4 },

  // HAIR SERVICES
  { category_slug: "hair-services", slug: "hair-cut", name: "Hair Cut", price_min: 700, display_order: 1 },
  { category_slug: "hair-services", slug: "hair-styling", name: "Hair Styling", price_min: 500, price_max: 2500, display_order: 2 },
  { category_slug: "hair-services", slug: "root-touch-up", name: "Root Touch Up (As Per Brand)", price_min: 1500, display_order: 3 },
  { category_slug: "hair-services", slug: "pre-lightening-highlight", name: "Pre-Lightening / Highlight", price_min: 5500, price_max: 6500, display_order: 4 },
  { category_slug: "hair-services", slug: "balayage", name: "Balayage", price_min: 6500, price_max: 8500, display_order: 5 },
  { category_slug: "hair-services", slug: "ombre", name: "Ombre", price_min: 4500, price_max: 5500, display_order: 6 },
  { category_slug: "hair-services", slug: "hair-oiling", name: "Hair Oiling", price_min: 800, display_order: 7 },

  // HAIR TREATMENTS
  { category_slug: "hair-treatments", slug: "hair-treatment-spa", name: "Hair Treatment / Hair Spa", price_min: 1200, price_max: 2500, display_order: 1 },
  { category_slug: "hair-treatments", slug: "hair-keratin", name: "Hair Keratin", price_min: 3500, price_max: 7000, display_order: 2 },
  { category_slug: "hair-treatments", slug: "hair-botox", name: "Hair Botox", price_min: 3500, price_max: 10000, display_order: 3 },
  { category_slug: "hair-treatments", slug: "nanoplastia", name: "Nanoplastia", price_min: 3500, price_max: 10000, display_order: 4 },

  // MANICURE & PEDICURE
  { category_slug: "manicure-pedicure", slug: "normal-mani-pedi", name: "Normal Manicure / Pedicure", price_min: 1500, display_order: 1 },
  { category_slug: "manicure-pedicure", slug: "advance-mani-pedi", name: "Advance Manicure / Pedicure", price_min: 2500, display_order: 2 },
  { category_slug: "manicure-pedicure", slug: "deluxe-mani-pedi", name: "Deluxe Manicure / Pedicure", price_min: 3500, display_order: 3 },

  // MAKEUP
  { category_slug: "makeup", slug: "bridal-makeup", name: "Bridal Makeup", price_min: 12000, price_max: 25000, is_featured: true, display_order: 1 },
  { category_slug: "makeup", slug: "day-makeup", name: "Day Makeup", price_min: 2500, price_max: 3500, display_order: 2 },
  { category_slug: "makeup", slug: "party-night-makeup", name: "Party / Night Makeup", price_min: 2500, price_max: 3500, display_order: 3 },

  // NAIL SERVICES
  { category_slug: "nail-services", slug: "gel-polish", name: "Gel Polish", price_min: 1000, show_starting_from: true, display_order: 1 },
  { category_slug: "nail-services", slug: "gel-overlay", name: "Gel Overlay", price_min: 1300, display_order: 2 },
  { category_slug: "nail-services", slug: "nail-refill", name: "Nail Refill", price_min: 1300, display_order: 3 },
  { category_slug: "nail-services", slug: "nail-extension", name: "Nail Extension", price_min: 1500, display_order: 4 },
  { category_slug: "nail-services", slug: "nail-removal", name: "Nail Removal", price_min: 500, display_order: 5 },
  { category_slug: "nail-services", slug: "toe-nail-extension", name: "Toe Nail Extension", price_min: 1600, price_max: 2500, display_order: 6 },
];
