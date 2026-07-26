export interface Course {
  slug: string;
  name: string;
  category: string;
  duration: string;
  level: string;
  fee: number;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const raw: Omit<Course, "slug">[] = [
  { name: "Basic Beautician Course", category: "Beauty & Skin Care", duration: "1–3 Months", level: "Beginner", fee: 35000 },
  { name: "Advanced Beautician Course", category: "Beauty & Skin Care", duration: "3–6 Months", level: "Intermediate", fee: 65000 },
  { name: "Professional Makeup Artist Course", category: "Makeup", duration: "1–3 Months", level: "Beginner / Advanced", fee: 45000 },
  { name: "Bridal Makeup Specialist Course", category: "Makeup", duration: "Short Term", level: "Advanced", fee: 25000 },
  { name: "Hair Dressing Course", category: "Hair Care", duration: "3–6 Months", level: "Beginner / Professional", fee: 55000 },
  { name: "Hair Science Course", category: "Hair & Trichology", duration: "Short Term", level: "Advanced", fee: 30000 },
  { name: "Skin Care Specialist Course", category: "Skin Treatment", duration: "3–6 Months", level: "Professional", fee: 60000 },
  { name: "Facial & Aesthetic Treatment Course", category: "Advanced Skin Care", duration: "Short Term", level: "Advanced", fee: 35000 },
  { name: "Nail Technician Course", category: "Nail Technology", duration: "1–3 Months", level: "Beginner", fee: 40000 },
  { name: "Nail Art Specialist Course", category: "Nail Technology", duration: "Short Term", level: "Advanced", fee: 25000 },
  { name: "Salon Management Course", category: "Business Management", duration: "Short Term", level: "Professional", fee: 30000 },
];

export const courses: Course[] = raw.map((c) => ({ ...c, slug: slugify(c.name) }));

export const courseCategories = Array.from(new Set(courses.map((c) => c.category)));
