import { getBlogPosts, getProducts } from "@/lib/get-data";

const base = "https://naturalbeauty.com.np";

const staticRoutes = [
  "", "/about", "/services", "/academy", "/compare-courses", "/gallery", "/products", "/team", "/contact",
  "/appointment", "/blog", "/testimonials", "/faq",
  "/privacy", "/terms", "/refund-policy", "/cookie-policy",
];

export async function GET() {
  const now = new Date().toISOString();
  const [blogPosts, products] = await Promise.all([getBlogPosts(), getProducts()]);
  const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
  const productRoutes = products.map((p) => `/products/${p.slug}`);
  const urls = [...staticRoutes, ...blogRoutes, ...productRoutes];

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
