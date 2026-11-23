import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLabel } from "@/components/button-label";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { ServiceTimeline } from "@/components/service-timeline";
import { SplitHeading } from "@/components/split-heading";
import { getServicesPage } from "@/lib/content";
import { absoluteUrl, organizationId, pageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage();
  return pageMetadata({
    title: page.searchTitle || "Services",
    description: page.searchDescription,
    path: "/services",
  });
}

export default async function ServicesPage() {
  const page = await getServicesPage();

  return (
    <>
      <JsonLd
        data={{
          "@graph": [
            ...page.services.map((service) => ({
              "@type": "Service",
              name: service.name,
              description: service.summary,
              provider: { "@id": organizationId },
              url: absoluteUrl("/services"),
            })),
            ...(page.faq.length
              ? [
                  {
                    "@type": "FAQPage",
                    url: absoluteUrl("/services"),
                    mainEntity: page.faq.map((item) => ({
                      "@type": "Question",
                      name: item.question,
                      acceptedAnswer: { "@type": "Answer", text: item.answer },
                    })),
                  },
                ]
              : []),
          ],
        }}
      />
      <section className="sage-band">
        <div className="page-gutter golden py-f89 md:py-f144">
          <SplitHeading text={page.heading} className="type-display golden-full max-w-[16ch]" />
          <p className="golden-major max-w-[46ch] text-lg text-muted">{page.intro}</p>
        </div>
      </section>

      <section className="page-gutter">
        <ServiceTimeline services={[...page.services]} />

        <Link href="/contact" className="button-primary mt-f55 md:mt-f89">
          <ButtonLabel>Book a conversation</ButtonLabel>
        </Link>
      </section>

      {page.faq.length > 0 && (
        <section className="faq-band mt-section">
          <div className="page-gutter golden">
            <SplitHeading as="h2" text={page.faqHeading} className="type-heading golden-minor" />
            <div className="golden-major">
              {page.faq.map((item, index) => (
                <Reveal
                  key={item.question}
                  className={`py-f21 md:py-f34 ${index === 0 ? "pt-0 md:pt-0" : "draw-line"}`}
                >
                  <h3 className="text-trim text-[21px] leading-snug font-bold tracking-[-0.02em]">
                    {item.question}
                  </h3>
                  <p className="mt-f13 max-w-[52ch] text-muted">{item.answer}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
