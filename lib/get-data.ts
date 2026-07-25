import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { team as localTeam } from "@/data/team";
import { services as localServices, serviceCategories as localCategories } from "@/data/services";
import { TeamMember, Service, ServiceCategory, ContactSettings } from "@/lib/types";

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

export async function getContactSettings(): Promise<ContactSettings> {
  const fallback: ContactSettings = {
    phones: ["9843805588", "9823207031"],
    whatsapp: "+9779843805588",
    email: "archanabeauty07@gmail.com",
    address: "New Baneshwor, Kathmandu, Nepal — Opposite to the Overhead Bridge",
    tiktok: "@naturalbeautyclinic5",
    esewa: "9843805588",
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
