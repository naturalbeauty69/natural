import type { Metadata } from "next";
import LegalPageView from "@/components/LegalPageView";
import { refundPolicy } from "@/data/legal";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return <LegalPageView page={refundPolicy} />;
}
