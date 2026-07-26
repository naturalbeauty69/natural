import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Natural Beauty Clinic & Academy",
    short_name: "Natural Beauty",
    description: "Professional Beauty, Skin & Hair Care | Training & Certification",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F5EE",
    theme_color: "#0E4B3C",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
