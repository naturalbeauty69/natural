import type { Metadata } from "next";
import LegalPageView from "@/components/LegalPageView";
import { termsAndConditions } from "@/data/legal";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return <LegalPageView page={termsAndConditions} />;
}
