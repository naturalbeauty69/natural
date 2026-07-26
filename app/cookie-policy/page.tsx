import type { Metadata } from "next";
import LegalPageView from "@/components/LegalPageView";
import { cookiePolicy } from "@/data/legal";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return <LegalPageView page={cookiePolicy} />;
}
