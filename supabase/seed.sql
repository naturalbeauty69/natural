-- ============================================================
-- SEED DATA — Official Service Menu & Pricing
-- Source: company-provided pricing sheet. These are the exact
-- NPR figures from the brief. Admin can edit every field below
-- from the dashboard after go-live — nothing here is hardcoded
-- into the frontend.
-- ============================================================

-- ---------- CATEGORIES ----------
insert into service_categories (slug, name, display_order) values
  ('skin-treatments', 'Skin Treatments', 1),
  ('threading', 'Threading', 2),
  ('waxing', 'Waxing', 3),
  ('hair-services', 'Hair Services', 4),
  ('hair-treatments', 'Hair Treatments', 5),
  ('manicure-pedicure', 'Manicure & Pedicure', 6),
  ('makeup', 'Makeup', 7),
  ('nail-services', 'Nail Services', 8)
on conflict (slug) do nothing;

-- ---------- BRANDS (skin treatments use brand lines) ----------
insert into service_brands (name) values ('LOTUS'), ('CASMARA'), ('O3+'), ('EAR PASTING')
on conflict (name) do nothing;

-- ---------- SKIN TREATMENTS ----------
insert into services (category_id, brand_id, slug, name, price_min, price_max, display_order)
select c.id, b.id, s.slug, s.name, s.price_min, s.price_max, s.ord
from (values
  ('LOTUS', 'lotus-normal-facial', 'Normal Facial', 1800, null, 1),
  ('LOTUS', 'lotus-advance-facial', 'Advance Facial', 3500, null, 2),
  ('LOTUS', 'lotus-premium-facial', 'Premium Facial', 5500, null, 3),
  ('CASMARA', 'casmara-normal-facial', 'Normal Facial', 3500, null, 4),
  ('CASMARA', 'casmara-premium-facial', 'Premium Facial', 6000, null, 5),
  ('O3+', 'o3-cleansing-facial', 'Cleansing Facial', 2500, null, 6),
  ('O3+', 'o3-advance-facial', 'Advance Facial', 4500, null, 7),
  ('O3+', 'o3-premium-facial', 'Premium Facial', 5500, null, 8),
  ('EAR PASTING', 'ear-pasting', 'Ear Pasting', 3500, null, 9)
) as s(brand_name, slug, name, price_min, price_max, ord)
join service_brands b on b.name = s.brand_name
join service_categories c on c.slug = 'skin-treatments'
on conflict (slug) do nothing;

-- ---------- THREADING ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('eyebrow-threading', 'Eyebrow Threading', 100, null, 1),
  ('full-face-threading', 'Full Face Threading', 250, null, 2)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'threading'
on conflict (slug) do nothing;

-- ---------- WAXING ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('underarm-wax', 'Underarm Wax', 250, null, 1),
  ('hand-wax', 'Hand Wax', 500, 700, 2),
  ('full-leg-wax', 'Full Leg Wax', 700, 1500, 3),
  ('full-body-wax-polishing', 'Full Body Wax with Body Polishing', 5000, null, 4)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'waxing'
on conflict (slug) do nothing;

-- ---------- HAIR SERVICES ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('hair-cut', 'Hair Cut', 700, null, 1),
  ('hair-styling', 'Hair Styling', 500, 2500, 2),
  ('root-touch-up', 'Root Touch Up (As Per Brand)', 1500, null, 3),
  ('pre-lightening-highlight', 'Pre-Lightening / Highlight', 5500, 6500, 4),
  ('balayage', 'Balayage', 6500, 8500, 5),
  ('ombre', 'Ombre', 4500, 5500, 6),
  ('hair-oiling', 'Hair Oiling', 800, null, 7)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'hair-services'
on conflict (slug) do nothing;

-- ---------- HAIR TREATMENTS ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('hair-treatment-spa', 'Hair Treatment / Hair Spa', 1200, 2500, 1),
  ('hair-keratin', 'Hair Keratin', 3500, 7000, 2),
  ('hair-botox', 'Hair Botox', 3500, 10000, 3),
  ('nanoplastia', 'Nanoplastia', 3500, 10000, 4)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'hair-treatments'
on conflict (slug) do nothing;

-- ---------- MANICURE & PEDICURE ----------
insert into services (category_id, slug, name, price_min, price_max, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.ord from (values
  ('normal-mani-pedi', 'Normal Manicure / Pedicure', 1500, null, 1),
  ('advance-mani-pedi', 'Advance Manicure / Pedicure', 2500, null, 2),
  ('deluxe-mani-pedi', 'Deluxe Manicure / Pedicure', 3500, null, 3)
) as s(slug, name, price_min, price_max, ord)
join service_categories c on c.slug = 'manicure-pedicure'
on conflict (slug) do nothing;

-- ---------- MAKEUP ----------
insert into services (category_id, slug, name, price_min, price_max, is_featured, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.featured, s.ord from (values
  ('bridal-makeup', 'Bridal Makeup', 12000, 25000, true, 1),
  ('day-makeup', 'Day Makeup', 2500, 3500, false, 2),
  ('party-night-makeup', 'Party / Night Makeup', 2500, 3500, false, 3)
) as s(slug, name, price_min, price_max, featured, ord)
join service_categories c on c.slug = 'makeup'
on conflict (slug) do nothing;

-- ---------- NAIL SERVICES ----------
insert into services (category_id, slug, name, price_min, price_max, show_starting_from, display_order)
select c.id, s.slug, s.name, s.price_min, s.price_max, s.starting, s.ord from (values
  ('gel-polish', 'Gel Polish', 1000, null, true, 1),
  ('gel-overlay', 'Gel Overlay', 1300, null, false, 2),
  ('nail-refill', 'Nail Refill', 1300, null, false, 3),
  ('nail-extension', 'Nail Extension', 1500, null, false, 4),
  ('nail-removal', 'Nail Removal', 500, null, false, 5),
  ('toe-nail-extension', 'Toe Nail Extension', 1600, 2500, false, 6)
) as s(slug, name, price_min, price_max, starting, ord)
join service_categories c on c.slug = 'nail-services'
on conflict (slug) do nothing;

-- ---------- ACADEMY COURSES ----------
insert into courses (slug, name, category, level, duration, price, display_order) values
  ('basic-beautician-course', 'Basic Beautician Course', 'Beauty & Skin Care', 'Beginner', '1–3 Months', 35000, 1),
  ('advanced-beautician-course', 'Advanced Beautician Course', 'Beauty & Skin Care', 'Intermediate', '3–6 Months', 65000, 2),
  ('professional-makeup-artist-course', 'Professional Makeup Artist Course', 'Makeup', 'Beginner / Advanced', '1–3 Months', 45000, 3),
  ('bridal-makeup-specialist-course', 'Bridal Makeup Specialist Course', 'Makeup', 'Advanced', 'Short Term', 25000, 4),
  ('hair-dressing-course', 'Hair Dressing Course', 'Hair Care', 'Beginner / Professional', '3–6 Months', 55000, 5),
  ('hair-science-course', 'Hair Science Course', 'Hair & Trichology', 'Advanced', 'Short Term', 30000, 6),
  ('skin-care-specialist-course', 'Skin Care Specialist Course', 'Skin Treatment', 'Professional', '3–6 Months', 60000, 7),
  ('facial-aesthetic-treatment-course', 'Facial & Aesthetic Treatment Course', 'Advanced Skin Care', 'Advanced', 'Short Term', 35000, 8),
  ('nail-technician-course', 'Nail Technician Course', 'Nail Technology', 'Beginner', '1–3 Months', 40000, 9),
  ('nail-art-specialist-course', 'Nail Art Specialist Course', 'Nail Technology', 'Advanced', 'Short Term', 25000, 10),
  ('salon-management-course', 'Salon Management Course', 'Business Management', 'Professional', 'Short Term', 30000, 11)
on conflict (slug) do nothing;

-- ---------- TESTIMONIALS ----------
insert into testimonials (customer_name, location, rating, content) values
  ('Priya Shrestha', 'Kathmandu', 5, 'I had an amazing experience at Natural Beauty Clinic & Academy. The skin analysis and facial treatment were professional, and my skin feels healthier than ever. The staff were friendly and knowledgeable.'),
  ('Sushmita Karki', 'Lalitpur', 5, 'The bridal makeup exceeded my expectations. It looked natural, elegant, and lasted throughout the entire event. Thank you for making my special day even more memorable.'),
  ('Nirmala Gautam', 'Bhaktapur', 5, 'I completed the Professional Beautician Course here. The practical training, supportive instructors, and modern teaching methods gave me the confidence to start my own beauty career.'),
  ('Anisha Thapa', 'Kathmandu', 5, 'The hair spa and keratin treatment completely transformed my damaged hair. The clinic maintains excellent hygiene and uses quality products.'),
  ('Rita Sharma', 'Kirtipur', 5, 'Professional service, welcoming environment, and reasonable prices. I highly recommend Natural Beauty Clinic & Academy for anyone looking for quality beauty treatments.'),
  ('Sabina KC', 'Pokhara', 5, 'The trainers are experienced and explain every technique clearly. I learned practical skills that prepared me for real salon work.');

-- ---------- FAQs ----------
insert into faqs (question, answer, display_order) values
  ('How do I book an appointment?', 'You can book an appointment by calling or messaging us on +977 9843805588, sending us a message through our Facebook, Instagram, or TikTok pages, or by filling out the appointment form on our website.', 1),
  ('What are the fees for beauty services and courses?', 'Our service and course fees vary depending on the treatment or training program. Please contact us directly for the latest price list, special offers, and course packages.', 2),
  ('Is a certificate provided after completing the course?', 'Yes. Students who successfully complete their training and meet the required attendance and practical assessment criteria receive a certificate from Natural Beauty Clinic & Academy.', 3),
  ('What payment methods do you accept?', 'We accept cash, eSewa, bank transfer, and other digital payment methods where available. Please contact us if you need assistance with payment.', 4),
  ('How long are the beauty courses?', 'Course duration depends on the program you choose. We offer short-term skill courses, one-month professional courses, advanced training programs, and customized training schedules. Contact us to find the course that best suits your goals.', 5),
  ('Can beginners join the courses?', 'Absolutely. Our beginner-friendly courses are designed for students with no prior experience. We also offer advanced courses for professionals who want to enhance their skills.', 6),
  ('Do I need to bring my own beauty kit?', 'No. Practical tools and equipment are available during training. For some advanced courses, students may choose to purchase their own professional kits for practice and future work.', 7),
  ('Are practical classes included?', 'Yes. Our courses emphasize hands-on practical training under the guidance of experienced beauty professionals, ensuring students gain real-world skills.', 8),
  ('Do you offer skin consultations before treatment?', 'Yes. We provide professional skin consultations and skin analysis to recommend the most suitable treatments and skincare plan based on your individual needs.', 9),
  ('Where is Natural Beauty Clinic & Academy located?', 'We are located at New Baneshwor, Opposite the Overhead Bridge, Kathmandu, Nepal.', 10),
  ('What are your business hours?', 'Sunday – Saturday: 10:00 AM – 7:00 PM.', 11),
  ('How can I contact Natural Beauty Clinic & Academy?', 'Phone/WhatsApp: +977 9843805588 · Alternate Contact: +977 9823207031 · Email: archanabeauty07@gmail.com · Address: New Baneshwor, Opposite the Overhead Bridge, Kathmandu, Nepal.', 12);

-- ---------- BLOG POSTS ----------
insert into blog_posts (slug, title, cover_image_caption, content, category, published_at, seo_keywords, display_order) values
  ('the-ultimate-guide-to-healthy-glowing-skin', 'The Ultimate Guide to Healthy, Glowing Skin', 'Beautiful woman receiving a professional Hydra Facial treatment in a modern beauty clinic.', 'Healthy skin begins with proper skincare, hydration, nutrition, and professional treatments. Daily cleansing, moisturizing, sunscreen, and regular skin analysis help maintain radiant skin. Professional facials such as Hydra Facial and Medi Facial deeply cleanse the skin, improve hydration, reduce pigmentation, and promote a youthful glow. At Natural Beauty Clinic & Academy, every skin treatment is customized according to your skin type and concerns.', 'Skin Care', '2026-03-15', array['Healthy Skin','Hydra Facial','Skin Care Nepal','Facial Treatment Kathmandu','Beauty Clinic'], 1),
  ('how-to-prevent-hair-fall-naturally-and-professionally', 'How to Prevent Hair Fall Naturally and Professionally', 'Professional hair consultation and scalp analysis.', 'Hair fall can result from stress, poor nutrition, hormonal imbalance, or improper hair care. Regular scalp treatments, healthy eating, proper hair washing techniques, and professional consultation can significantly reduce hair loss. Our clinic provides advanced scalp analysis and personalized hair care solutions to promote healthy hair growth.', 'Hair Care', '2026-04-05', array['Hair Fall Treatment','Hair Care Nepal','Hair Growth','Scalp Treatment','Healthy Hair'], 2),
  ('why-professional-skin-analysis-is-important', 'Why Professional Skin Analysis Is Important', 'Advanced digital skin analysis machine.', 'Every person''s skin is unique. A professional skin analysis identifies concerns such as acne, pigmentation, dehydration, sensitivity, enlarged pores, and aging. Understanding your skin condition allows professionals to recommend the most suitable treatments and skincare products for long-term results.', 'Skin Analysis', '2026-04-20', array['Skin Analysis','Digital Skin Test','Skin Diagnosis','Beauty Clinic Kathmandu'], 3),
  ('top-beauty-courses-to-build-a-successful-career', 'Top Beauty Courses to Build a Successful Career', 'Students practicing professional beauty techniques.', 'The beauty industry offers excellent career opportunities. Professional beautician, makeup artist, nail technician, hairdresser, and skincare specialist courses provide practical skills for employment or starting your own beauty business. Our academy emphasizes hands-on learning and industry-ready training.', 'Beauty Education', '2026-05-10', array['Beautician Course Nepal','Makeup Course','Beauty Academy Kathmandu','Hair Science Course'], 4),
  ('hydra-facial-benefits-for-every-skin-type', 'Hydra Facial: Benefits for Every Skin Type', 'Hydra Facial treatment session.', 'Hydra Facial deeply cleanses, exfoliates, hydrates, and nourishes the skin without discomfort. It improves skin texture, reduces fine lines, minimizes pores, and restores a healthy glow. Suitable for most skin types, Hydra Facial is a popular choice for maintaining healthy skin year-round.', 'Facial Treatment', '2026-05-28', array['Hydra Facial Nepal','Facial Treatment','Skin Glow','Skin Rejuvenation'], 5),
  ('bridal-makeup-tips-for-a-perfect-wedding-look', 'Bridal Makeup Tips for a Perfect Wedding Look', 'Professional bridal makeup transformation.', 'A flawless bridal look begins with proper skincare, trial makeup sessions, and selecting a style that complements your features and attire. Professional bridal makeup enhances natural beauty while ensuring long-lasting results throughout the wedding celebrations.', 'Makeup', '2026-06-12', array['Bridal Makeup Kathmandu','Wedding Makeup Nepal','Professional Makeup Artist'], 6),
  ('the-importance-of-sunscreen-in-every-season', 'The Importance of Sunscreen in Every Season', 'Woman applying sunscreen outdoors.', 'Daily sunscreen use protects the skin from harmful UV rays, premature aging, pigmentation, and sun damage. Applying a broad-spectrum sunscreen every morning and reapplying as needed helps maintain healthy, youthful-looking skin regardless of the season.', 'Skin Care', '2026-06-25', array['Sunscreen','UV Protection','Skin Care Tips','Healthy Skin Nepal'], 7),
  ('keratin-treatment-vs-hair-smoothening-which-is-better', 'Keratin Treatment vs Hair Smoothening: Which Is Better?', 'Before-and-after professional hair treatment.', 'Keratin treatment nourishes hair while reducing frizz and enhancing shine. Hair smoothening focuses on creating straighter, more manageable hair. The right choice depends on your hair type, condition, and desired results. Professional consultation ensures the most suitable treatment.', 'Hair Treatment', '2026-07-08', array['Keratin Treatment','Hair Smoothening','Hair Care Kathmandu','Hair Salon Nepal'], 8),
  ('essential-skincare-routine-for-every-skin-type', 'Essential Skincare Routine for Every Skin Type', 'Professional skincare products arranged neatly.', 'An effective skincare routine includes cleansing, toning, moisturizing, sunscreen, and periodic exfoliation. Choosing products according to your skin type helps prevent acne, dryness, sensitivity, and premature aging while maintaining healthy skin.', 'Beauty Tips', '2026-07-18', array['Skincare Routine','Beauty Tips Nepal','Healthy Skin','Daily Skin Care'], 9),
  ('how-professional-beauty-training-can-change-your-career', 'How Professional Beauty Training Can Change Your Career', 'Beauty academy students during practical training.', 'Professional beauty education provides practical experience, technical expertise, and confidence needed for success in the beauty industry. Graduates can work in salons, beauty clinics, spas, wellness centers, or establish their own businesses. Continuous learning and practical training are key to long-term success.', 'Beauty Academy', '2026-07-25', array['Beauty Training Nepal','Beautician Course','Professional Beauty Education','Beauty Career','Beauty Academy Kathmandu'], 10);
insert into team_members (slug, name, role, bio, photo_url, display_order) values
  ('archana-silwal-kadel', 'Archana Silwal Kadel', 'Owner & Director',
   'Founder, Owner, and Director of Natural Beauty Clinic & Academy. Leads the clinic and academy with a commitment to professional beauty services, advanced skincare, client satisfaction, staff development, and high-quality beauty education while maintaining excellent service standards.',
   '/images/team/archana-silwal-kadel.jpg', 1),
  ('krishna-gurung', 'Krishna Gurung', 'Accountant & Manager',
   'Responsible for accounting, financial management, inventory control, supplier coordination, customer service, daily business operations, administration, and ensuring the smooth operation of the clinic and academy.',
   '/images/team/krishna-gurung.jpg', 2),
  ('sandip-thakur', 'Sandip Thakur', 'Hairdresser',
   'Professional Hairdresser specializing in modern haircuts, hairstyling, hair coloring, hair spa, hair treatments, and personalized grooming services. Dedicated to helping clients achieve healthy, stylish, and confident looks.',
   '/images/team/sandip-thakur.jpg', 3),
  ('asmita-bista', 'Asmita Bista', 'Assistant Beautician',
   'Assists senior beauticians with skincare treatments, facials, beauty therapies, client preparation, hygiene standards, salon organization, and customer care while helping deliver professional beauty services.',
   '/images/team/asmita-bista.jpg', 4),
  ('aasha-limbu', 'Aasha Limbu', 'Nail Technician',
   'Professional Nail Technician specializing in manicure, pedicure, nail extensions, gel polish, nail art, and complete nail care. Committed to providing hygienic, elegant, and long-lasting nail services.',
   '/images/team/aasha-limbu.jpg', 5),
  ('susmita-gautam', 'Susmita Gautam', 'Office Helper',
   'Supports daily office operations by maintaining cleanliness, organizing supplies, assisting staff, welcoming clients, preparing work areas, and helping ensure smooth day-to-day operations within the clinic and academy.',
   '/images/team/susmita-gautam.jpg', 6)
on conflict (slug) do nothing;

-- ---------- SITE SETTINGS ----------
insert into site_settings (key, value) values
  ('contact', '{
    "phones": ["9843805588", "9823207031"],
    "whatsapp": "+9779843805588",
    "email": "archanabeauty07@gmail.com",
    "address": "New Baneshwor, Opposite the Overhead Bridge, Kathmandu, Nepal",
    "tiktok": "https://www.tiktok.com/@naturalbeautyclinic5",
    "facebook": "https://www.facebook.com/profile.php?id=100063534103647",
    "instagram": "https://www.instagram.com/archanasilwal4",
    "esewa": "9843805588",
    "mapEmbedUrl": "https://maps.google.com/maps?q=Natural+Beauty+Clinic+and+Academy+New+Baneshwor+Kathmandu&output=embed",
    "businessHours": "Sunday – Saturday: 10:00 AM – 7:00 PM"
  }'),
  ('homepage_content', '{
    "heroHeading": "Reveal Your Natural Beauty with Expert Care & Professional Training",
    "heroDescription": "Experience premium skin, hair, makeup, and beauty treatments while building a successful career through Nepal''s trusted beauty academy. At Natural Beauty Clinic & Academy, we combine advanced technology, expert professionals, and hands-on education to help you look your best and achieve your dreams.",
    "heroCtas": [
      {"label": "Book an Appointment", "href": "/appointment", "style": "gold"},
      {"label": "Explore Our Courses", "href": "/academy", "style": "outline"},
      {"label": "Contact Us", "href": "/contact", "style": "primary"}
    ],
    "aboutHeading": "Welcome to Natural Beauty Clinic & Academy",
    "aboutContent": [
      "Established on 25 March 2019, Natural Beauty Clinic & Academy is one of Kathmandu''s trusted destinations for professional beauty services and career-focused beauty education. Located in New Baneshwor, we specialize in advanced skincare, haircare, makeup artistry, nail technology, and aesthetic treatments using modern equipment and premium products.",
      "Our academy provides practical, industry-oriented training designed to prepare students for successful careers in Nepal and abroad. Whether you are visiting for a beauty transformation or professional training, our experienced team is committed to delivering excellence, safety, and personalized care."
    ],
    "statistics": [
      {"value": "7+", "label": "Years of Professional Experience"},
      {"value": "5,000+", "label": "Happy Clients"},
      {"value": "1,000+", "label": "Students Trained"},
      {"value": "50+", "label": "Professional Beauty Courses"},
      {"value": "25+", "label": "Advanced Beauty & Skin Treatments"},
      {"value": "98%", "label": "Client Satisfaction"},
      {"value": "100%", "label": "Practical Training"},
      {"value": "100+", "label": "Bridal Makeovers Completed"},
      {"value": "Certified", "label": "Beauty Professionals"},
      {"value": "Modern", "label": "Equipment & Premium Products"}
    ]
  }'),
  ('company_profile', '{
    "registrationNumber": "211472/075/076",
    "panVatNumber": "606806860",
    "established": "25 March 2019",
    "mission": "To transform lives by enhancing beauty, confidence, and professional skills through exceptional beauty treatments, innovative techniques, and internationally inspired beauty education.",
    "vision": "To become Nepal''s most trusted and innovative beauty clinic and academy, recognized nationally and internationally for excellence in beauty services, education, customer satisfaction, and professional development.",
    "coreValues": ["Professionalism","Excellence","Integrity","Innovation","Client Satisfaction","Quality Education","Safety & Hygiene","Continuous Learning","Respect","Empowerment","Teamwork","Ethical Practice"],
    "whyChooseUs": ["Established and trusted since 2019","Certified beauty professionals and trainers","Advanced skin and hair treatment technologies","Personalized beauty consultations","Hygienic and modern treatment environment","Practical hands-on beauty education","Career-focused training programs","Premium professional products","Affordable and transparent pricing","Commitment to client satisfaction"],
    "seoKeywords": ["Beauty Clinic in Kathmandu","Beauty Academy Nepal","Skin Clinic Kathmandu","Hair Treatment Nepal","Professional Makeup Academy","Beautician Training Nepal","Hydra Facial Kathmandu","Hair Science Course Nepal","Bridal Makeup Kathmandu","Nail Technician Course","Skin Care Training","Hair Care Training","Professional Beauty Institute Nepal","Natural Beauty Clinic & Academy"]
  }'),
  ('company_story', '{
    "heading": "Transforming Beauty, Inspiring Confidence",
    "content": [
      "Founded on 25 March 2019, Natural Beauty Clinic & Academy was established with a vision to redefine beauty care and professional beauty education in Nepal. What began as a dream to provide high-quality beauty services has grown into a trusted destination for advanced skincare, haircare, makeup artistry, nail technology, and career-focused beauty training.",
      "Located in New Baneshwor, Kathmandu, our clinic combines modern beauty technology, premium products, and personalized care to help every client achieve healthy skin, beautiful hair, and lasting confidence.",
      "Beyond beauty services, our academy is dedicated to empowering aspiring beauty professionals through practical, industry-oriented education. Our hands-on training programs equip students with the knowledge, technical skills, and confidence needed to build successful careers in Nepal and internationally.",
      "Today, Natural Beauty Clinic & Academy continues to uphold the highest standards of professionalism, innovation, hygiene, and customer satisfaction while creating a welcoming environment where beauty meets education and every individual is valued."
    ]
  }'),
  ('owner_story', '{
    "name": "Archana Silwal Kadel",
    "title": "Founder | Director | Senior Beautician | Trainer | Assessor",
    "content": [
      "Natural Beauty Clinic & Academy is the realization of the lifelong passion of Archana Silwal Kadel, a dedicated beauty professional committed to transforming lives through beauty, education, and empowerment.",
      "With years of practical experience in skincare, haircare, makeup artistry, beauty therapy, and professional training, she founded the clinic with a simple yet powerful belief: true beauty begins with confidence, knowledge, and professional care.",
      "As a trainer and assessor, she has guided numerous students toward rewarding careers in the beauty industry by emphasizing practical learning, ethical practices, and continuous skill development. Her dedication to excellence has earned the trust of clients and students alike, making the academy a respected name in Nepal''s beauty industry.",
      "Her vision continues to inspire the growth of Natural Beauty Clinic & Academy as a center of excellence in beauty services and professional education."
    ]
  }'),
  ('director_message', '{
    "content": [
      "Welcome to Natural Beauty Clinic & Academy.",
      "It is my great pleasure to welcome you to our clinic and academy. Since our establishment in 2019, our goal has been to provide exceptional beauty services while empowering individuals with professional skills that create lifelong career opportunities.",
      "Every client who visits us deserves personalized care, professional treatment, and the highest standards of safety and hygiene. Every student who joins our academy deserves practical education, confidence, and the knowledge required to succeed in today''s competitive beauty industry.",
      "We continuously embrace innovation, modern techniques, and international beauty standards to ensure that both our services and training remain among the best in Nepal.",
      "Thank you for placing your trust in us. We look forward to being part of your beauty journey and professional success."
    ],
    "signOffName": "Archana Silwal Kadel",
    "signOffTitle": "Founder & Director, Natural Beauty Clinic & Academy"
  }'),
  ('company_timeline', '[
    {"year": "2019", "title": "The Beginning", "points": ["Established on 25 March 2019", "Official business registration completed", "Opened Natural Beauty Clinic & Academy in New Baneshwor, Kathmandu"]},
    {"year": "2020", "title": "Building Trust", "points": ["Expanded beauty and skincare services", "Earned the trust of local clients through quality service and professional care"]},
    {"year": "2021", "title": "Expanding Professional Training", "points": ["Introduced practical beautician and makeup training programs", "Focused on hands-on learning and industry standards"]},
    {"year": "2022", "title": "Service Enhancement", "points": ["Added advanced skin, hair, and aesthetic treatments", "Upgraded beauty equipment and professional products"]},
    {"year": "2023", "title": "Growth & Recognition", "points": ["Expanded academy offerings with specialized beauty courses", "Strengthened reputation for quality education and client satisfaction"]},
    {"year": "2024", "title": "Innovation & Digital Presence", "points": ["Enhanced online presence through social media", "Improved consultation and customer engagement", "Continued modernization of services and training"]},
    {"year": "2025", "title": "Excellence in Beauty & Education", "points": ["Expanded advanced treatment options", "Continued producing skilled beauty professionals", "Strengthened commitment to quality, hygiene, and innovation"]},
    {"year": "2026", "title": "Looking Ahead", "points": ["Continuing to provide world-class beauty services and practical education", "Expanding digital learning, advanced technologies, and opportunities for students", "Working toward becoming one of Nepal''s most trusted and respected beauty clinics and academies"]}
  ]')
on conflict (key) do update set value = excluded.value, updated_at = now();
