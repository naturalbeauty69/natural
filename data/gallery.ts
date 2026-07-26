export interface GalleryImage {
  url: string;
  category:
    | "hair" | "skin" | "clinic" | "training" | "students"
    | "bridal" | "nails" | "threading" | "waxing" | "certificates" | "events" | "before_after";
  caption?: string;
}

const L = "/images/library";

// Every image below is a real uploaded photo — every category now has
// real content (Clinic and Events were "coming soon" placeholders
// before the latest photo batch; both are now populated).
export const galleryImages: GalleryImage[] = [
  // CLINIC
  { url: `${L}/Clinic.webp`, category: "clinic", caption: "Clinic Interior" },
  { url: `${L}/Clinic 1.webp`, category: "clinic", caption: "Clinic Interior" },
  { url: `${L}/Clinic 2.webp`, category: "clinic", caption: "Clinic Interior" },
  { url: `${L}/Clinic 3.webp`, category: "clinic", caption: "Clinic Interior" },
  { url: `${L}/Clinic 4.webp`, category: "clinic", caption: "Clinic Interior" },

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
  { url: `${L}/Bridal.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Bridal1.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Bridal2.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Bridal3.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Bridal4.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Bridal5.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Birdal6.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Bridal7.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Birdal8.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/Bridal9.webp`, category: "bridal", caption: "Bridal Makeup" },
  { url: `${L}/nepali-bridal-makeup.webp`, category: "bridal", caption: "Nepali Bridal Makeup" },
  { url: `${L}/hci-bridal-packages.webp`, category: "bridal", caption: "Bridal Package" },
  { url: `${L}/bridal-mehndi.webp`, category: "bridal", caption: "Bridal Mehndi" },
  { url: `${L}/Party-makeup.webp`, category: "bridal", caption: "Party Makeup" },

  // NAILS
  { url: `${L}/Nail-services.webp`, category: "nails", caption: "Nail Services" },
  { url: `${L}/Nail-services1.webp`, category: "nails", caption: "Nail Services" },
  { url: `${L}/Nail-services2.webp`, category: "nails", caption: "Nail Services" },
  { url: `${L}/Nail-services3.webp`, category: "nails", caption: "Nail Services" },
  { url: `${L}/nail-art-rose-gold-marble.webp`, category: "nails", caption: "Rose Gold Marble Nail Art" },
  { url: `${L}/nail-extension-french.webp`, category: "nails", caption: "French Nail Extension" },
  { url: `${L}/nail-french-tip-almond.webp`, category: "nails", caption: "Almond French Tip" },
  { url: `${L}/nail-pink-marble-gold.webp`, category: "nails", caption: "Pink Marble Gold Nail Art" },

  // THREADING
  { url: `${L}/eyebrow-threading.webp`, category: "threading", caption: "Eyebrow Threading" },

  // WAXING
  { url: `${L}/body-waxing.webp`, category: "waxing", caption: "Body Waxing" },

  // TRAINING (Academy photos)
  { url: `${L}/Academy4.webp`, category: "training", caption: "Academy Training" },
  { url: `${L}/Academy5.webp`, category: "training", caption: "Academy Training" },
  { url: `${L}/Academy7.webp`, category: "training", caption: "Academy Training" },
  { url: `${L}/Academy8.webp`, category: "training", caption: "Academy Training" },
  { url: `${L}/Academy9.webp`, category: "training", caption: "Academy Training" },
  { url: `${L}/Academy10.webp`, category: "training", caption: "Academy Training" },
  { url: `${L}/hairdressing-course.webp`, category: "training", caption: "Hairdressing Course" },
  { url: `${L}/professional-makeup-course.webp`, category: "training", caption: "Professional Makeup Course" },
  { url: `${L}/nail-extension-course.webp`, category: "training", caption: "Nail Extension Course" },
  { url: `${L}/skin-facial-course.webp`, category: "training", caption: "Skin & Facial Course" },
  { url: `${L}/free-demo-classes-poster.webp`, category: "training", caption: "Free Demo Classes" },

  // STUDENTS
  { url: `${L}/Student.webp`, category: "students", caption: "Student at Work" },
  { url: `${L}/Student1.webp`, category: "students", caption: "Student at Work" },
  { url: `${L}/Student2.webp`, category: "students", caption: "Student at Work" },
  { url: `${L}/Student3.webp`, category: "students", caption: "Student at Work" },

  // BEFORE & AFTER
  { url: `${L}/Before-after.webp`, category: "before_after", caption: "Before & After" },
  { url: `${L}/Before-after1.webp`, category: "before_after", caption: "Before & After" },
  { url: `${L}/Before-after2.webp`, category: "before_after", caption: "Before & After" },
  { url: `${L}/hair-rebonding-before-after.webp`, category: "before_after", caption: "Hair Rebonding — Before & After" },
  { url: `${L}/hair-smoothening-before-after.webp`, category: "before_after", caption: "Hair Smoothening — Before & After" },

  // CERTIFICATES
  { url: `${L}/Certificate.webp`, category: "certificates", caption: "Certificate" },
  { url: `${L}/Certificate1.webp`, category: "certificates", caption: "Certificate" },
  { url: `${L}/Certificate2.webp`, category: "certificates", caption: "Certificate" },
  { url: `${L}/archana-award.webp`, category: "certificates", caption: "Recognition Award — Archana Silwal Kadel" },

  // EVENTS
  { url: `${L}/Event1.webp`, category: "events", caption: "Clinic Event" },
  { url: `${L}/Event4.webp`, category: "events", caption: "Clinic Event" },
  { url: `${L}/Event6.webp`, category: "events", caption: "Clinic Event" },
  { url: `${L}/Event7.webp`, category: "events", caption: "Clinic Event" },
  { url: `${L}/Event8.webp`, category: "events", caption: "Clinic Event" },
  { url: `${L}/Event9.webp`, category: "events", caption: "Clinic Event" },
  { url: `${L}/Event10.webp`, category: "events", caption: "Clinic Event" },
  { url: `${L}/Event11.webp`, category: "events", caption: "Clinic Event" },
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
