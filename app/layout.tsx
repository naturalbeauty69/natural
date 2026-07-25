import type { Metadata } from "next";
import { Fraunces, Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContactSettings } from "@/lib/get-data";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://naturalbeautyclinic.com.np"),
  title: {
    default: "Natural Beauty Clinic & Academy | Kathmandu",
    template: "%s | Natural Beauty Clinic & Academy",
  },
  description:
    "Professional Beauty, Skin & Hair Care | Training & Certification — New Baneshwor, Kathmandu.",
  openGraph: {
    title: "Natural Beauty Clinic & Academy",
    description: "Professional Beauty, Skin & Hair Care | Training & Certification",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContactSettings();

  return (
    <html lang="en" className={`${fraunces.variable} ${sora.variable} ${plexMono.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer contact={contact} />
      </body>
    </html>
  );
}
