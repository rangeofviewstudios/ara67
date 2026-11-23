import Link from "next/link";
import { HeroMedia } from "@/components/hero-media";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { WorkIndex } from "@/components/work-index";
import { anchorFor } from "@/lib/anchor";
import { getHome, getProjects, getServicesPage } from "@/lib/content";

/** How many projects the Selected work list shows. */
const SELECTED_WORK_COUNT = 9;

function SectionHead({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <Reveal plain className="draw-line ticks flex items-end justify-between gap-f21 pt-f34 md:pt-f55">
      <SplitHeading as="h2" text={title} className="type-heading" />
      <Link href={href} className="text-link shrink-0">
        {linkLabel}
      </Link>
    </Reveal>
  );
}

export default async function HomePage() {
  const [home, projects, servicesPage] = await Promise.all([
    getHome(),
    getProjects(),
    getServicesPage(),
  ]);
  const selected = projects.filter((project) => project.featured).slice(0, SELECTED_WORK_COUNT);

  return (
    <div className="home-dark">
      <section className="page-gutter pt-f89 text-center md:pt-[120px]">
        <SplitHeading text={home.heroHeadline} className="type-hero mx-auto" />
        <div className="hero-rise mt-f34">
          <p className="hero-intro mx-auto max-w-[822px]">{home.heroIntro.replace(/\*\*/g, "")}</p>
          <div className="mt-f34 flex flex-wrap items-center justify-center gap-[12px]">
            <Link href="/contact" className="pill pill-quiet">
              Start a project&nbsp;&nbsp;→
            </Link>
            <a href="#reel" className="pill pill-outline">
              ▶&nbsp;&nbsp;Watch reel
            </a>
          </div>
        </div>
      </section>

      <HeroMedia photo={home.heroPhoto} reelUrl={home.heroReelUrl} />

      {home.statement && (
        <section className="statement-fit page-gutter pt-f34 pb-f55 md:pt-f55 md:pb-f89">
          <SplitHeading as="h2" text={home.statement} className="statement" />
        </section>
      )}

      <div className="home-card">
      <section className="page-gutter pt-section">
        <div className="breakdown-head">
          <p className="type-label">What we do</p>
          <SplitHeading as="h2" text={servicesPage.heading} className="type-heading" />
          <div className="flex flex-col items-start gap-f13">
            <p className="text-lg text-muted">{servicesPage.intro}</p>
            <Link href="/services" className="text-link">
              All services
            </Link>
          </div>
        </div>
        <ol className="breakdown mt-f55 md:mt-f89">
          {servicesPage.services.map((service, index) => (
            <li key={service.name} className="breakdown-item">
              <Reveal plain delay={index * 300} className="draw-line h-full">
                <Link href={`/services#${anchorFor(service.name)}`} className="breakdown-link">
                  <span className="breakdown-top">
                    <span aria-hidden="true" className="work-arrow">
                      →
                    </span>
                  </span>
                  <span className="breakdown-name">{service.name}</span>
                  <span className="breakdown-summary">{service.summary}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>

        {home.quote && (
          <Reveal className="mt-f89 md:mt-f144">
            <figure className="quote">
              <blockquote className="quote-text">&ldquo;{home.quote}&rdquo;</blockquote>
              {home.quoteAttribution && (
                <figcaption className="type-label mt-f21 font-medium text-muted">
                  {home.quoteAttribution}
                </figcaption>
              )}
            </figure>
          </Reveal>
        )}
      </section>

      {selected.length > 0 && (
        <section className="page-gutter mt-section pb-f89">
          <SectionHead title={home.workHeading} href="/work" linkLabel="Full index" />
          <div className="mt-f34 md:mt-f55">
            <WorkIndex projects={selected} />
          </div>
        </section>
      )}
      </div>

      <div className="flex justify-center pt-f55">
        <Link href="/work" className="box-link type-mono">
          All work ({projects.length})
        </Link>
      </div>
    </div>
  );
}
