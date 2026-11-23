"use client";

import { usePathname } from "next/navigation";
import { BookingForm } from "./booking-form";
import { Reveal } from "./reveal";
import { SplitHeading } from "./split-heading";

/** The closing prompt and a short booking form. Left out on Contact, which has the full form. */
export function FooterBooking({
  heading,
  services,
  email,
  successMessage,
}: {
  heading: string;
  services: string[];
  email: string;
  successMessage: string;
}) {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <section className="footer-booking grid gap-f55 py-f89 md:py-f144 lg:grid-cols-13 lg:gap-x-f21">
      <SplitHeading
        as="h2"
        text={heading}
        className="type-display max-w-[11ch] lg:col-span-5 lg:text-[clamp(3.25rem,5.4vw,5.5rem)]"
      />
      <Reveal delay={160} className="min-w-0 lg:col-span-8 lg:col-start-6">
        <BookingForm compact services={services} email={email} successMessage={successMessage} />
      </Reveal>
    </section>
  );
}
