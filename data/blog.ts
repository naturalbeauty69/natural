export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  coverImageCaption: string; // describes the intended photo until a real one is uploaded
  coverImageUrl?: string | null;
  content: string; // paragraphs separated by \n\n; lines starting with "## " render as subheadings
  faqs?: BlogFaq[];
  relatedServiceLinks?: { label: string; href: string }[];
  relatedCourseLinks?: { label: string; href: string }[];
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
    coverImageUrl: "/images/library/hero-spa-facial.webp",
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
    coverImageUrl: "/images/library/hair-services.webp",
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
    coverImageUrl: "/images/library/skin-analysis-machine.webp",
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
    coverImageUrl: "/images/library/hairdressing-course.webp",
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
    coverImageUrl: "/images/library/Skin-and-facial-treatment.webp",
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
    coverImageUrl: "/images/library/nepali-bridal-makeup.webp",
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
    coverImageUrl: "/images/library/skin-treatments.webp",
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
    coverImageUrl: "/images/library/hair-smoothening-rebonding.webp",
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
    coverImageUrl: "/images/library/ai-skin-analysis.webp",
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
    coverImageUrl: "/images/library/professional-makeup-course.webp",
    coverImageCaption: "Beauty academy students during practical training.",
    content:
      "Professional beauty education provides practical experience, technical expertise, and confidence needed for success in the beauty industry. Graduates can work in salons, beauty clinics, spas, wellness centers, or establish their own businesses. Continuous learning and practical training are key to long-term success.",
    category: "Beauty Academy",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Beauty Training Nepal", "Beautician Course", "Professional Beauty Education", "Beauty Career", "Beauty Academy Kathmandu"],
    publishedAt: "2026-07-25",
  },

  // ---------- NEW: AUTHOR-BYLINED ARTICLES ----------
  {
    title: "Ultimate Guide to HydraFacial in Kathmandu: Benefits, Process, and Local Prices",
    coverImageUrl: "/images/library/Archana-blog1.webp",
    coverImageCaption: "HydraFacial treatment session at Natural Beauty Clinic & Academy.",
    content:
      "If you've been researching ways to get brighter, smoother, more hydrated skin without downtime, you've likely come across HydraFacial. It's one of the most requested treatments at our clinic, and for good reason — it delivers visible results after a single session with none of the redness or peeling associated with harsher treatments.\n\n" +
      "## What Is a HydraFacial?\n\n" +
      "HydraFacial is a multi-step skin resurfacing treatment that cleanses, exfoliates, extracts impurities, and infuses the skin with hydrating serums — all in one session. Unlike traditional facials, it uses a device that combines suction-based exfoliation with simultaneous serum delivery, so dead skin is lifted away while nutrients are pushed in at the same time.\n\n" +
      "## Who Is It For?\n\n" +
      "HydraFacial suits most skin types, including sensitive skin, because the pressure and serums used are adjusted to your skin's condition during consultation. It's popular among clients dealing with dullness, mild congestion, uneven texture, or simply wanting a healthy glow before an event.\n\n" +
      "## The Process, Step by Step\n\n" +
      "A typical session includes cleansing and gentle exfoliation, a mild acid peel to loosen debris, painless extraction of blackheads and congestion using suction, and a final infusion of hydrating and brightening serums tailored to your skin's needs. The full treatment usually takes 45–60 minutes, and you can return to normal activities immediately.\n\n" +
      "## What Results to Expect\n\n" +
      "Most clients notice smoother texture and a visible glow immediately after their first session. For concerns like dullness or mild congestion, results build with regular treatments — we typically recommend a session every 4–6 weeks for maintenance, similar to international HydraFacial guidelines.\n\n" +
      "## Local Pricing in Kathmandu\n\n" +
      "At Natural Beauty Clinic & Academy, HydraFacial pricing depends on which serum protocol and add-ons are used for your skin. Our general facial and skin treatment pricing is listed on our Services page — during your consultation, we'll recommend the right protocol and confirm the exact price before you commit to anything.\n\n" +
      "## Practical Tips Before You Book\n\n" +
      "Avoid strong exfoliating actives (like retinol or AHA/BHA products) for 2–3 days before your appointment. Skip waxing or threading on the treatment area right before your session. Let your esthetician know about any active breakouts, cold sores, or skin conditions beforehand so the protocol can be adjusted safely.\n\n" +
      "If you're looking for a reliable, low-downtime way to refresh your skin — whether for a special occasion or as part of a regular skincare routine — HydraFacial is one of the safest, most consistent options available, and one I personally recommend to clients who are new to professional skin treatments.",
    faqs: [
      { question: "How long does a HydraFacial session take?", answer: "Typically 45–60 minutes, including consultation and aftercare guidance." },
      { question: "Is there any downtime after HydraFacial?", answer: "No. Most clients return to their normal routine immediately, with only a light glow or mild pinkness that fades within hours." },
      { question: "How often should I get a HydraFacial?", answer: "For maintenance, every 4–6 weeks is typical, though this varies based on your skin's needs — we'll advise during consultation." },
      { question: "Can HydraFacial help with acne?", answer: "It can help with mild congestion and improve overall skin clarity, but active or cystic acne should be evaluated by a dermatologist alongside any clinic treatment." },
    ],
    relatedServiceLinks: [{ label: "Skin Treatments & Facials", href: "/services#skin-treatments" }],
    relatedCourseLinks: [{ label: "Skin Care Specialist Course", href: "/academy" }, { label: "Facial & Aesthetic Treatment Course", href: "/academy" }],
    category: "Skin Care",
    author: "Archana Silwal Kadel",
    seoKeywords: ["HydraFacial Kathmandu", "HydraFacial Nepal price", "Facial Treatment Kathmandu", "Skin Care Nepal", "Natural Beauty Clinic HydraFacial"],
    publishedAt: "2026-08-01",
  },
  {
    title: "The Ultimate Pre-Bridal Skincare Timeline for Nepalese Brides (6-Month Plan)",
    coverImageUrl: "/images/library/Archana-blog2.webp",
    coverImageCaption: "Bridal skincare consultation and treatment at Natural Beauty Clinic & Academy.",
    content:
      "Every bride wants clear, radiant skin on her wedding day — but rushing skincare treatments in the final week rarely gives real results, and can sometimes backfire with irritation or breakouts. The best approach starts months in advance, giving your skin time to respond gradually and safely. Here's the timeline I walk my bridal clients through.\n\n" +
      "## 6 Months Before: Build the Foundation\n\n" +
      "This is the time to get a proper skin consultation and start a consistent daily routine — cleansing, moisturizing, and daily sunscreen, non-negotiably. If you have ongoing concerns like pigmentation, acne scarring, or dullness, this is also when to start a course of professional facials or skin treatments, since these need repetition over time to show real change.\n\n" +
      "## 4 Months Before: Address Specific Concerns\n\n" +
      "With a solid routine in place, this is the window to consider treatments like chemical peels, advanced facials, or pigmentation-focused sessions, spaced a few weeks apart. Avoid starting anything aggressive or experimental this close to the wedding without first testing how your skin reacts.\n\n" +
      "## 2 Months Before: Refine and Maintain\n\n" +
      "Continue your regular facials every 3–4 weeks. This is a good time for a professional skin analysis to check progress and adjust your routine. Avoid introducing brand-new products or treatments you haven't tried before — your skin should be in a stable, predictable rhythm by now.\n\n" +
      "## 1 Month Before: Polish, Don't Experiment\n\n" +
      "Stick to treatments you know your skin tolerates well. A gentle, hydrating facial 2–3 weeks before the wedding is ideal for a final glow without risking irritation. This is not the time to try a new peel or aggressive treatment for the first time.\n\n" +
      "## Final Week: Keep It Simple\n\n" +
      "In the last week, avoid any new products, treatments, or extractions. A light hydrating facial 3–5 days before the event (not the day before) gives your skin time to settle. Prioritize sleep, hydration, and stress management — they show on your skin more than any last-minute treatment can.\n\n" +
      "## Practical Tips\n\n" +
      "Always patch-test new products weeks in advance, never the week of. Keep your skincare consistent even during pre-wedding stress and travel. Communicate openly with your esthetician about your wedding date so every treatment is timed correctly, with no surprises.\n\n" +
      "Every bride's skin is different, which is why we recommend starting with a one-on-one consultation to build a timeline around your specific skin, not a generic checklist.",
    faqs: [
      { question: "When should I start pre-bridal skincare treatments?", answer: "Ideally 6 months before the wedding, so treatments have time to show results without rushing your skin." },
      { question: "Can I try a new treatment the week of my wedding?", answer: "We strongly advise against it. New treatments should always be tested at least a month in advance." },
      { question: "What should I do the week of the wedding?", answer: "Keep it simple — a light hydrating facial a few days before, plenty of sleep, and hydration. Avoid new products or aggressive treatments." },
      { question: "Do I need a consultation before starting the timeline?", answer: "Yes — every bride's skin responds differently, so we build the treatment plan around your skin type and concerns first." },
    ],
    relatedServiceLinks: [{ label: "Bridal Makeup", href: "/services#makeup" }, { label: "Skin Treatments & Facials", href: "/services#skin-treatments" }],
    relatedCourseLinks: [{ label: "Skin Care Specialist Course", href: "/academy" }],
    category: "Skin Care",
    author: "Archana Silwal Kadel",
    seoKeywords: ["Pre-Bridal Skincare Nepal", "Bridal Skincare Timeline", "Bridal Facial Kathmandu", "Wedding Skincare Nepal", "Bridal Skin Prep"],
    publishedAt: "2026-08-03",
  },
  {
    title: "Hair Botox vs. Keratin Treatment in Nepal",
    coverImageUrl: "/images/library/Sandip-blog1.webp",
    coverImageCaption: "Hair Botox and Keratin treatment comparison at Natural Beauty Clinic & Academy.",
    content:
      "Two of the most common questions I get at the salon are \"what's the difference between Hair Botox and Keratin?\" and \"which one is right for me?\" Both treatments smooth and strengthen hair, but they work differently and suit different hair concerns — here's how to tell them apart.\n\n" +
      "## What Keratin Treatment Does\n\n" +
      "Keratin treatment works by coating the hair shaft with keratin protein, sealing the cuticle and reducing frizz. It's especially effective for very curly, frizzy, or chemically damaged hair that needs significant smoothing. Results typically last 3–5 months depending on hair type and aftercare.\n\n" +
      "## What Hair Botox Does\n\n" +
      "Despite the name, Hair Botox contains no actual botulinum toxin — it's a deep conditioning treatment infused with proteins, vitamins, and amino acids that fill in damaged areas of the hair shaft. It focuses more on repairing and nourishing than heavy smoothing, making it gentler and better suited to fine, damaged, or color-treated hair that needs strengthening rather than straightening.\n\n" +
      "## Key Differences\n\n" +
      "Keratin gives a straighter, sleeker finish and holds up longer on very frizzy hair. Hair Botox gives a softer, more natural, bouncier finish and is generally considered gentler on the hair over repeated use. Keratin treatments traditionally use formaldehyde-releasing chemicals (though many modern salons, including ours, use formaldehyde-free formulas) — always ask your salon which formula they use.\n\n" +
      "## Which One Should You Choose?\n\n" +
      "If your main concern is frizz and you want straighter, smoother hair with strong hold, Keratin is usually the better fit. If your hair is fine, damaged, over-processed, or color-treated and needs repair and nourishment more than straightening, Hair Botox is often the gentler choice. During consultation, we assess your hair's condition and porosity before recommending either.\n\n" +
      "## Practical Aftercare Tips\n\n" +
      "Use sulfate-free shampoo to extend the life of either treatment. Avoid tying your hair up or tucking it behind your ears for the first 24–72 hours after Keratin treatments specifically, as instructed by your stylist. Space out chemical treatments — don't combine color and smoothing treatments too close together, as this increases damage risk.\n\n" +
      "Both treatments can give beautiful results when matched to the right hair type. If you're unsure which is right for you, come in for a consultation — we'll examine your hair's condition first rather than guessing.",
    faqs: [
      { question: "Does Hair Botox actually contain Botox?", answer: "No — the name is a marketing term. It's a deep conditioning protein treatment, not an injectable." },
      { question: "How long do these treatments last?", answer: "Keratin typically lasts 3–5 months; Hair Botox results generally last 2–4 months, depending on hair type and haircare routine." },
      { question: "Can I color my hair after these treatments?", answer: "Yes, but we recommend spacing color and smoothing treatments a few weeks apart to minimize cumulative damage." },
      { question: "Which is better for damaged hair?", answer: "Hair Botox is generally gentler and more repair-focused, making it a common choice for damaged or color-treated hair." },
    ],
    relatedServiceLinks: [{ label: "Hair Botox", href: "/services#hair-treatments" }, { label: "Hair Keratin", href: "/services#hair-treatments" }],
    relatedCourseLinks: [{ label: "Hair Science Course", href: "/academy" }, { label: "Hair Dressing Course", href: "/academy" }],
    category: "Hair Treatment",
    author: "Sandip Thakur",
    seoKeywords: ["Hair Botox vs Keratin", "Hair Botox Nepal", "Keratin Treatment Kathmandu", "Hair Smoothening Nepal", "Hair Treatment Comparison"],
    publishedAt: "2026-08-05",
  },
  {
    title: "Why Hair Fall Increases in Kathmandu & How to Stop It",
    coverImageUrl: "/images/library/Sandip-blog2.webp",
    coverImageCaption: "Scalp and hair fall consultation at Natural Beauty Clinic & Academy.",
    content:
      "Many clients tell me their hair fall gets noticeably worse after moving to or living in Kathmandu, especially during certain seasons. This isn't just anecdotal — there are real environmental and lifestyle factors at play in the valley that contribute to increased shedding.\n\n" +
      "## Why Kathmandu's Environment Affects Hair\n\n" +
      "Kathmandu's air quality, particularly dust and pollution levels, can clog the scalp's pores and follicles, weakening hair over time. Hard water common in parts of the valley can also leave mineral buildup on the scalp, making hair drier and more prone to breakage. Seasonal dryness during winter months adds further stress.\n\n" +
      "## Common Contributing Factors\n\n" +
      "Beyond environment, hair fall is often driven by stress, poor scalp hygiene, harsh or infrequent washing habits, nutritional gaps (especially iron, protein, and biotin deficiencies), and hormonal changes. Tight hairstyles worn daily can also contribute to traction-related thinning over time.\n\n" +
      "## What You Can Do: Practical Steps\n\n" +
      "Wash your scalp regularly to remove dust and product buildup — how often depends on your hair type, but don't let buildup sit for too long. Use a clarifying shampoo occasionally if you're in a hard-water area. Deep condition or oil your scalp weekly to counter environmental dryness. Eat a balanced diet with enough protein and iron, since hair is largely built from protein. Avoid excessively tight hairstyles worn every day.\n\n" +
      "## When Professional Treatment Helps\n\n" +
      "If home care isn't enough, a professional scalp analysis can identify whether the cause is buildup, dryness, breakage, or something that needs a dermatologist's input. Scalp treatments and targeted hair spa sessions can meaningfully improve scalp health and reduce shedding caused by environmental stress — though sudden, severe, or patchy hair loss should always be checked by a doctor, since it may point to a medical cause treatments alone won't fix.\n\n" +
      "## A Realistic Expectation\n\n" +
      "Some daily shedding (50–100 hairs) is completely normal. What matters is whether you're seeing a noticeable increase, thinning patches, or a receding hairline — those are signs to get a proper consultation rather than guess with random products.",
    faqs: [
      { question: "Is hair fall in Kathmandu really worse than elsewhere?", answer: "Pollution, dust, and hard water in parts of the valley genuinely do contribute to more scalp stress, though individual factors like diet and stress matter just as much." },
      { question: "How much hair fall is normal?", answer: "Losing 50–100 hairs a day is typical. A noticeable increase, thinning patches, or a receding hairline warrants a proper consultation." },
      { question: "Can scalp treatments really help?", answer: "Yes, for buildup- and dryness-related shedding, professional scalp treatments and regular hair spa sessions can meaningfully improve scalp health." },
      { question: "When should I see a doctor instead of a salon?", answer: "If you notice sudden, severe, or patchy hair loss, see a dermatologist first — this could indicate a medical cause a salon treatment can't address." },
    ],
    relatedServiceLinks: [{ label: "Hair Treatment / Hair Spa", href: "/services#hair-treatments" }, { label: "Hair Oiling", href: "/services#hair-services" }],
    relatedCourseLinks: [{ label: "Hair Science Course", href: "/academy" }],
    category: "Hair Care",
    author: "Sandip Thakur",
    seoKeywords: ["Hair Fall Kathmandu", "Hair Fall Treatment Nepal", "Scalp Treatment Kathmandu", "Hair Care Nepal", "Hair Loss Causes"],
    publishedAt: "2026-08-07",
  },
  {
    title: "Gel Extensions vs. Acrylic Nails",
    coverImageUrl: "/images/library/Aasha-blog1.webp",
    coverImageCaption: "Gel and acrylic nail extension comparison at Natural Beauty Clinic & Academy.",
    content:
      "Choosing between gel extensions and acrylic is one of the most common questions I get from clients booking their first nail appointment. Both create beautiful, long-lasting extensions, but they differ in application, feel, and maintenance — here's what to actually consider.\n\n" +
      "## What Acrylic Nails Are\n\n" +
      "Acrylic extensions are made by mixing a liquid monomer with a powder polymer, which hardens into a strong, durable layer over a nail tip or form. Acrylic is known for being very strong and long-lasting, which makes it popular for clients who are hard on their hands or want maximum durability.\n\n" +
      "## What Gel Extensions Are\n\n" +
      "Gel extensions use a gel product cured under UV or LED light rather than air-drying. Gel tends to feel lighter and more flexible than acrylic, with a glossier, more natural-looking finish straight off the table without needing a separate topcoat.\n\n" +
      "## Comparing the Two\n\n" +
      "Acrylic is generally more affordable and slightly more durable for very active hands, but has a stronger odor during application and can feel heavier. Gel is lighter, glossier, and gentler on the natural nail, but can be pricier and is somewhat less impact-resistant than acrylic for heavy daily wear.\n\n" +
      "## Which Should You Choose?\n\n" +
      "If you work with your hands a lot or want maximum strength, acrylic is often the more practical choice. If you prioritize a natural, lightweight feel and don't mind slightly more careful handling, gel is usually preferred. Both can look equally beautiful — the right choice comes down to your lifestyle and nail habits, not one being objectively better.\n\n" +
      "## Practical Aftercare Tips\n\n" +
      "Always let a technician remove extensions properly — never pick or pull them off, as this can damage your natural nail underneath. Keep cuticles moisturized between appointments to prevent lifting. Get fills every 2–3 weeks to keep extensions looking neat and prevent breakage at the regrowth line.\n\n" +
      "Whichever you choose, the technician's skill matters more than the material — proper prep and application is what actually determines how long your extensions last and how healthy your natural nails stay underneath.",
    faqs: [
      { question: "Which lasts longer, gel or acrylic?", answer: "Acrylic is generally slightly more durable for heavy daily use, but both can last 2-3 weeks between fills with proper care." },
      { question: "Does removal damage my natural nails?", answer: "Only if done incorrectly. Professional soak-off or filing removal is safe — picking or pulling extensions off is what causes damage." },
      { question: "Is gel more expensive than acrylic?", answer: "Typically yes, gel tends to cost a bit more due to the product and curing equipment involved, though pricing varies by salon." },
      { question: "Can I switch between gel and acrylic?", answer: "Yes, as long as your natural nails are given a healthy break between switching if they show signs of thinning or damage." },
    ],
    relatedServiceLinks: [{ label: "Nail Extension", href: "/services#nail-services" }, { label: "Gel Overlay", href: "/services#nail-services" }],
    relatedCourseLinks: [{ label: "Nail Technician Course", href: "/academy" }],
    category: "Nail Care",
    author: "Aasha Limbu",
    seoKeywords: ["Gel vs Acrylic Nails", "Nail Extension Kathmandu", "Nail Technician Nepal", "Gel Nails Nepal", "Acrylic Nails Kathmandu"],
    publishedAt: "2026-08-09",
  },
  {
    title: "Top 10 Bridal Nail Art Trends in Nepal",
    coverImageUrl: "/images/library/Aasha-blog2.webp",
    coverImageCaption: "Bridal nail art design at Natural Beauty Clinic & Academy.",
    content:
      "Bridal nail art has become just as important as bridal makeup for many of my clients — it's a small detail that shows up in every ring photo. Here are the trends I'm seeing the most requests for this wedding season in Nepal.\n\n" +
      "## 1. Classic French with a Twist\n\n" +
      "The traditional French tip reimagined with gold micro-detailing or a colored line instead of plain white — elegant and photograph-friendly.\n\n" +
      "## 2. Rose Gold Marble\n\n" +
      "Soft marble swirls in rose gold and cream tones pair beautifully with most bridal jewelry and mehndi designs.\n\n" +
      "## 3. Minimalist Nude with Gold Accents\n\n" +
      "For brides who want understated elegance, a nude base with a single gold accent nail keeps the focus on the ring.\n\n" +
      "## 4. Chrome and Pearl Finishes\n\n" +
      "Metallic chrome or pearlescent finishes catch the light beautifully in photos and videos, especially indoor wedding lighting.\n\n" +
      "## 5. Red and Gold Traditional\n\n" +
      "A nod to traditional bridal colors — deep red with fine gold detailing, popular for brides wanting nails that match a red bridal saree or lehenga.\n\n" +
      "## 6. Almond and Coffin Shapes\n\n" +
      "These elongated shapes are the most requested for bridal extensions this season, as they photograph elegantly without looking too dramatic.\n\n" +
      "## 7. Delicate Floral Accents\n\n" +
      "Hand-painted tiny florals on one or two accent nails, popular for garden or daytime weddings.\n\n" +
      "## 8. Matte and Glossy Combinations\n\n" +
      "Mixing a matte base with glossy accent nails adds subtle dimension without being too busy.\n\n" +
      "## 9. Pastel Marble\n\n" +
      "Soft pink and gold marble combinations for brides wanting something delicate rather than bold.\n\n" +
      "## 10. Custom Monogram or Date Accent\n\n" +
      "A tiny hand-painted initial or wedding date on one accent nail — a popular personalized touch for brides who want something meaningful in their photos.\n\n" +
      "## Practical Booking Tips\n\n" +
      "Book your bridal nail trial at the same time as your makeup trial, ideally 3–4 weeks before the wedding, so you can see how everything photographs together. On the wedding day itself, book nails early enough that polish is fully cured before you start getting dressed.\n\n" +
      "Bring reference photos to your consultation — even a rough idea helps us tailor the design to your outfit, jewelry, and mehndi pattern.",
    faqs: [
      { question: "When should I book my bridal nail trial?", answer: "Ideally 3–4 weeks before the wedding, around the same time as your makeup trial." },
      { question: "How long does bridal nail art last?", answer: "With gel or extensions, well-done bridal nail art typically holds up for 2–3 weeks with proper care." },
      { question: "Should I match my nails to my mehndi?", answer: "Many brides do coordinate tones, but it's a personal choice — bring reference photos and we'll help you decide what works best." },
      { question: "Can I get nail art without extensions?", answer: "Yes — nail art can be done on natural nails with gel polish for brides who prefer not to use extensions." },
    ],
    relatedServiceLinks: [{ label: "Bridal Makeup", href: "/services#makeup" }, { label: "Nail Extension", href: "/services#nail-services" }],
    relatedCourseLinks: [{ label: "Nail Art Specialist Course", href: "/academy" }],
    category: "Nail Care",
    author: "Aasha Limbu",
    seoKeywords: ["Bridal Nail Art Nepal", "Bridal Nails Kathmandu", "Wedding Nail Art", "Nail Trends Nepal", "Bridal Nail Trends"],
    publishedAt: "2026-08-11",
  },
  {
    title: "Step-by-Step 10-Minute Everyday Makeup Routine",
    coverImageUrl: "/images/library/Asmita-blog1.webp",
    coverImageCaption: "Quick everyday makeup routine demonstration at Natural Beauty Clinic & Academy.",
    content:
      "Most people don't need — or have time for — a full glam routine every morning. Here's the quick, practical everyday routine I recommend to clients who want to look polished in 10 minutes or less.\n\n" +
      "## 1. Prep Your Skin (1 minute)\n\n" +
      "Apply a lightweight moisturizer and sunscreen. This is the single most important step — good skin prep means less makeup is needed overall.\n\n" +
      "## 2. Even Out with a Light Base (2 minutes)\n\n" +
      "Use a tinted moisturizer, BB cream, or light-coverage foundation with your fingers or a damp sponge for a quick, natural finish. Skip heavy full-coverage products for everyday wear — they take longer to apply and blend.\n\n" +
      "## 3. Conceal Only Where Needed (1 minute)\n\n" +
      "Spot-conceal under the eyes and any obvious blemishes rather than covering your whole face — this saves time and looks more natural.\n\n" +
      "## 4. Set with Minimal Powder (1 minute)\n\n" +
      "A light dusting of powder only on the T-zone keeps shine down without looking cakey or overdone.\n\n" +
      "## 5. Add Color to Cheeks (1 minute)\n\n" +
      "A cream or liquid blush blended with fingers is faster than powder and gives a natural flush. Apply to the apples of your cheeks and blend upward.\n\n" +
      "## 6. Define Eyes Quickly (2 minutes)\n\n" +
      "A neutral eyeshadow swept across the lid, a quick line of eyeliner along the upper lash line, and one coat of mascara is enough for daytime definition without a full eye look.\n\n" +
      "## 7. Shape Brows (1 minute)\n\n" +
      "A few quick strokes with a brow pencil or gel to fill sparse areas makes a bigger difference to your overall look than people expect.\n\n" +
      "## 8. Finish with Lips (1 minute)\n\n" +
      "A tinted lip balm or your everyday lipstick shade completes the look in seconds.\n\n" +
      "## Practical Tips\n\n" +
      "Keep your everyday kit to 6–7 products max — fewer decisions means faster mornings. Multi-use products (like a cream stick you can use on cheeks and lips) save real time. Practice the routine a few times on a day off so it becomes muscle memory before you need to rely on it for a rushed morning.",
    faqs: [
      { question: "Do I need to use all 8 steps every day?", answer: "No — skip whatever isn't relevant to you. Many clients drop concealer or blush on low-key days and still look polished." },
      { question: "What if I have oily skin?", answer: "Focus your powder step on the T-zone and consider a mattifying primer under your base product to help it last longer." },
      { question: "Can this routine work for office wear?", answer: "Yes, this is designed as a natural, everyday-appropriate look suitable for work, school, or errands." },
      { question: "Should I learn a full makeup routine too?", answer: "It's worth learning for special occasions — we offer beginner-friendly makeup courses if you want to build those skills." },
    ],
    relatedServiceLinks: [{ label: "Day Makeup", href: "/services#makeup" }],
    relatedCourseLinks: [{ label: "Professional Makeup Artist Course", href: "/academy" }],
    category: "Makeup",
    author: "Asmita Bista",
    seoKeywords: ["Everyday Makeup Routine", "Quick Makeup Nepal", "10 Minute Makeup", "Daily Makeup Tips", "Natural Makeup Look"],
    publishedAt: "2026-08-13",
  },
  {
    title: "How to Choose the Right Foundation Shade",
    coverImageUrl: "/images/library/Asmita-blog2.webp",
    coverImageCaption: "Foundation shade matching consultation at Natural Beauty Clinic & Academy.",
    content:
      "Picking the wrong foundation shade is one of the most common makeup mistakes I see — even with beautiful application, the wrong shade makes everything look off. Here's how to actually get it right.\n\n" +
      "## Understand Undertone First\n\n" +
      "Before shade depth, figure out your undertone: warm (yellow/golden), cool (pink/blue), or neutral (a mix of both). Check the veins on your wrist in natural light — greenish veins usually suggest warm undertones, bluish veins suggest cool, and if you can't tell, you're likely neutral.\n\n" +
      "## Test on Your Jawline, Not Your Hand\n\n" +
      "Your hand and face rarely match in tone. Always test foundation shades along your jawline and blend down toward your neck — the shade that disappears into your skin, rather than sitting as a visible line, is your match.\n\n" +
      "## Test in Natural Light\n\n" +
      "Indoor store lighting is notoriously unreliable. Step outside or near a window before deciding — a shade that looks perfect under fluorescent lights can look completely wrong in daylight.\n\n" +
      "## Consider Seasonal Changes\n\n" +
      "Your skin tone shifts slightly with sun exposure across the year. Many people need a slightly different foundation shade in summer versus winter — it's normal, not a sign you chose wrong the first time.\n\n" +
      "## When Between Two Shades\n\n" +
      "If you're between two shades, size down rather than up — foundation almost always oxidizes slightly darker after 15–20 minutes on the skin, so the lighter of the two options usually ends up being the better match.\n\n" +
      "## Practical Tips\n\n" +
      "Always let the foundation sit for a few minutes before deciding — first impressions can be misleading before it settles and oxidizes. Bring a small mirror and check your match against your neck and chest, not just your face, to avoid an obvious mismatch line. If you're unsure, ask for a professional shade-matching consultation rather than guessing — it takes a few minutes and saves you from an expensive mistake.\n\n" +
      "A well-matched foundation should be nearly invisible on the skin — the goal is even, natural-looking coverage, not a visible layer of product.",
    faqs: [
      { question: "How do I know my undertone?", answer: "Check your wrist veins in natural light — greenish suggests warm, bluish suggests cool, and a mix suggests neutral undertone." },
      { question: "Why does my foundation look different by evening?", answer: "Foundation oxidizes and can shift slightly darker or more orange over several hours — this is normal for most formulas." },
      { question: "Should I match my face or my neck?", answer: "Match to your jawline blended into your neck — a face-only match often looks obviously different from your neck and chest." },
      { question: "Do I need different foundation for summer and winter?", answer: "Many people do, since skin tone can shift slightly with sun exposure — it's common to keep two shades on hand." },
    ],
    relatedServiceLinks: [{ label: "Day Makeup", href: "/services#makeup" }, { label: "Party / Night Makeup", href: "/services#makeup" }],
    relatedCourseLinks: [{ label: "Professional Makeup Artist Course", href: "/academy" }],
    category: "Makeup",
    author: "Asmita Bista",
    seoKeywords: ["Foundation Shade Matching", "Choose Foundation Shade", "Makeup Tips Nepal", "Foundation Undertone", "Makeup Matching Guide"],
    publishedAt: "2026-08-15",
  },
];

export const blogPosts: BlogPost[] = raw
  .map((post) => ({ ...post, slug: slugify(post.title) }))
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
