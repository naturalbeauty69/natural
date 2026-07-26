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
  facebook: string;
  instagram: string;
  esewa: string;
  mapEmbedUrl?: string | null;
  businessHours: string;
}

export interface CompanyProfile {
  registrationNumber: string;
  panVatNumber: string;
  established: string;
  shortDescription: string;
  longDescription: string;
  mission: string;
  vision: string;
  coreValues: string[];
  whyChooseUs: string[];
  seoKeywords: string[];
}

export interface HeroCta {
  label: string;
  href: string;
  style: "gold" | "outline" | "primary";
}

export interface HomepageContent {
  heroHeading: string;
  heroDescription: string;
  heroCtas: HeroCta[];
  aboutHeading: string;
  aboutContent: string[];
  statistics: { label: string; value: string }[];
}

export interface OwnerStory {
  name: string;
  title: string;
  content: string[];
}

export interface DirectorMessage {
  content: string[];
  signOffName: string;
  signOffTitle: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  points: string[];
}
