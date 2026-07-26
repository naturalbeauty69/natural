export interface BlogPost {
  slug: string;
  title: string;
  coverImageCaption: string; // describes the intended photo until a real one is uploaded
  coverImageUrl?: string | null;
  content: string;
  category: string;
  author: string;
  seoKeywords: string[];
  publishedAt: string; // ISO date
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const raw: Omit<BlogPost, "slug">[] = [
  {
    title: "The Ultimate Guide to Healthy, Glowing Skin",
    coverImageCaption: "Beautiful woman receiving a professional Hydra Facial treatment in a modern beauty clinic.",
    content:
      "Healthy skin begins with proper skincare, hydration, nutrition, and professional treatments. Daily cleansing, moisturizing, sunscreen, and regular skin analysis help maintain radiant skin. Professional facials such as Hydra Facial and Medi Facial deeply cleanse the skin, improve hydration, reduce pigmentation, and promote a youthful glow. At Natural Beauty Clinic & Academy, every skin treatment is customized according to your skin type and concerns.",
    category: "Skin Care",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Healthy Skin", "Hydra Facial", "Skin Care Nepal", "Facial Treatment Kathmandu", "Beauty Clinic"],
    publishedAt: "2026-03-15",
  },
  {
    title: "How to Prevent Hair Fall Naturally and Professionally",
    coverImageCaption: "Professional hair consultation and scalp analysis.",
    content:
      "Hair fall can result from stress, poor nutrition, hormonal imbalance, or improper hair care. Regular scalp treatments, healthy eating, proper hair washing techniques, and professional consultation can significantly reduce hair loss. Our clinic provides advanced scalp analysis and personalized hair care solutions to promote healthy hair growth.",
    category: "Hair Care",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Hair Fall Treatment", "Hair Care Nepal", "Hair Growth", "Scalp Treatment", "Healthy Hair"],
    publishedAt: "2026-04-05",
  },
  {
    title: "Why Professional Skin Analysis Is Important",
    coverImageCaption: "Advanced digital skin analysis machine.",
    content:
      "Every person's skin is unique. A professional skin analysis identifies concerns such as acne, pigmentation, dehydration, sensitivity, enlarged pores, and aging. Understanding your skin condition allows professionals to recommend the most suitable treatments and skincare products for long-term results.",
    category: "Skin Analysis",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Skin Analysis", "Digital Skin Test", "Skin Diagnosis", "Beauty Clinic Kathmandu"],
    publishedAt: "2026-04-20",
  },
  {
    title: "Top Beauty Courses to Build a Successful Career",
    coverImageCaption: "Students practicing professional beauty techniques.",
    content:
      "The beauty industry offers excellent career opportunities. Professional beautician, makeup artist, nail technician, hairdresser, and skincare specialist courses provide practical skills for employment or starting your own beauty business. Our academy emphasizes hands-on learning and industry-ready training.",
    category: "Beauty Education",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Beautician Course Nepal", "Makeup Course", "Beauty Academy Kathmandu", "Hair Science Course"],
    publishedAt: "2026-05-10",
  },
  {
    title: "Hydra Facial: Benefits for Every Skin Type",
    coverImageCaption: "Hydra Facial treatment session.",
    content:
      "Hydra Facial deeply cleanses, exfoliates, hydrates, and nourishes the skin without discomfort. It improves skin texture, reduces fine lines, minimizes pores, and restores a healthy glow. Suitable for most skin types, Hydra Facial is a popular choice for maintaining healthy skin year-round.",
    category: "Facial Treatment",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Hydra Facial Nepal", "Facial Treatment", "Skin Glow", "Skin Rejuvenation"],
    publishedAt: "2026-05-28",
  },
  {
    title: "Bridal Makeup Tips for a Perfect Wedding Look",
    coverImageCaption: "Professional bridal makeup transformation.",
    content:
      "A flawless bridal look begins with proper skincare, trial makeup sessions, and selecting a style that complements your features and attire. Professional bridal makeup enhances natural beauty while ensuring long-lasting results throughout the wedding celebrations.",
    category: "Makeup",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Bridal Makeup Kathmandu", "Wedding Makeup Nepal", "Professional Makeup Artist"],
    publishedAt: "2026-06-12",
  },
  {
    title: "The Importance of Sunscreen in Every Season",
    coverImageCaption: "Woman applying sunscreen outdoors.",
    content:
      "Daily sunscreen use protects the skin from harmful UV rays, premature aging, pigmentation, and sun damage. Applying a broad-spectrum sunscreen every morning and reapplying as needed helps maintain healthy, youthful-looking skin regardless of the season.",
    category: "Skin Care",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Sunscreen", "UV Protection", "Skin Care Tips", "Healthy Skin Nepal"],
    publishedAt: "2026-06-25",
  },
  {
    title: "Keratin Treatment vs Hair Smoothening: Which Is Better?",
    coverImageCaption: "Before-and-after professional hair treatment.",
    content:
      "Keratin treatment nourishes hair while reducing frizz and enhancing shine. Hair smoothening focuses on creating straighter, more manageable hair. The right choice depends on your hair type, condition, and desired results. Professional consultation ensures the most suitable treatment.",
    category: "Hair Treatment",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Keratin Treatment", "Hair Smoothening", "Hair Care Kathmandu", "Hair Salon Nepal"],
    publishedAt: "2026-07-08",
  },
  {
    title: "Essential Skincare Routine for Every Skin Type",
    coverImageCaption: "Professional skincare products arranged neatly.",
    content:
      "An effective skincare routine includes cleansing, toning, moisturizing, sunscreen, and periodic exfoliation. Choosing products according to your skin type helps prevent acne, dryness, sensitivity, and premature aging while maintaining healthy skin.",
    category: "Beauty Tips",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Skincare Routine", "Beauty Tips Nepal", "Healthy Skin", "Daily Skin Care"],
    publishedAt: "2026-07-18",
  },
  {
    title: "How Professional Beauty Training Can Change Your Career",
    coverImageCaption: "Beauty academy students during practical training.",
    content:
      "Professional beauty education provides practical experience, technical expertise, and confidence needed for success in the beauty industry. Graduates can work in salons, beauty clinics, spas, wellness centers, or establish their own businesses. Continuous learning and practical training are key to long-term success.",
    category: "Beauty Academy",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Beauty Training Nepal", "Beautician Course", "Professional Beauty Education", "Beauty Career", "Beauty Academy Kathmandu"],
    publishedAt: "2026-07-25",
  },
];

export const blogPosts: BlogPost[] = raw
  .map((post) => ({ ...post, slug: slugify(post.title) }))
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
