import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://naturalbeautyclinic.com.np";
  const routes = ["", "/about", "/services", "/academy", "/team", "/contact", "/appointment"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
