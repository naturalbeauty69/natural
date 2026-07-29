import { TeamMember } from "@/lib/types";

// Mirrors supabase/seed.sql -> team_members.
// Source: uploaded NaturalBeautyTeamAssets (real photos + bios).
export const team: TeamMember[] = [
  {
    slug: "archana-silwal-kadel",
    name: "Archana Silwal Kadel",
    role: "Owner & Director",
    bio: "Founder, Owner, and Director of Natural Beauty Clinic & Academy. Leads the clinic and academy with a commitment to professional beauty services, advanced skincare, client satisfaction, staff development, and high-quality beauty education while maintaining excellent service standards.",
    photo_url: "/images/team/archana-silwal-kadel.jpg",
    display_order: 1,
  },
  {
    slug: "krishna-gurung",
    name: "Krishna Gurung",
    role: "Accountant & Manager",
    bio: "Responsible for accounting, financial management, inventory control, supplier coordination, customer service, daily business operations, administration, and ensuring the smooth operation of the clinic and academy.",
    photo_url: "/images/team/krishna-gurung.jpg",
    gallery: [
      "/images/team-gallery/Krishna-gurung 1.webp",
      "/images/team-gallery/Krishna-gurung2.webp",
      "/images/team-gallery/Krishna-gurung3.webp",
      "/images/team-gallery/Krishna-gurung4.webp",
      "/images/team-gallery/Krishna-gurung5.webp",
    ],
    display_order: 2,
  },
  {
    slug: "sandip-thakur",
    name: "Sandip Thakur",
    role: "Hairdresser",
    bio: "Professional Hairdresser specializing in modern haircuts, hairstyling, hair coloring, hair spa, hair treatments, and personalized grooming services. Dedicated to helping clients achieve healthy, stylish, and confident looks.",
    photo_url: "/images/team/sandip-thakur.jpg",
    gallery: [
      "/images/team-gallery/Sandip1.webp",
      "/images/team-gallery/Sandip2.webp",
      "/images/team-gallery/Sandip3.webp",
      "/images/team-gallery/Sandip4.webp",
      "/images/team-gallery/Sandip5.webp",
      "/images/team-gallery/Sandip6.webp",
      "/images/team-gallery/Sandip7.webp",
      "/images/team-gallery/Sandip8.webp",
      "/images/team-gallery/Sandip9.webp",
      "/images/team-gallery/Sandip10.webp",
      "/images/team-gallery/Sandip11.webp",
    ],
    display_order: 3,
  },
  {
    slug: "asmita-bista",
    name: "Asmita Bista",
    role: "Assistant Beautician",
    bio: "Assists senior beauticians with skincare treatments, facials, beauty therapies, client preparation, hygiene standards, salon organization, and customer care while helping deliver professional beauty services.",
    photo_url: "/images/team/asmita-bista.jpg",
    display_order: 4,
  },
  {
    slug: "aasha-limbu",
    name: "Aasha Limbu",
    role: "Nail Technician",
    bio: "Professional Nail Technician specializing in manicure, pedicure, nail extensions, gel polish, nail art, and complete nail care. Committed to providing hygienic, elegant, and long-lasting nail services.",
    photo_url: "/images/team/aasha-limbu.jpg",
    display_order: 5,
  },
  {
    slug: "susmita-gautam",
    name: "Susmita Gautam",
    role: "Office Helper",
    bio: "Supports daily office operations by maintaining cleanliness, organizing supplies, assisting staff, welcoming clients, preparing work areas, and helping ensure smooth day-to-day operations within the clinic and academy.",
    photo_url: "/images/team/susmita-gautam.jpg",
    display_order: 6,
  },
];
