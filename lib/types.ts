export interface TeamMember {
  id?: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  specialization?: string | null;
  experience_years?: number | null;
  display_order: number;
}

export interface ServiceCategory {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  display_order: number;
}

export interface Service {
  id?: string;
  category_slug: string;
  brand_name?: string | null;
  slug: string;
  name: string;
  description?: string | null;
  duration_minutes?: number | null;
  price_min: number;
  price_max?: number | null;
  discount_price?: number | null;
  offer_price?: number | null;
  is_featured?: boolean;
  is_popular?: boolean;
  is_price_hidden?: boolean;
  show_starting_from?: boolean;
  image_url?: string | null;
  display_order: number;
}

export interface Course {
  id?: string;
  slug: string;
  name: string;
  summary?: string;
  description?: string;
  duration?: string;
  eligibility?: string;
  price?: number | null;
  image_url?: string | null;
  display_order: number;
}

export interface ContactSettings {
  phones: string[];
  whatsapp: string;
  email: string;
  address: string;
  tiktok: string;
  esewa: string;
}
