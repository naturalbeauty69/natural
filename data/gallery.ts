export interface GalleryImage {
  url: string;
  category:
    | "hair" | "skin" | "clinic" | "training" | "students"
    | "bridal" | "nails" | "threading" | "waxing" | "certificates" | "events" | "before_after";
  caption?: string;
}

const L = "/images/library";

// Real uploaded photos. "clinic" and "events" are left empty (honest
// "coming soon" state) since no clinic-interior or event photos have
// been uploaded yet — everything else here is a real asset.
export const galleryImages: GalleryImage[] = [
  // HAIR
  { url: `${L}/hair-coloring.webp`, category: "hair", caption: "Hair Coloring" },
  { url: `${L}/hair-cutting-scissor.webp`, category: "hair", caption: "Precision Hair Cutting" },
  { url: `${L}/hair-styling-blowdry.webp`, category: "hair", caption: "Hair Styling & Blow-Dry" },
  { url: `${L}/Hair-cutting.webp`, category: "hair", caption: "Hair Cut" },

  // SKIN
  { url: `${L}/Skin-and-facial-treatment.webp`, category: "skin", caption: "Skin & Facial Treatment" },
  { url: `${L}/hero-spa-facial.webp`, category: "skin", caption: "Spa Facial" },
  { url: `${L}/skin-analysis-machine.webp`, category: "skin", caption: "Advanced Skin Analysis" },
  { url: `${L}/ai-skin-analysis.webp`, category: "skin", caption: "Digital Skin Analysis" },

  // BRIDAL
  { url: `${L}/nepali-bridal-makeup.webp`, category: "bridal", caption: "Nepali Bridal Makeup" },
  { url: `${L}/hci-bridal-packages.webp`, category: "bridal", caption: "Bridal Package" },
  { url: `${L}/bridal-mehndi.webp`, category: "bridal", caption: "Bridal Mehndi" },
  { url: `${L}/Party-makeup.webp`, category: "bridal", caption: "Party Makeup" },

  // NAILS
  { url: `${L}/nail-art-rose-gold-marble.webp`, category: "nails", caption: "Rose Gold Marble Nail Art" },
  { url: `${L}/nail-extension-french.webp`, category: "nails", caption: "French Nail Extension" },
  { url: `${L}/nail-french-tip-almond.webp`, category: "nails", caption: "Almond French Tip" },
  { url: `${L}/nail-pink-marble-gold.webp`, category: "nails", caption: "Pink Marble Gold Nail Art" },
  { url: `${L}/Nail-services.webp`, category: "nails", caption: "Nail Services" },

  // THREADING
  { url: `${L}/eyebrow-threading.webp`, category: "threading", caption: "Eyebrow Threading" },

  // WAXING
  { url: `${L}/body-waxing.webp`, category: "waxing", caption: "Body Waxing" },

  // TRAINING
  { url: `${L}/hairdressing-course.webp`, category: "training", caption: "Hairdressing Course" },
  { url: `${L}/professional-makeup-course.webp`, category: "training", caption: "Professional Makeup Course" },
  { url: `${L}/nail-extension-course.webp`, category: "training", caption: "Nail Extension Course" },
  { url: `${L}/skin-facial-course.webp`, category: "training", caption: "Skin & Facial Course" },
  { url: `${L}/free-demo-classes-poster.webp`, category: "training", caption: "Free Demo Classes" },

  // BEFORE & AFTER
  { url: `${L}/hair-rebonding-before-after.webp`, category: "before_after", caption: "Hair Rebonding — Before & After" },
  { url: `${L}/hair-smoothening-before-after.webp`, category: "before_after", caption: "Hair Smoothening — Before & After" },

  // CERTIFICATES
  { url: `${L}/archana-award.webp`, category: "certificates", caption: "Recognition Award — Archana Silwal Kadel" },
];

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
