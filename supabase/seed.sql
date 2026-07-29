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

update team_members set gallery = array[
  '/images/team-gallery/Krishna-gurung 1.webp',
  '/images/team-gallery/Krishna-gurung2.webp',
  '/images/team-gallery/Krishna-gurung3.webp',
  '/images/team-gallery/Krishna-gurung4.webp',
  '/images/team-gallery/Krishna-gurung5.webp'
] where slug = 'krishna-gurung';

update team_members set gallery = array[
  '/images/team-gallery/Sandip1.webp',
  '/images/team-gallery/Sandip2.webp',
  '/images/team-gallery/Sandip3.webp',
  '/images/team-gallery/Sandip4.webp',
  '/images/team-gallery/Sandip5.webp',
  '/images/team-gallery/Sandip6.webp',
  '/images/team-gallery/Sandip7.webp',
  '/images/team-gallery/Sandip8.webp',
  '/images/team-gallery/Sandip9.webp',
  '/images/team-gallery/Sandip10.webp',
  '/images/team-gallery/Sandip11.webp'
] where slug = 'sandip-thakur';

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

-- ---------- BLOG POSTS (author-bylined batch 2) ----------
insert into blog_posts (slug, title, cover_image_caption, content, category, author, published_at, seo_keywords, display_order) values
  ('ultimate-guide-to-hydrafacial-in-kathmandu-benefits-process-and-local-prices', 'Ultimate Guide to HydraFacial in Kathmandu: Benefits, Process, and Local Prices', 'HydraFacial treatment session at Natural Beauty Clinic & Academy.', 'If you''ve been researching ways to get brighter, smoother, more hydrated skin without downtime, you''ve likely come across HydraFacial. It''s one of the most requested treatments at our clinic, and for good reason — it delivers visible results after a single session with none of the redness or peeling associated with harsher treatments.

## What Is a HydraFacial?

HydraFacial is a multi-step skin resurfacing treatment that cleanses, exfoliates, extracts impurities, and infuses the skin with hydrating serums — all in one session. Unlike traditional facials, it uses a device that combines suction-based exfoliation with simultaneous serum delivery, so dead skin is lifted away while nutrients are pushed in at the same time.

## Who Is It For?

HydraFacial suits most skin types, including sensitive skin, because the pressure and serums used are adjusted to your skin''s condition during consultation. It''s popular among clients dealing with dullness, mild congestion, uneven texture, or simply wanting a healthy glow before an event.

## The Process, Step by Step

A typical session includes cleansing and gentle exfoliation, a mild acid peel to loosen debris, painless extraction of blackheads and congestion using suction, and a final infusion of hydrating and brightening serums tailored to your skin''s needs. The full treatment usually takes 45–60 minutes, and you can return to normal activities immediately.

## What Results to Expect

Most clients notice smoother texture and a visible glow immediately after their first session. For concerns like dullness or mild congestion, results build with regular treatments — we typically recommend a session every 4–6 weeks for maintenance, similar to international HydraFacial guidelines.

## Local Pricing in Kathmandu

At Natural Beauty Clinic & Academy, HydraFacial pricing depends on which serum protocol and add-ons are used for your skin. Our general facial and skin treatment pricing is listed on our Services page — during your consultation, we''ll recommend the right protocol and confirm the exact price before you commit to anything.

## Practical Tips Before You Book

Avoid strong exfoliating actives (like retinol or AHA/BHA products) for 2–3 days before your appointment. Skip waxing or threading on the treatment area right before your session. Let your esthetician know about any active breakouts, cold sores, or skin conditions beforehand so the protocol can be adjusted safely.

If you''re looking for a reliable, low-downtime way to refresh your skin — whether for a special occasion or as part of a regular skincare routine — HydraFacial is one of the safest, most consistent options available, and one I personally recommend to clients who are new to professional skin treatments.', 'Skin Care', 'Archana Silwal Kadel', '2026-08-01', array['HydraFacial Kathmandu','HydraFacial Nepal price','Facial Treatment Kathmandu','Skin Care Nepal','Natural Beauty Clinic HydraFacial'], 100),
  ('the-ultimate-pre-bridal-skincare-timeline-for-nepalese-brides-6-month-plan', 'The Ultimate Pre-Bridal Skincare Timeline for Nepalese Brides (6-Month Plan)', 'Bridal skincare consultation and treatment at Natural Beauty Clinic & Academy.', 'Every bride wants clear, radiant skin on her wedding day — but rushing skincare treatments in the final week rarely gives real results, and can sometimes backfire with irritation or breakouts. The best approach starts months in advance, giving your skin time to respond gradually and safely. Here''s the timeline I walk my bridal clients through.

## 6 Months Before: Build the Foundation

This is the time to get a proper skin consultation and start a consistent daily routine — cleansing, moisturizing, and daily sunscreen, non-negotiably. If you have ongoing concerns like pigmentation, acne scarring, or dullness, this is also when to start a course of professional facials or skin treatments, since these need repetition over time to show real change.

## 4 Months Before: Address Specific Concerns

With a solid routine in place, this is the window to consider treatments like chemical peels, advanced facials, or pigmentation-focused sessions, spaced a few weeks apart. Avoid starting anything aggressive or experimental this close to the wedding without first testing how your skin reacts.

## 2 Months Before: Refine and Maintain

Continue your regular facials every 3–4 weeks. This is a good time for a professional skin analysis to check progress and adjust your routine. Avoid introducing brand-new products or treatments you haven''t tried before — your skin should be in a stable, predictable rhythm by now.

## 1 Month Before: Polish, Don''t Experiment

Stick to treatments you know your skin tolerates well. A gentle, hydrating facial 2–3 weeks before the wedding is ideal for a final glow without risking irritation. This is not the time to try a new peel or aggressive treatment for the first time.

## Final Week: Keep It Simple

In the last week, avoid any new products, treatments, or extractions. A light hydrating facial 3–5 days before the event (not the day before) gives your skin time to settle. Prioritize sleep, hydration, and stress management — they show on your skin more than any last-minute treatment can.

## Practical Tips

Always patch-test new products weeks in advance, never the week of. Keep your skincare consistent even during pre-wedding stress and travel. Communicate openly with your esthetician about your wedding date so every treatment is timed correctly, with no surprises.

Every bride''s skin is different, which is why we recommend starting with a one-on-one consultation to build a timeline around your specific skin, not a generic checklist.', 'Skin Care', 'Archana Silwal Kadel', '2026-08-03', array['Pre-Bridal Skincare Nepal','Bridal Skincare Timeline','Bridal Facial Kathmandu','Wedding Skincare Nepal','Bridal Skin Prep'], 100),
  ('hair-botox-vs-keratin-treatment-in-nepal', 'Hair Botox vs. Keratin Treatment in Nepal', 'Hair Botox and Keratin treatment comparison at Natural Beauty Clinic & Academy.', 'Two of the most common questions I get at the salon are "what''s the difference between Hair Botox and Keratin?" and "which one is right for me?" Both treatments smooth and strengthen hair, but they work differently and suit different hair concerns — here''s how to tell them apart.

## What Keratin Treatment Does

Keratin treatment works by coating the hair shaft with keratin protein, sealing the cuticle and reducing frizz. It''s especially effective for very curly, frizzy, or chemically damaged hair that needs significant smoothing. Results typically last 3–5 months depending on hair type and aftercare.

## What Hair Botox Does

Despite the name, Hair Botox contains no actual botulinum toxin — it''s a deep conditioning treatment infused with proteins, vitamins, and amino acids that fill in damaged areas of the hair shaft. It focuses more on repairing and nourishing than heavy smoothing, making it gentler and better suited to fine, damaged, or color-treated hair that needs strengthening rather than straightening.

## Key Differences

Keratin gives a straighter, sleeker finish and holds up longer on very frizzy hair. Hair Botox gives a softer, more natural, bouncier finish and is generally considered gentler on the hair over repeated use. Keratin treatments traditionally use formaldehyde-releasing chemicals (though many modern salons, including ours, use formaldehyde-free formulas) — always ask your salon which formula they use.

## Which One Should You Choose?

If your main concern is frizz and you want straighter, smoother hair with strong hold, Keratin is usually the better fit. If your hair is fine, damaged, over-processed, or color-treated and needs repair and nourishment more than straightening, Hair Botox is often the gentler choice. During consultation, we assess your hair''s condition and porosity before recommending either.

## Practical Aftercare Tips

Use sulfate-free shampoo to extend the life of either treatment. Avoid tying your hair up or tucking it behind your ears for the first 24–72 hours after Keratin treatments specifically, as instructed by your stylist. Space out chemical treatments — don''t combine color and smoothing treatments too close together, as this increases damage risk.

Both treatments can give beautiful results when matched to the right hair type. If you''re unsure which is right for you, come in for a consultation — we''ll examine your hair''s condition first rather than guessing.', 'Hair Treatment', 'Sandip Thakur', '2026-08-05', array['Hair Botox vs Keratin','Hair Botox Nepal','Keratin Treatment Kathmandu','Hair Smoothening Nepal','Hair Treatment Comparison'], 100),
  ('why-hair-fall-increases-in-kathmandu-how-to-stop-it', 'Why Hair Fall Increases in Kathmandu & How to Stop It', 'Scalp and hair fall consultation at Natural Beauty Clinic & Academy.', 'Many clients tell me their hair fall gets noticeably worse after moving to or living in Kathmandu, especially during certain seasons. This isn''t just anecdotal — there are real environmental and lifestyle factors at play in the valley that contribute to increased shedding.

## Why Kathmandu''s Environment Affects Hair

Kathmandu''s air quality, particularly dust and pollution levels, can clog the scalp''s pores and follicles, weakening hair over time. Hard water common in parts of the valley can also leave mineral buildup on the scalp, making hair drier and more prone to breakage. Seasonal dryness during winter months adds further stress.

## Common Contributing Factors

Beyond environment, hair fall is often driven by stress, poor scalp hygiene, harsh or infrequent washing habits, nutritional gaps (especially iron, protein, and biotin deficiencies), and hormonal changes. Tight hairstyles worn daily can also contribute to traction-related thinning over time.

## What You Can Do: Practical Steps

Wash your scalp regularly to remove dust and product buildup — how often depends on your hair type, but don''t let buildup sit for too long. Use a clarifying shampoo occasionally if you''re in a hard-water area. Deep condition or oil your scalp weekly to counter environmental dryness. Eat a balanced diet with enough protein and iron, since hair is largely built from protein. Avoid excessively tight hairstyles worn every day.

## When Professional Treatment Helps

If home care isn''t enough, a professional scalp analysis can identify whether the cause is buildup, dryness, breakage, or something that needs a dermatologist''s input. Scalp treatments and targeted hair spa sessions can meaningfully improve scalp health and reduce shedding caused by environmental stress — though sudden, severe, or patchy hair loss should always be checked by a doctor, since it may point to a medical cause treatments alone won''t fix.

## A Realistic Expectation

Some daily shedding (50–100 hairs) is completely normal. What matters is whether you''re seeing a noticeable increase, thinning patches, or a receding hairline — those are signs to get a proper consultation rather than guess with random products.', 'Hair Care', 'Sandip Thakur', '2026-08-07', array['Hair Fall Kathmandu','Hair Fall Treatment Nepal','Scalp Treatment Kathmandu','Hair Care Nepal','Hair Loss Causes'], 100),
  ('gel-extensions-vs-acrylic-nails', 'Gel Extensions vs. Acrylic Nails', 'Gel and acrylic nail extension comparison at Natural Beauty Clinic & Academy.', 'Choosing between gel extensions and acrylic is one of the most common questions I get from clients booking their first nail appointment. Both create beautiful, long-lasting extensions, but they differ in application, feel, and maintenance — here''s what to actually consider.

## What Acrylic Nails Are

Acrylic extensions are made by mixing a liquid monomer with a powder polymer, which hardens into a strong, durable layer over a nail tip or form. Acrylic is known for being very strong and long-lasting, which makes it popular for clients who are hard on their hands or want maximum durability.

## What Gel Extensions Are

Gel extensions use a gel product cured under UV or LED light rather than air-drying. Gel tends to feel lighter and more flexible than acrylic, with a glossier, more natural-looking finish straight off the table without needing a separate topcoat.

## Comparing the Two

Acrylic is generally more affordable and slightly more durable for very active hands, but has a stronger odor during application and can feel heavier. Gel is lighter, glossier, and gentler on the natural nail, but can be pricier and is somewhat less impact-resistant than acrylic for heavy daily wear.

## Which Should You Choose?

If you work with your hands a lot or want maximum strength, acrylic is often the more practical choice. If you prioritize a natural, lightweight feel and don''t mind slightly more careful handling, gel is usually preferred. Both can look equally beautiful — the right choice comes down to your lifestyle and nail habits, not one being objectively better.

## Practical Aftercare Tips

Always let a technician remove extensions properly — never pick or pull them off, as this can damage your natural nail underneath. Keep cuticles moisturized between appointments to prevent lifting. Get fills every 2–3 weeks to keep extensions looking neat and prevent breakage at the regrowth line.

Whichever you choose, the technician''s skill matters more than the material — proper prep and application is what actually determines how long your extensions last and how healthy your natural nails stay underneath.', 'Nail Care', 'Aasha Limbu', '2026-08-09', array['Gel vs Acrylic Nails','Nail Extension Kathmandu','Nail Technician Nepal','Gel Nails Nepal','Acrylic Nails Kathmandu'], 100),
  ('top-10-bridal-nail-art-trends-in-nepal', 'Top 10 Bridal Nail Art Trends in Nepal', 'Bridal nail art design at Natural Beauty Clinic & Academy.', 'Bridal nail art has become just as important as bridal makeup for many of my clients — it''s a small detail that shows up in every ring photo. Here are the trends I''m seeing the most requests for this wedding season in Nepal.

## 1. Classic French with a Twist

The traditional French tip reimagined with gold micro-detailing or a colored line instead of plain white — elegant and photograph-friendly.

## 2. Rose Gold Marble

Soft marble swirls in rose gold and cream tones pair beautifully with most bridal jewelry and mehndi designs.

## 3. Minimalist Nude with Gold Accents

For brides who want understated elegance, a nude base with a single gold accent nail keeps the focus on the ring.

## 4. Chrome and Pearl Finishes

Metallic chrome or pearlescent finishes catch the light beautifully in photos and videos, especially indoor wedding lighting.

## 5. Red and Gold Traditional

A nod to traditional bridal colors — deep red with fine gold detailing, popular for brides wanting nails that match a red bridal saree or lehenga.

## 6. Almond and Coffin Shapes

These elongated shapes are the most requested for bridal extensions this season, as they photograph elegantly without looking too dramatic.

## 7. Delicate Floral Accents

Hand-painted tiny florals on one or two accent nails, popular for garden or daytime weddings.

## 8. Matte and Glossy Combinations

Mixing a matte base with glossy accent nails adds subtle dimension without being too busy.

## 9. Pastel Marble

Soft pink and gold marble combinations for brides wanting something delicate rather than bold.

## 10. Custom Monogram or Date Accent

A tiny hand-painted initial or wedding date on one accent nail — a popular personalized touch for brides who want something meaningful in their photos.

## Practical Booking Tips

Book your bridal nail trial at the same time as your makeup trial, ideally 3–4 weeks before the wedding, so you can see how everything photographs together. On the wedding day itself, book nails early enough that polish is fully cured before you start getting dressed.

Bring reference photos to your consultation — even a rough idea helps us tailor the design to your outfit, jewelry, and mehndi pattern.', 'Nail Care', 'Aasha Limbu', '2026-08-11', array['Bridal Nail Art Nepal','Bridal Nails Kathmandu','Wedding Nail Art','Nail Trends Nepal','Bridal Nail Trends'], 100),
  ('step-by-step-10-minute-everyday-makeup-routine', 'Step-by-Step 10-Minute Everyday Makeup Routine', 'Quick everyday makeup routine demonstration at Natural Beauty Clinic & Academy.', 'Most people don''t need — or have time for — a full glam routine every morning. Here''s the quick, practical everyday routine I recommend to clients who want to look polished in 10 minutes or less.

## 1. Prep Your Skin (1 minute)

Apply a lightweight moisturizer and sunscreen. This is the single most important step — good skin prep means less makeup is needed overall.

## 2. Even Out with a Light Base (2 minutes)

Use a tinted moisturizer, BB cream, or light-coverage foundation with your fingers or a damp sponge for a quick, natural finish. Skip heavy full-coverage products for everyday wear — they take longer to apply and blend.

## 3. Conceal Only Where Needed (1 minute)

Spot-conceal under the eyes and any obvious blemishes rather than covering your whole face — this saves time and looks more natural.

## 4. Set with Minimal Powder (1 minute)

A light dusting of powder only on the T-zone keeps shine down without looking cakey or overdone.

## 5. Add Color to Cheeks (1 minute)

A cream or liquid blush blended with fingers is faster than powder and gives a natural flush. Apply to the apples of your cheeks and blend upward.

## 6. Define Eyes Quickly (2 minutes)

A neutral eyeshadow swept across the lid, a quick line of eyeliner along the upper lash line, and one coat of mascara is enough for daytime definition without a full eye look.

## 7. Shape Brows (1 minute)

A few quick strokes with a brow pencil or gel to fill sparse areas makes a bigger difference to your overall look than people expect.

## 8. Finish with Lips (1 minute)

A tinted lip balm or your everyday lipstick shade completes the look in seconds.

## Practical Tips

Keep your everyday kit to 6–7 products max — fewer decisions means faster mornings. Multi-use products (like a cream stick you can use on cheeks and lips) save real time. Practice the routine a few times on a day off so it becomes muscle memory before you need to rely on it for a rushed morning.', 'Makeup', 'Asmita Bista', '2026-08-13', array['Everyday Makeup Routine','Quick Makeup Nepal','10 Minute Makeup','Daily Makeup Tips','Natural Makeup Look'], 100),
  ('how-to-choose-the-right-foundation-shade', 'How to Choose the Right Foundation Shade', 'Foundation shade matching consultation at Natural Beauty Clinic & Academy.', 'Picking the wrong foundation shade is one of the most common makeup mistakes I see — even with beautiful application, the wrong shade makes everything look off. Here''s how to actually get it right.

## Understand Undertone First

Before shade depth, figure out your undertone: warm (yellow/golden), cool (pink/blue), or neutral (a mix of both). Check the veins on your wrist in natural light — greenish veins usually suggest warm undertones, bluish veins suggest cool, and if you can''t tell, you''re likely neutral.

## Test on Your Jawline, Not Your Hand

Your hand and face rarely match in tone. Always test foundation shades along your jawline and blend down toward your neck — the shade that disappears into your skin, rather than sitting as a visible line, is your match.

## Test in Natural Light

Indoor store lighting is notoriously unreliable. Step outside or near a window before deciding — a shade that looks perfect under fluorescent lights can look completely wrong in daylight.

## Consider Seasonal Changes

Your skin tone shifts slightly with sun exposure across the year. Many people need a slightly different foundation shade in summer versus winter — it''s normal, not a sign you chose wrong the first time.

## When Between Two Shades

If you''re between two shades, size down rather than up — foundation almost always oxidizes slightly darker after 15–20 minutes on the skin, so the lighter of the two options usually ends up being the better match.

## Practical Tips

Always let the foundation sit for a few minutes before deciding — first impressions can be misleading before it settles and oxidizes. Bring a small mirror and check your match against your neck and chest, not just your face, to avoid an obvious mismatch line. If you''re unsure, ask for a professional shade-matching consultation rather than guessing — it takes a few minutes and saves you from an expensive mistake.

A well-matched foundation should be nearly invisible on the skin — the goal is even, natural-looking coverage, not a visible layer of product.', 'Makeup', 'Asmita Bista', '2026-08-15', array['Foundation Shade Matching','Choose Foundation Shade','Makeup Tips Nepal','Foundation Undertone','Makeup Matching Guide'], 100)
on conflict (slug) do nothing;
