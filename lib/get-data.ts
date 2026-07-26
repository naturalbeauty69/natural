import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { team as localTeam } from "@/data/team";
import { services as localServices, serviceCategories as localCategories } from "@/data/services";
import { galleryImages as localGallery } from "@/data/gallery";
import { testimonials as localTestimonials, Testimonial } from "@/data/testimonials";
import { faqs as localFaqs, Faq } from "@/data/faq";
import { TeamMember, Service, ServiceCategory, ContactSettings } from "@/lib/types";
import { GalleryImage } from "@/data/gallery";

// ------------------------------------------------------------
// Every page calls these functions instead of importing /data
// directly. Today (no Supabase env vars) they return the seed
// data. Once the Supabase project is live, they read the live
// tables automatically — no page code needs to change.
// ------------------------------------------------------------

export async function getTeam(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [...localTeam].sort((a, b) => a.display_order - b.display_order);
  }
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  if (error || !data) return localTeam;
  return data as TeamMember[];
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [...localCategories].sort((a, b) => a.display_order - b.display_order);
  }
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  if (error || !data) return localCategories;
  return data as ServiceCategory[];
}

export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [...localServices].sort((a, b) => a.display_order - b.display_order);
  }
  // category_slug is denormalized on the client side for the fallback;
  // the live schema joins service_categories(slug) instead.
  const { data, error } = await supabase
    .from("services")
    .select("*, service_categories(slug), service_brands(name)")
    .eq("is_active", true)
    .order("display_order");
  if (error || !data) return localServices;
  return data.map((row: any) => ({
    ...row,
    category_slug: row.service_categories?.slug,
    brand_name: row.service_brands?.name ?? null,
  })) as Service[];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured || !supabase) return localGallery;
  const { data, error } = await supabase
    .from("gallery_images")
    .select("url, category, caption")
    .eq("is_active", true)
    .order("display_order");
  if (error || !data) return localGallery;
  return data as GalleryImage[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured || !supabase) return localTestimonials;
  const { data, error } = await supabase
    .from("testimonials")
    .select("customer_name, location, rating, content")
    .order("created_at", { ascending: false });
  if (error || !data) return localTestimonials;
  return data.map((row: any) => ({
    name: row.customer_name,
    location: row.location,
    rating: row.rating,
    content: row.content,
  }));
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured || !supabase) return localFaqs;
  const { data, error } = await supabase
    .from("faqs")
    .select("question, answer")
    .eq("is_active", true)
    .order("display_order");
  if (error || !data) return localFaqs;
  return data as Faq[];
}

export async function getContactSettings(): Promise<ContactSettings> {
  const fallback: ContactSettings = {
    phones: ["9843805588", "9823207031"],
    whatsapp: "+9779843805588",
    email: "archanabeauty07@gmail.com",
    address: "New Baneshwor, Kathmandu, Nepal — Opposite to the Overhead Bridge",
    tiktok: "https://www.tiktok.com/@naturalbeautyclinic5",
    facebook: "https://www.facebook.com/profile.php?id=100063534103647",
    instagram: "https://www.instagram.com/archanasilwal4",
    esewa: "9843805588",
    // Converted from the plain "maps.google.com/?q=..." link into the
    // no-API-key embeddable format Google Maps supports for iframes.
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Natural+Beauty+Clinic+and+Academy+New+Baneshwor+Kathmandu&output=embed",
    businessHours: "Sunday – Saturday: 10:00 AM – 7:00 PM",
  };
  if (!isSupabaseConfigured || !supabase) return fallback;
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact")
    .single();
  if (error || !data) return fallback;
  return data.value as ContactSettings;
}
