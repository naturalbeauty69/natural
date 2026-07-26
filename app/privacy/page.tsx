import type { Metadata } from "next";
import LegalPageView from "@/components/LegalPageView";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return <LegalPageView page={privacyPolicy} />;
}
