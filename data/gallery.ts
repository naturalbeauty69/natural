export interface GalleryImage {
  url: string;
  category:
    | "hair" | "skin" | "clinic" | "training" | "students"
    | "bridal" | "nails" | "threading" | "waxing" | "certificates" | "events" | "before_after";
  caption?: string;
}

// Empty until real photos are uploaded — the Gallery page renders an
// honest "coming soon" state per category instead of stock filler,
// per the no-fictional-content / real-assets-only rule.
export const galleryImages: GalleryImage[] = [];

export const galleryCategories: { slug: GalleryImage["category"]; label: string }[] = [
  { slug: "clinic", label: "Clinic" },
  { slug: "skin", label: "Skin" },
  { slug: "hair", label: "Hair" },
  { slug: "bridal", label: "Bridal" },
  { slug: "nails", label: "Nails" },
  { slug: "threading", label: "Threading" },
  { slug: "waxing", label: "Waxing" },
  { slug: "training", label: "Training" },
  { slug: "students", label: "Students" },
  { slug: "certificates", label: "Certificates" },
  { slug: "events", label: "Events" },
  { slug: "before_after", label: "Before & After" },
];
