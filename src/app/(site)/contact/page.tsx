import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { SplitHeading } from "@/components/split-heading";
import { getContactPage, getServicesPage, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return pageMetadata({
    title: page.searchTitle || "Contact",
    description: page.searchDescription,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [page, servicesPage, settings] = await Promise.all([
    getContactPage(),
    getServicesPage(),
    getSettings(),
  ]);

  return (
    <>
      <section className="sage-band">
        <div className="page-gutter py-f89 md:py-f144">
          <SplitHeading text={page.heading} className="type-display max-w-[14ch]" />
        </div>
      </section>
      <section className="page-gutter golden mt-f89 md:mt-f144">
        <div className="golden-minor">
          <p className="text-trim max-w-[40ch] text-lg text-muted">{page.intro}</p>
          <p className="type-label mt-f34 text-muted">Or email</p>
          <a href={`mailto:${settings.contactEmail}`} className="text-link mt-f8 text-base">
            {settings.contactEmail}
          </a>
        </div>
        <div className="golden-major">
          <BookingForm
            services={servicesPage.services.map((service) => service.name)}
            email={settings.contactEmail}
            successMessage={page.successMessage}
          />
        </div>
      </section>
    </>
  );
}
