import type { Metadata } from "next";
import { Fraunces, Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/nav/FloatingActions";
import SplashScreen from "@/components/SplashScreen";
import Analytics from "@/components/analytics/Analytics";
import GlobalSchema from "@/components/schema/GlobalSchema";
import { getContactSettings, getSeoSettings } from "@/lib/get-data";
import { companyProfile } from "@/data/company";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  const defaultTitle = seo?.defaultTitle || "Natural Beauty Clinic & Academy | Kathmandu";
  const titleTemplate = seo?.titleTemplate || "%s | Natural Beauty Clinic & Academy";
  const description = seo?.defaultDescription || companyProfile.shortDescription;
  const keywords = seo?.keywords
    ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : companyProfile.seoKeywords;

  return {
    metadataBase: new URL("https://naturalbeauty.com.np"),
    title: { default: defaultTitle, template: titleTemplate },
    description,
    keywords,
    robots: seo?.robotsIndex === false ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: defaultTitle,
      description,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContactSettings();

  return (
    <html lang="en" className={`${fraunces.variable} ${sora.variable} ${plexMono.variable}`}>
      <body>
        <GlobalSchema contact={contact} />
        <SplashScreen />
        <Header contact={contact} />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer contact={contact} />
        <FloatingActions contact={contact} />
        <Analytics />
      </body>
    </html>
  );
}
