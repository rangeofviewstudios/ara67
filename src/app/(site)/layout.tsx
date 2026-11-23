import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { FooterBooking } from "@/components/footer-booking";
import { FooterCredits } from "@/components/footer-credits";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { PageCurtain } from "@/components/page-curtain";
import { ScrollTimecode } from "@/components/scroll-timecode";
import { StickyBook } from "@/components/sticky-book";
import { getContactPage, getHome, getServicesPage, getSettings } from "@/lib/content";
import { organizationId, publicEmail, siteUrl } from "@/lib/site";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, services, home, contact] = await Promise.all([
    getSettings(),
    getServicesPage(),
    getHome(),
    getContactPage(),
  ]);
  const email = publicEmail(settings.contactEmail);
  const sameAs = settings.socialLinks.filter((link): link is string => Boolean(link));

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "ProfessionalService",
              "@id": organizationId,
              name: "Ara67",
              url: siteUrl,
              description: settings.description,
              address: {
                "@type": "PostalAddress",
                addressLocality: settings.location,
                addressRegion: "GA",
                addressCountry: "US",
              },
              ...(email ? { email } : {}),
              ...(sameAs.length ? { sameAs } : {}),
              knowsAbout: services.services.map((service) => service.name),
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: "Ara67",
              publisher: { "@id": organizationId },
            },
          ],
        }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer
        email={settings.contactEmail}
        credits={
          <FooterCredits
            services={services.services.map((service) => service.name)}
            profiles={sameAs}
            location={settings.location}
            coordinates={settings.coordinates}
            timeZone={settings.timeZone}
          />
        }
      >
        <FooterBooking
          heading={home.contactHeading}
          services={services.services.map((service) => service.name)}
          email={settings.contactEmail}
          successMessage={contact.successMessage}
        />
      </Footer>
      <StickyBook />
      <ScrollTimecode />
      <PageCurtain />
    </div>
  );
}
