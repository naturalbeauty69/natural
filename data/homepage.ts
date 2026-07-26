import { HomepageContent } from "@/lib/types";

// Mirrors site_settings key 'homepage_content'. Edit here (or in
// Supabase once connected) — no page code needs to change.
export const homepageContent: HomepageContent = {
  heroHeading: "Reveal Your Natural Beauty with Expert Care & Professional Training",
  heroDescription:
    "Experience premium skin, hair, makeup, and beauty treatments while building a successful career through Nepal's trusted beauty academy. At Natural Beauty Clinic & Academy, we combine advanced technology, expert professionals, and hands-on education to help you look your best and achieve your dreams.",
  heroCtas: [
    { label: "Book an Appointment", href: "/appointment", style: "gold" },
    { label: "Explore Our Courses", href: "/academy", style: "outline" },
    { label: "Contact Us", href: "/contact", style: "primary" },
  ],
  aboutHeading: "Welcome to Natural Beauty Clinic & Academy",
  aboutContent: [
    "Established on 25 March 2019, Natural Beauty Clinic & Academy is one of Kathmandu's trusted destinations for professional beauty services and career-focused beauty education. Located in New Baneshwor, we specialize in advanced skincare, haircare, makeup artistry, nail technology, and aesthetic treatments using modern equipment and premium products.",
    "Our academy provides practical, industry-oriented training designed to prepare students for successful careers in Nepal and abroad. Whether you are visiting for a beauty transformation or professional training, our experienced team is committed to delivering excellence, safety, and personalized care.",
  ],
  statistics: [
    { value: "7+", label: "Years of Professional Experience" },
    { value: "5,000+", label: "Happy Clients" },
    { value: "1,000+", label: "Students Trained" },
    { value: "50+", label: "Professional Beauty Courses" },
    { value: "25+", label: "Advanced Beauty & Skin Treatments" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "100%", label: "Practical Training" },
    { value: "100+", label: "Bridal Makeovers Completed" },
    { value: "Certified", label: "Beauty Professionals" },
    { value: "Modern", label: "Equipment & Premium Products" },
  ],
};
