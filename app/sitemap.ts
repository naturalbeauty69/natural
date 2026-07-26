import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://naturalbeautyclinic.com.np";
  const routes = [
    "", "/about", "/services", "/academy", "/gallery", "/team", "/contact",
    "/appointment", "/blog", "/testimonials", "/faq",
    "/privacy", "/terms", "/refund-policy", "/cookie-policy",
  ];
  const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
  return [...routes, ...blogRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
