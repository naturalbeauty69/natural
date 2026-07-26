export interface LegalSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface LegalPage {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export const privacyPolicy: LegalPage = {
  title: "Privacy Policy",
  lastUpdated: "July 2026",
  intro:
    "At Natural Beauty Clinic & Academy, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, use our services, or interact with us.",
  sections: [
    {
      heading: "1. Information We Collect",
      body: "We may collect the following information:",
      bullets: [
        "Full name", "Age and gender", "Phone number", "Email address", "Address",
        "Appointment details", "Skin and beauty consultation information",
        "Course registration details", "Payment-related information",
      ],
    },
    {
      heading: "2. How We Use Your Information",
      body: "Your information may be used for:",
      bullets: [
        "Booking appointments", "Providing beauty services", "Processing course registrations",
        "Providing customer support", "Sending updates about services, courses, and offers",
        "Improving our services and customer experience",
      ],
    },
    {
      heading: "3. Protection of Your Information",
      body: "We take appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure.",
    },
    {
      heading: "4. Sharing of Information",
      body: "We do not sell, trade, or share your personal information with third parties except when required by law or necessary to provide requested services.",
    },
    {
      heading: "5. Photos and Media",
      body: "Before using customer photos, testimonials, or treatment results for marketing purposes, we seek appropriate permission from the concerned individual.",
    },
    {
      heading: "6. Third-Party Links",
      body: "Our website may contain links to social media platforms or external websites. We are not responsible for the privacy practices of third-party websites.",
    },
    {
      heading: "7. Your Rights",
      body: "You may request access, correction, or deletion of your personal information by contacting us.",
    },
    {
      heading: "8. Contact Us",
      body: "Natural Beauty Clinic & Academy — New Baneshwor, Opposite the Overhead Bridge, Kathmandu, Nepal. Phone: +977 9843805588. Email: archanabeauty07@gmail.com",
    },
  ],
};

export const termsAndConditions: LegalPage = {
  title: "Terms & Conditions",
  lastUpdated: "July 2026",
  intro: "By accessing our website and using our services, you agree to the following terms and conditions.",
  sections: [
    {
      heading: "1. Services",
      body: "Natural Beauty Clinic & Academy provides professional beauty treatments, skincare, haircare services, makeup services, and beauty education programs.",
    },
    {
      heading: "2. Appointment Policy",
      bullets: [
        "Appointments are recommended before visiting.",
        "Customers should provide accurate information during booking.",
        "Late arrivals may affect appointment schedules.",
      ],
    },
    {
      heading: "3. Course Enrollment",
      bullets: [
        "Students must provide accurate registration information.",
        "Course fees and schedules must be confirmed before enrollment.",
        "Students must follow academy rules, safety guidelines, and practical training requirements.",
      ],
    },
    {
      heading: "4. Service Results",
      body: "Beauty treatment results may vary depending on individual skin type, hair condition, lifestyle, and aftercare practices.",
    },
    {
      heading: "5. Health Information",
      body: "Clients should inform us about allergies, medical conditions, previous treatments, or product sensitivities before receiving services.",
    },
    {
      heading: "6. Website Content",
      body: "All website content, images, logos, and materials belong to Natural Beauty Clinic & Academy and may not be copied without permission.",
    },
    {
      heading: "7. Changes to Terms",
      body: "We reserve the right to update these terms and conditions when necessary.",
    },
  ],
};

export const refundPolicy: LegalPage = {
  title: "Refund Policy",
  lastUpdated: "July 2026",
  intro:
    "At Natural Beauty Clinic & Academy, we aim to provide high-quality services and training. Our refund policy is designed to maintain fairness for both clients and students.",
  sections: [
    {
      heading: "1. Beauty Services",
      bullets: [
        "Payments made for completed beauty treatments are non-refundable.",
        "If a service issue occurs, customers should contact us within a reasonable time for assistance.",
      ],
    },
    {
      heading: "2. Course Fees",
      bullets: [
        "Course registration fees may be non-refundable after enrollment confirmation.",
        "Refund requests will be reviewed based on individual circumstances.",
        "Once classes or training materials have started, refunds may not be available.",
      ],
    },
    {
      heading: "3. Cancellation",
      bullets: [
        "Appointment cancellations should be informed in advance.",
        "Failure to attend scheduled appointments may result in loss of booking priority.",
      ],
    },
    {
      heading: "4. Product Purchases",
      body: "Products sold may only be exchanged or refunded according to product condition and applicable policies.",
    },
    {
      heading: "5. Contact for Refund Requests",
      body: "Phone: +977 9843805588. Email: archanabeauty07@gmail.com",
    },
  ],
};

export const cookiePolicy: LegalPage = {
  title: "Cookie Policy",
  lastUpdated: "July 2026",
  intro: "Natural Beauty Clinic & Academy uses cookies and similar technologies to improve website performance and user experience.",
  sections: [
    {
      heading: "1. What Are Cookies?",
      body: "Cookies are small data files stored on your device when you visit a website. They help websites remember user preferences and improve functionality.",
    },
    {
      heading: "2. How We Use Cookies",
      body: "Cookies may be used for:",
      bullets: [
        "Website functionality", "Remembering user preferences", "Understanding website traffic",
        "Improving website performance", "Providing a better browsing experience",
      ],
    },
    {
      heading: "3. Third-Party Cookies",
      body: "Some third-party services such as social media links, analytics tools, or embedded content may use their own cookies according to their privacy policies.",
    },
    {
      heading: "4. Managing Cookies",
      body: "You can control or disable cookies through your browser settings. However, disabling cookies may affect some website features.",
    },
    {
      heading: "5. Policy Updates",
      body: "We may update this Cookie Policy periodically to reflect changes in our website and services.",
    },
  ],
};
