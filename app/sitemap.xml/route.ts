import { getBlogPosts } from "@/lib/get-data";

const base = "https://naturalbeauty.com.np";

const staticRoutes = [
  "", "/about", "/services", "/academy", "/compare-courses", "/gallery", "/team", "/contact",
  "/appointment", "/blog", "/testimonials", "/faq",
  "/privacy", "/terms", "/refund-policy", "/cookie-policy",
];

export async function GET() {
  const now = new Date().toISOString();
  const blogPosts = await getBlogPosts();
  const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
  const urls = [...staticRoutes, ...blogRoutes];

  const body = urls
    .map(
      (route) => `  <url>
    <loc>${base}${route}</loc>
    <lastmod>${now}</lastmod>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
