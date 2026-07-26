import { CompanyProfile, OwnerStory, DirectorMessage, TimelineEntry } from "@/lib/types";

// Source: client-provided business profile document. Mirrors
// site_settings key 'company_profile' in supabase/seed.sql — edit
// there once Supabase is connected; this file is the local fallback.
export const companyProfile: CompanyProfile = {
  registrationNumber: "211472/075/076",
  panVatNumber: "606806860",
  established: "25 March 2019",
  shortDescription:
    "Natural Beauty Clinic & Academy is a professional beauty clinic and beauty academy located in New Baneshwor, Kathmandu, Nepal. We specialize in advanced skin, hair, makeup, nail, and aesthetic treatments while providing industry-focused professional beauty education and certification.",
  longDescription:
    "Natural Beauty Clinic & Academy is a trusted destination for professional beauty services and career-oriented beauty education in Nepal. Since our establishment in 2019, we have been committed to delivering high-quality skincare, haircare, makeup, nail care, and aesthetic treatments using modern techniques, advanced equipment, and premium products. Our academy provides comprehensive practical training designed to prepare students for successful careers in the beauty industry. We believe beauty is a combination of confidence, health, and knowledge, and our mission is to empower every client and student through exceptional service, continuous learning, and professional excellence.",
  mission:
    "To transform lives by enhancing beauty, confidence, and professional skills through exceptional beauty treatments, innovative techniques, and internationally inspired beauty education.",
  vision:
    "To become Nepal's most trusted and innovative beauty clinic and academy, recognized nationally and internationally for excellence in beauty services, education, customer satisfaction, and professional development.",
  coreValues: [
    "Professionalism",
    "Excellence",
    "Integrity",
    "Innovation",
    "Client Satisfaction",
    "Quality Education",
    "Safety & Hygiene",
    "Continuous Learning",
    "Respect",
    "Empowerment",
    "Teamwork",
    "Ethical Practice",
  ],
  whyChooseUs: [
    "Established and trusted since 2019",
    "Certified beauty professionals and trainers",
    "Advanced skin and hair treatment technologies",
    "Personalized beauty consultations",
    "Hygienic and modern treatment environment",
    "Practical hands-on beauty education",
    "Career-focused training programs",
    "Premium professional products",
    "Affordable and transparent pricing",
    "Commitment to client satisfaction",
  ],
  seoKeywords: [
    "Beauty Clinic in Kathmandu",
    "Beauty Academy Nepal",
    "Skin Clinic Kathmandu",
    "Hair Treatment Nepal",
    "Professional Makeup Academy",
    "Beautician Training Nepal",
    "Hydra Facial Kathmandu",
    "Hair Science Course Nepal",
    "Bridal Makeup Kathmandu",
    "Nail Technician Course",
    "Skin Care Training",
    "Hair Care Training",
    "Professional Beauty Institute Nepal",
    "Natural Beauty Clinic & Academy",
  ],
};

// Fuller narrative company story for the About page (distinct from the
// short/long descriptions above, which are used for SEO/meta purposes).
export const companyStory = {
  heading: "Transforming Beauty, Inspiring Confidence",
  content: [
    "Founded on 25 March 2019, Natural Beauty Clinic & Academy was established with a vision to redefine beauty care and professional beauty education in Nepal. What began as a dream to provide high-quality beauty services has grown into a trusted destination for advanced skincare, haircare, makeup artistry, nail technology, and career-focused beauty training.",
    "Located in New Baneshwor, Kathmandu, our clinic combines modern beauty technology, premium products, and personalized care to help every client achieve healthy skin, beautiful hair, and lasting confidence.",
    "Beyond beauty services, our academy is dedicated to empowering aspiring beauty professionals through practical, industry-oriented education. Our hands-on training programs equip students with the knowledge, technical skills, and confidence needed to build successful careers in Nepal and internationally.",
    "Today, Natural Beauty Clinic & Academy continues to uphold the highest standards of professionalism, innovation, hygiene, and customer satisfaction while creating a welcoming environment where beauty meets education and every individual is valued.",
  ],
};

export const ownerStory: OwnerStory = {
  name: "Archana Silwal Kadel",
  title: "Founder | Director | Senior Beautician | Trainer | Assessor",
  content: [
    "Natural Beauty Clinic & Academy is the realization of the lifelong passion of Archana Silwal Kadel, a dedicated beauty professional committed to transforming lives through beauty, education, and empowerment.",
    "With years of practical experience in skincare, haircare, makeup artistry, beauty therapy, and professional training, she founded the clinic with a simple yet powerful belief: true beauty begins with confidence, knowledge, and professional care.",
    "As a trainer and assessor, she has guided numerous students toward rewarding careers in the beauty industry by emphasizing practical learning, ethical practices, and continuous skill development. Her dedication to excellence has earned the trust of clients and students alike, making the academy a respected name in Nepal's beauty industry.",
    "Her vision continues to inspire the growth of Natural Beauty Clinic & Academy as a center of excellence in beauty services and professional education.",
  ],
};

export const directorMessage: DirectorMessage = {
  content: [
    "Welcome to Natural Beauty Clinic & Academy.",
    "It is my great pleasure to welcome you to our clinic and academy. Since our establishment in 2019, our goal has been to provide exceptional beauty services while empowering individuals with professional skills that create lifelong career opportunities.",
    "Every client who visits us deserves personalized care, professional treatment, and the highest standards of safety and hygiene. Every student who joins our academy deserves practical education, confidence, and the knowledge required to succeed in today's competitive beauty industry.",
    "We continuously embrace innovation, modern techniques, and international beauty standards to ensure that both our services and training remain among the best in Nepal.",
    "Thank you for placing your trust in us. We look forward to being part of your beauty journey and professional success.",
  ],
  signOffName: "Archana Silwal Kadel",
  signOffTitle: "Founder & Director, Natural Beauty Clinic & Academy",
};

export const timeline: TimelineEntry[] = [
  {
    year: "2019",
    title: "The Beginning",
    points: [
      "Established on 25 March 2019",
      "Official business registration completed",
      "Opened Natural Beauty Clinic & Academy in New Baneshwor, Kathmandu",
    ],
  },
  {
    year: "2020",
    title: "Building Trust",
    points: [
      "Expanded beauty and skincare services",
      "Earned the trust of local clients through quality service and professional care",
    ],
  },
  {
    year: "2021",
    title: "Expanding Professional Training",
    points: [
      "Introduced practical beautician and makeup training programs",
      "Focused on hands-on learning and industry standards",
    ],
  },
  {
    year: "2022",
    title: "Service Enhancement",
    points: [
      "Added advanced skin, hair, and aesthetic treatments",
      "Upgraded beauty equipment and professional products",
    ],
  },
  {
    year: "2023",
    title: "Growth & Recognition",
    points: [
      "Expanded academy offerings with specialized beauty courses",
      "Strengthened reputation for quality education and client satisfaction",
    ],
  },
  {
    year: "2024",
    title: "Innovation & Digital Presence",
    points: [
      "Enhanced online presence through social media",
      "Improved consultation and customer engagement",
      "Continued modernization of services and training",
    ],
  },
  {
    year: "2025",
    title: "Excellence in Beauty & Education",
    points: [
      "Expanded advanced treatment options",
      "Continued producing skilled beauty professionals",
      "Strengthened commitment to quality, hygiene, and innovation",
    ],
  },
  {
    year: "2026",
    title: "Looking Ahead",
    points: [
      "Continuing to provide world-class beauty services and practical education",
      "Expanding digital learning, advanced technologies, and opportunities for students",
      "Working toward becoming one of Nepal's most trusted and respected beauty clinics and academies",
    ],
  },
];
