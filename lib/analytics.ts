import { sendGAEvent } from "@next/third-parties/google";

// Central GA4 event helpers, built on @next/third-parties' official
// sendGAEvent utility (writes to window.dataLayer). Safe to call even
// before GA has loaded or if consent was declined — sendGAEvent no-ops
// gracefully when the dataLayer/gtag isn't present yet.

function track(eventName: string, params: Record<string, unknown> = {}) {
  sendGAEvent("event", eventName, params);
}

// ---------- Page views (manual SPA tracking) ----------
export function trackPageView(path: string) {
  track("page_view", { page_path: path });
}

// ---------- Contact / outreach ----------
export const trackWhatsAppClick = () => track("whatsapp_click");
export const trackPhoneClick = () => track("phone_click");
export const trackEmailClick = () => track("email_click");
export const trackGoogleMapsClick = () => track("google_maps_click");
export const trackSocialClick = (platform: "facebook" | "instagram" | "tiktok" | "youtube") =>
  track("social_click", { platform });
export const trackContactFormSubmit = () => track("contact_form_submit");
export const trackNewsletterSignup = () => track("newsletter_signup");

// ---------- Bookings / enrollment ----------
export const trackAppointmentBooking = (serviceName?: string) =>
  track("appointment_booking", { service_name: serviceName });
export const trackCourseEnrollment = (courseName: string) =>
  track("course_enrollment", { course_name: courseName });
export const trackProductInquiry = (productName: string) =>
  track("product_inquiry", { product_name: productName });
export const trackBrochureDownload = (name?: string) => track("download_brochure", { name });
export const trackCertificateDownload = (studentName?: string) =>
  track("certificate_download", { student_name: studentName });

// ---------- Content engagement ----------
export const trackSearch = (query: string) => track("search", { search_term: query });
export const trackGalleryImageView = (category: string, caption?: string) =>
  track("gallery_image_view", { category, caption });
export const trackBlogRead = (title: string, category?: string) =>
  track("blog_read", { title, category });
export const trackCourseDetailsViewed = (courseName: string) =>
  track("course_details_viewed", { course_name: courseName });
export const trackServiceDetailsViewed = (serviceName: string, category?: string) =>
  track("service_details_viewed", { service_name: serviceName, category });
export const trackReviewSubmitted = (rating: number) => track("review_submitted", { rating });

// ---------- Auth (fired from admin/student login flows) ----------
export const trackAdminLogin = () => track("admin_login");
export const trackStudentLogin = () => track("student_login");

// ---------- Ecommerce-ready (for future product store) ----------
export const trackViewItem = (item: { id: string; name: string; price?: number }) =>
  track("view_item", { items: [item] });
export const trackAddToCart = (item: { id: string; name: string; price?: number; quantity?: number }) =>
  track("add_to_cart", { items: [item] });
export const trackBeginCheckout = (items: unknown[], value?: number) =>
  track("begin_checkout", { items, value });
export const trackPurchase = (transactionId: string, items: unknown[], value: number) =>
  track("purchase", { transaction_id: transactionId, items, value, currency: "NPR" });
