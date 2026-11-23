import Link from "next/link";
import { anchorFor } from "@/lib/anchor";
import { LocalTime } from "./local-time";
import { Perimeter } from "./logo";
import { Reveal } from "./reveal";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

const PROFILE_NAMES: Record<string, string> = { linkedin: "LinkedIn", youtube: "YouTube" };

function profileName(link: string) {
  const site = new URL(link).hostname.replace(/^www\./, "").split(".")[0];
  return PROFILE_NAMES[site] ?? site.charAt(0).toUpperCase() + site.slice(1);
}

/** The footer's closing credits, set like the end card of a film. */
export function FooterCredits({
  services,
  profiles,
  location,
  coordinates,
  timeZone,
}: {
  services: string[];
  profiles: string[];
  location?: string | null;
  coordinates?: string | null;
  timeZone: string;
}) {
  return (
    <div className="footer-credits">
      <Reveal>
        <h2 className="type-label text-muted">Pages</h2>
        <ul className="mt-2">
          {PAGES.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="credit-link hover-line">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="type-label text-muted">Services</h2>
        <ul className="mt-2">
          {services.map((service) => (
            <li key={service}>
              {/* A plain link, so moving between phases on Services fires a hash change. */}
              <a href={`/services#${anchorFor(service)}`} className="credit-link hover-line">
                {service}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      {profiles.length > 0 && (
        <Reveal delay={160}>
          <h2 className="type-label text-muted">Follow</h2>
          <ul className="mt-2">
            {profiles.map((profile) => (
              <li key={profile}>
                <a
                  href={profile}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="credit-link hover-line"
                >
                  {profileName(profile)}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal delay={profiles.length > 0 ? 240 : 160} className="credit-place">
        <h2 className="type-label text-muted">
          <Perimeter />
          {location}
        </h2>
        <div className="type-label mt-3 flex flex-col gap-2 sm:mt-[11px]">
          <p className="text-balance">{coordinates}</p>
          <p className="min-h-[1.4em]">
            <LocalTime timeZone={timeZone} />
          </p>
        </div>
      </Reveal>
    </div>
  );
}
