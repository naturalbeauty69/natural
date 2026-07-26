import type { Metadata } from "next";
import Image from "next/image";
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
      <Image src="/images/logo/icon-booking.png" alt="" width={48} height={48} className="mx-auto h-12 w-12" />
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
