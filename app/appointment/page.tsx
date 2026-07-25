import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import AppointmentForm from "@/components/AppointmentForm";
import { getServices } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book your appointment at Natural Beauty Clinic & Academy, New Baneshwor.",
};

export default async function AppointmentPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <SectionHeading
        eyebrow="Book an Appointment"
        title="Reserve your slot."
        description="Submit your details and preferred time — our front desk will confirm by phone or WhatsApp."
        align="center"
      />
      <div className="mt-10">
        <AppointmentForm services={services} />
      </div>
    </div>
  );
}
