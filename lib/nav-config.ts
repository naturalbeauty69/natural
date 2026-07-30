import {
  Scissors, Sparkles, Palette, Hand, GraduationCap, Image as ImageIcon,
  Users, BookOpen, Star, Calendar, MapPin, type LucideIcon,
} from "lucide-react";

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  heading: string;
  icon: LucideIcon;
  links: MegaMenuLink[];
}

export interface NavItem {
  label: string;
  href: string;
  megaMenu?: {
    columns: MegaMenuColumn[];
    featured: { title: string; description: string; href: string; cta: string };
  };
}

// Every href below maps to a route or in-page anchor that actually
// exists in the app — no placeholder links. Service anchors match the
// section ids rendered on /services (category.slug).
export const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    megaMenu: {
      columns: [
        {
          heading: "Hair",
          icon: Scissors,
          links: [
            { label: "Hair Cut & Styling", href: "/services#hair-services" },
            { label: "Hair Treatments (Keratin, Botox)", href: "/services#hair-treatments" },
            { label: "Balayage & Coloring", href: "/services#hair-services" },
          ],
        },
        {
          heading: "Skin",
          icon: Sparkles,
          links: [
            { label: "Facials & Skin Treatments", href: "/services#skin-treatments" },
            { label: "Threading", href: "/services#threading" },
            { label: "Waxing", href: "/services#waxing" },
          ],
        },
        {
          heading: "Makeup",
          icon: Palette,
          links: [
            { label: "Bridal Makeup", href: "/services#makeup" },
            { label: "Party & Day Makeup", href: "/services#makeup" },
          ],
        },
        {
          heading: "Nails",
          icon: Hand,
          links: [
            { label: "Manicure & Pedicure", href: "/services#manicure-pedicure" },
            { label: "Nail Extensions & Art", href: "/services#nail-services" },
          ],
        },
      ],
      featured: {
        title: "Bridal Makeup",
        description: "Full bridal transformation packages, trial sessions included.",
        href: "/services#makeup",
        cta: "View Bridal Pricing",
      },
    },
  },
  {
    label: "Academy",
    href: "/academy",
    megaMenu: {
      columns: [
        {
          heading: "Courses",
          icon: GraduationCap,
          links: [
            { label: "Beauty Training", href: "/academy" },
            { label: "Hair Science", href: "/academy" },
            { label: "Makeup Artistry", href: "/academy" },
            { label: "Nail Art", href: "/academy" },
          ],
        },
        {
          heading: "Explore",
          icon: BookOpen,
          links: [
            { label: "Compare Courses", href: "/compare-courses" },
            { label: "Gallery — Training Photos", href: "/gallery#training" },
            { label: "Student Success Stories", href: "/testimonials" },
            { label: "Meet the Trainers", href: "/team" },
          ],
        },
      ],
      featured: {
        title: "Get Certified",
        description: "Hands-on training led by an assessor, inside a working clinic.",
        href: "/academy",
        cta: "Explore Courses",
      },
    },
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

// Mobile sidebar / search: quick links + popular services
export const quickLinks = [
  { label: "Book Appointment", href: "/appointment", icon: Calendar },
  { label: "Courses", href: "/academy", icon: GraduationCap },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Testimonials", href: "/testimonials", icon: Star },
  { label: "Our Team", href: "/team", icon: Users },
  { label: "Directions", href: "https://maps.google.com/?q=Natural+Beauty+Clinic+and+Academy+New+Baneshwor+Kathmandu", icon: MapPin },
];

export const popularServices = [
  { label: "Hair Botox", href: "/services#hair-treatments" },
  { label: "Keratin Treatment", href: "/services#hair-treatments" },
  { label: "Hydra / Advance Facial", href: "/services#skin-treatments" },
  { label: "Bridal Makeup", href: "/services#makeup" },
  { label: "Nail Extension", href: "/services#nail-services" },
];
