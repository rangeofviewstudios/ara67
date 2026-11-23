import type { ReactNode } from "react";
import { FooterLogo } from "./footer-logo";
import { ThemeToggle } from "./theme-toggle";

export function Footer({
  email,
  credits,
  children,
}: {
  email: string;
  credits: ReactNode;
  children?: ReactNode;
}) {
  return (
    <footer className="panel mt-section">
      <div className="page-gutter pb-24 md:pb-f55">
        {children}
        <div className="flex flex-col gap-f8 border-t border-line pt-f21 first:border-t-0 md:flex-row md:items-center md:justify-between md:gap-f34 md:pt-f34 lg:grid lg:grid-cols-13 lg:gap-x-f21">
          <a href={`mailto:${email}`} className="text-link self-start md:self-auto lg:col-span-5 lg:w-fit">
            {email}
          </a>
          <div className="lg:col-span-8 lg:col-start-6">
            <ThemeToggle />
          </div>
        </div>
        <div className="footer-end mt-f55 grid gap-f34 md:mt-f89 md:grid-cols-[1fr_3fr]">
          <FooterLogo />
          {credits}
        </div>
      </div>
    </footer>
  );
}
